"""
Gemini Pro-based node refinement and edge extraction using JSON prompting.

Design:
- Use google.generativeai SDK (simple, direct).
- Send retrieved nodes as JSON, get back refined nodes + edges as JSON.
- Two-step pipeline: (1) refine nodes, (2) extract edges.
- Temperature=0 for deterministic output.
- Uses JSON mode / structured output where available.

Usage:
  from utils.gemini_edge_extraction import GeminiGraphProcessor
  processor = GeminiGraphProcessor(api_key="your-gemini-api-key")
  
  # Refine nodes
  refined_nodes = processor.refine_nodes(nodes)
  
  # Extract edges
  edges = processor.extract_edges(refined_nodes)
  
  # Or all-in-one
  graph = processor.process_graph(nodes)
  # Returns: { nodes: [...], edges: [...] }
"""

import json
import time
from typing import List, Dict, Any, Optional

try:
    import google.generativeai as genai
except ImportError:
    raise ImportError("Install google-generativeai: pip install google-generativeai")


class GeminiGraphProcessor:
    """
    Wrapper around Gemini Pro API for node refinement and edge extraction.
    """

    def __init__(self, api_key: str, model: str = "gemini-2.0-flash-lite", temperature: float = 0.0):
        """
        Initialize with Gemini API key.
        
        Args:
          api_key: Google Gemini API key
          model: model name, default 'gemini-pro'
          temperature: 0.0 for deterministic output
        """
        genai.configure(api_key=api_key)
        self.model_name = model
        self.temperature = temperature
        self.model = genai.GenerativeModel(
            self.model_name,
            generation_config=genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=2048
            )
        )

    def _call_gemini(self, prompt: str, max_retries: int = 2) -> str:
        """
        Call Gemini API with retry on rate limit / transient errors.
        """
        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(prompt)
                return response.text
            except Exception as e:
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # exponential backoff
                    print(f"Gemini API error (attempt {attempt + 1}): {e}. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    raise

    def _safe_json_loads(self, s: str) -> Optional[Dict[str, Any]]:
        """
        Extract and parse JSON from text, handling partial or embedded JSON.
        """
        s = s.strip()
        # Try to find first {...} substring
        try:
            start = s.index("{")
            end = s.rindex("}") + 1
            sub = s[start:end]
            return json.loads(sub)
        except Exception:
            pass
        # Fallback: try entire string as JSON
        try:
            return json.loads(s)
        except Exception:
            return None

    def refine_nodes(self, nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Refine node names and content for clarity and conciseness.
        
        Input nodes: must have 'externalId', 'content', and optionally 'name'.
        Output nodes: adds 'refined_name' and 'refined_content' fields.
        """
        refined_nodes = []

        prompt_template = """You are a text refinement assistant. Given a research paper passage, produce:
1. refined_name: a concise 3-8 word label capturing the main idea
2. refined_content: a 50-100 words sentence summary of the passage, clear and grammatically correct

Input passage:
---
{content}
---

Output ONLY a valid JSON object (no markdown, no extra text) with keys:
{{
  "refined_name": "<concise label>",
  "refined_content": "<1-2 sentence summary>",
  "refine_confidence": 0.95
}}

Ensure the refined_content is grammatically correct, precise, and uses academic English.
"""

        for node in nodes:
            content = node.get("content", "")[:1500]  # cap length
            prompt = prompt_template.format(content=content)

            response_text = self._call_gemini(prompt)
            parsed = self._safe_json_loads(response_text)

            refined_node = dict(node)  # copy all fields
            if parsed:
                refined_node["refined_name"] = parsed.get("refined_name", node.get("name", ""))
                refined_node["refined_content"] = parsed.get("refined_content", node.get("content", ""))
                try:
                    refined_node["refine_confidence"] = float(parsed.get("refine_confidence", 1.0))
                except Exception:
                    refined_node["refine_confidence"] = 1.0
            else:
                # Fallback: use original fields
                refined_node["refined_name"] = node.get("name", "").strip()[:150] or content.splitlines()[0][:80]
                refined_node["refined_content"] = content.splitlines()[0][:400]
                refined_node["refine_confidence"] = node.get("confidence", 1.0)

            refined_nodes.append(refined_node)
            # Rate limit: small delay between calls
            time.sleep(0.1)

        return refined_nodes

    def extract_edges(
        self,
        nodes: List[Dict[str, Any]],
        top_k: int = 6,
        include_sequential: bool = True,
        min_confidence: float = 0.6
    ) -> List[Dict[str, Any]]:
        """
        Extract directed edges between nodes using Gemini.
        
        Approach:
          1. Use top_k nodes (ranked by confidence).
          2. Generate all candidate pairs (from, to).
          3. Ask Gemini to evaluate each pair and decide if there's a relation.
          4. Filter by min_confidence.
        
        Returns list of edge dicts: { fromExternalId, toExternalId, relation, confidence, rationale, evidence_snippet, metadata }
        """
        # Use top_k highest-confidence nodes
        sorted_nodes = sorted(nodes, key=lambda n: n.get("confidence", 1.0), reverse=True)[:top_k]

        edges: List[Dict[str, Any]] = []

        # Always include sequential edges
        if include_sequential:
            for i in range(len(sorted_nodes) - 1):
                a = sorted_nodes[i]
                b = sorted_nodes[i + 1]
                edges.append({
                    "fromExternalId": a["externalId"],
                    "toExternalId": b["externalId"],
                    "relation": "next",
                    "confidence": 0.9,
                    "rationale": "sequential order in retrieval",
                    "evidence_snippet": a.get("refined_content", a.get("content", ""))[:300],
                    "metadata": {"source": "sequential_inference"}
                })

        # Generate candidate pairs and ask Gemini about each
        candidates = []
        for i in range(len(sorted_nodes)):
            for j in range(len(sorted_nodes)):
                if i == j:
                    continue
                candidates.append((sorted_nodes[i], sorted_nodes[j]))

        # Batch candidates into groups for efficiency (max ~5 pairs per prompt to keep response manageable)
        batch_size = 5
        for batch_idx in range(0, len(candidates), batch_size):
            batch = candidates[batch_idx:batch_idx + batch_size]

            # Build a multi-pair prompt
            pair_strs = []
            for a, b in batch:
                a_content = a.get("refined_content", a.get("content", ""))[:400]
                b_content = b.get("refined_content", b.get("content", ""))[:400]
                pair_str = f"""
Pair: {a["externalId"]} -> {b["externalId"]}
Node A (name: {a.get("refined_name", a.get("name", ""))}):
{a_content}

Node B (name: {b.get("refined_name", b.get("name", ""))}):
{b_content}
"""
                pair_strs.append(pair_str)

            prompt = f"""You are analyzing relationships between research paper passages. For each pair below, decide if there is a directed relation from Node A to Node B.

Possible relation types: "next", "causes", "depends_on", "substep", "refers_to", "cites", "other", or null (no relation).

{chr(10).join(pair_strs)}

Return a JSON array with one object per pair. Each object has keys:
- fromExternalId (string)
- toExternalId (string)
- relation (string or null)
- confidence (0.0 to 1.0, only if relation is not null)
- rationale (short string explaining why)
- evidence_snippet (1-2 sentence excerpt from Node A or B supporting the relation, or empty string)

Example:
[
  {{"fromExternalId": "abc123", "toExternalId": "def456", "relation": "next", "confidence": 0.85, "rationale": "B extends A", "evidence_snippet": "..."}},
  {{"fromExternalId": "xyz789", "toExternalId": "lmn012", "relation": null, "confidence": 0.0, "rationale": "unrelated", "evidence_snippet": ""}}
]

Return ONLY the JSON array, no extra text.
"""

            response_text = self._call_gemini(prompt)
            parsed_array = self._safe_json_loads(response_text)

            if isinstance(parsed_array, list):
                for obj in parsed_array:
                    if isinstance(obj, dict) and obj.get("relation"):
                        conf = float(obj.get("confidence", 0.0))
                        if conf >= min_confidence:
                            edges.append({
                                "fromExternalId": obj.get("fromExternalId"),
                                "toExternalId": obj.get("toExternalId"),
                                "relation": obj.get("relation"),
                                "confidence": conf,
                                "rationale": obj.get("rationale", "")[:600],
                                "evidence_snippet": obj.get("evidence_snippet", "")[:600],
                                "metadata": {"source": "gemini_extraction"}
                            })
            # Small delay between batches
            time.sleep(0.2)

        # Deduplicate edges by (from, to, relation), keeping highest confidence
        dedupe_map = {}
        for e in edges:
            key = (e["fromExternalId"], e["toExternalId"], e["relation"])
            if key not in dedupe_map or e["confidence"] > dedupe_map[key]["confidence"]:
                dedupe_map[key] = e
        
        final_edges = list(dedupe_map.values())
        return final_edges

    def process_graph(
        self,
        nodes: List[Dict[str, Any]],
        refine: bool = True,
        extract_edges_flag: bool = True,
        **edge_kwargs
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        End-to-end pipeline: refine nodes and extract edges.
        
        Returns: { nodes: [...], edges: [...] }
        """
        if refine:
            nodes = self.refine_nodes(nodes)
        
        edges = []
        if extract_edges_flag:
            edges = self.extract_edges(nodes, **edge_kwargs)
        
        return {"nodes": nodes, "edges": edges}
    
