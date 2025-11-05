from typing import List, Tuple, Dict, Any
from langchain_core.documents import Document

def docs_to_nodes(
    retrieved: List[Document] | List[Tuple[Document, float]],
    include_scores: bool = True,
) -> List[Dict[str, Any]]:
    """
    Convert retrieved docs into your JSON node shape:
    { rank, content, metadata }
    If scores are provided, they are placed under metadata["score"].
    """
    nodes: List[Dict[str, Any]] = []

    # Normalize to (doc, score|None)
    if retrieved and isinstance(retrieved[0], tuple):
        pairs: List[Tuple[Document, float]] = retrieved  # type: ignore
    else:
        pairs = [(d, None) for d in retrieved]  # type: ignore

    for i, (doc, score) in enumerate(pairs, start=1):
        meta = dict(getattr(doc, "metadata", {}) or {})
        if include_scores and score is not None:
            meta["score"] = float(score)
        nodes.append(
            {
                "rank": i,
                "content": getattr(doc, "page_content", ""),
                "metadata": meta,
            }
        )
    return nodes