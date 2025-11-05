"""
Step 2: Accept node IDs from client, retrieve full nodes from server storage,
refine with Gemini, extract edges, and return React Flow-compatible graph.

POST /process-graph
Body: { "project_id": "default", "node_ids": [0, 1, 2] }

Returns: { nodes: [...], edges: [...] } in React Flow format with colors
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import hashlib

router = APIRouter()

# Injected from main.py
node_storage: Dict[str, List[Dict]] = {}
gemini_processor = None

# Color palette for node types (matching your example)
NODE_COLORS = {
    "process": {"backgroundColor": "#3b82f6", "borderColor": "#1e40af"},      # Blue
    "decision": {"backgroundColor": "#a855f7", "borderColor": "#6d28d9"},      # Purple
    "calculation": {"backgroundColor": "#f97316", "borderColor": "#c2410c"},   # Orange
    "application": {"backgroundColor": "#ef4444", "borderColor": "#7f1d1d"},   # Red
    "definition": {"backgroundColor": "#16a34a", "borderColor": "#065f46"},    # Green
    "other": {"backgroundColor": "#6b7280", "borderColor": "#374151"},         # Gray
}

EDGE_COLORS = {
    "next": "#3b82f6",              # Blue
    "causes": "#ef4444",            # Red
    "depends_on": "#f97316",        # Orange
    "substep": "#a855f7",           # Purple
    "refers_to": "#16a34a",         # Green
    "cites": "#6b7280",             # Gray
    "other": "#9ca3af"              # Light Gray
}


def set_globals(storage: Dict, processor):
    """Called from main.py to inject dependencies."""
    global node_storage, gemini_processor
    node_storage = storage
    gemini_processor = processor


def _get_node_color(node_type: str = "process") -> Dict[str, str]:
    """Get color palette for a node type."""
    return NODE_COLORS.get(node_type, NODE_COLORS["other"])


def _get_edge_color(relation: str = "next") -> str:
    """Get color for edge relation type."""
    return EDGE_COLORS.get(relation, EDGE_COLORS["other"])


def _make_stable_id(label: str) -> str:
    """Create a stable, short ID from label for React Flow."""
    h = hashlib.sha1((label or "").encode("utf-8")).hexdigest()
    return h[:8]


# ===== MODELS (ONLY ONE DEFINITION) =====
class ProcessGraphRequest(BaseModel):
    project_id: str = "default"
    node_ids: List[int] = []  # Empty = use all nodes
    refine: bool = True
    extract_edges: bool = True
    top_k: Optional[int] = None
    min_confidence: float = 0.6


class ProcessGraphResponse(BaseModel):
    project_id: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    summary: Dict[str, Any]


class ReactFlowNode(BaseModel):
    id: str
    data: Dict[str, Any]
    position: Dict[str, int]
    type: str
    style: Dict[str, Any]


class ReactFlowEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str
    label: str
    style: Dict[str, str]
    animated: bool = True


# ===== ROUTE =====
@router.post("/process-graph", response_model=ProcessGraphResponse)
async def process_graph(req: ProcessGraphRequest):
    """
    Step 2 endpoint: Accept node IDs, refine nodes, extract edges, return React Flow graph.
    
    Request:
      - project_id: which project's stored nodes to use
      - node_ids: list of node indices (0, 1, 2, ...) from /query response (empty = use all)
      - refine: whether to refine nodes with Gemini
      - extract_edges: whether to extract edges with Gemini
      - min_confidence: minimum confidence threshold for edges
    
    Response:
      - nodes: React Flow node objects with colors, positions, styling
      - edges: React Flow edge objects with colors, labels
      - summary: counts and metadata
    """
    
    if not gemini_processor:
        raise HTTPException(status_code=500, detail="Gemini processor not initialized")
    
    if req.project_id not in node_storage:
        raise HTTPException(
            status_code=404,
            detail=f"No stored nodes for project '{req.project_id}'. Run /query first."
        )
    
    all_stored_nodes = node_storage[req.project_id]
    
    # If node_ids is empty, use all stored nodes
    if not req.node_ids or len(req.node_ids) == 0:
        req.node_ids = list(range(len(all_stored_nodes)))
    
    # Retrieve full nodes from storage using provided node IDs
    try:
        full_nodes = [all_stored_nodes[nid] for nid in req.node_ids if nid < len(all_stored_nodes)]
    except (IndexError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid node_ids")
    
    if not full_nodes:
        raise HTTPException(status_code=400, detail="No valid nodes found for given node_ids")
    
    print(f"Processing {len(full_nodes)} nodes for project '{req.project_id}'")
    
    try:
        # Step 1: Refine nodes with Gemini (optional)
        if req.refine:
            print("Refining nodes with Gemini...")
            full_nodes = gemini_processor.refine_nodes(full_nodes)
        
        # Step 2: Extract edges with Gemini (optional)
        edges_data = []
        if req.extract_edges:
            print("Extracting edges with Gemini...")
            top_k = req.top_k or min(6, len(full_nodes))
            edges_data = gemini_processor.extract_edges(
                nodes=full_nodes,
                top_k=top_k,
                include_sequential=True,
                min_confidence=req.min_confidence
            )
        
        # Step 3: Build externalId -> node mapping for edge resolution
        external_id_to_node = {n["externalId"]: n for n in full_nodes}
        
        # Step 4: Convert to React Flow format
        react_nodes = []
        react_edges = []
        
        # Position nodes in a grid layout
        y_step = 150
        x_step = 300
        
        for idx, node in enumerate(full_nodes):
            external_id = node["externalId"]
            node_type = node.get("type", "process")
            confidence = node.get("confidence", 1.0)
            
            # Position: spread horizontally if many nodes, vertically if few
            if len(full_nodes) <= 3:
                x = (idx - len(full_nodes) // 2) * x_step
                y = 0
            else:
                x = (idx % 3) * x_step
                y = (idx // 3) * y_step
            
            # Color based on node type
            colors = _get_node_color(node_type)
            
            # Build React Flow node
            react_node = {
                "id": external_id,
                "data": {
                    "label": node.get("refined_name") or node.get("name") or external_id,
                    "content": node.get("refined_content") or node.get("content", "")[:200],
                    "confidence": confidence,
                    "type": node_type
                },
                "position": {"x": x, "y": y},
                "type": "default",
                "style": {
                    "backgroundColor": colors["backgroundColor"],
                    "color": "white",
                    "fontWeight": "bold" if confidence > 0.8 else "500",
                    "border": f"2px solid {colors['borderColor']}",
                    "padding": 10,
                    "borderRadius": 12,
                    "width": 250,
                    "textAlign": "center",
                    "opacity": confidence
                }
            }
            react_nodes.append(react_node)
        
        # Convert edges to React Flow format
        edge_id_counter = 0
        for edge in edges_data:
            from_ext_id = edge.get("fromExternalId")
            to_ext_id = edge.get("toExternalId")
            relation = edge.get("relation", "next")
            confidence = edge.get("confidence", 1.0)
            rationale = edge.get("rationale", "")
            
            # Skip if nodes not in current set
            if from_ext_id not in external_id_to_node or to_ext_id not in external_id_to_node:
                continue
            
            edge_id_counter += 1
            react_edge = {
                "id": f"e{edge_id_counter}",
                "source": from_ext_id,
                "target": to_ext_id,
                "type": "smoothstep",
                "label": relation,
                "style": {
                    "stroke": _get_edge_color(relation),
                    "strokeWidth": 2 + (confidence * 2),
                    "opacity": confidence
                },
                "animated": confidence > 0.7,
                "data": {
                    "confidence": confidence,
                    "rationale": rationale
                }
            }
            react_edges.append(react_edge)
        
        # Build response
        response = ProcessGraphResponse(
            project_id=req.project_id,
            nodes=react_nodes,
            edges=react_edges,
            summary={
                "nodes_processed": len(full_nodes),
                "nodes_refined": len(full_nodes) if req.refine else 0,
                "edges_extracted": len(react_edges),
                "min_confidence_threshold": req.min_confidence,
                "refined": req.refine,
                "edges_extracted_flag": req.extract_edges
            }
        )
        
        print(f"✓ Graph processed: {len(react_nodes)} nodes, {len(react_edges)} edges")
        return response
        
    except Exception as e:
        print(f"Error in process_graph: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))