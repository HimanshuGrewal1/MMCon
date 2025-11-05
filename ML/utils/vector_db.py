from typing import List, Optional, Dict, Any, Tuple
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
import json
import os
import re
import hashlib
from pathlib import Path

MAPPINGS_FILENAME = "chroma_collections_map.json"


def _sanitize_name(name: str, prefix: str = "pdf_") -> str:
    """
    Produce a Chroma-safe collection name from any input string.
    Ensures:
      - allowed chars: [A-Za-z0-9._-]
      - length 3..512
      - starts/ends with alnum
    Strategy:
      - keep stem+ext when possible, replace disallowed chars with '_'
      - if too short/purely invalid, use a deterministic hash suffix
    """
    name = Path(name).name  # drop any directory path
    # Replace disallowed characters
    name = re.sub(r"[^A-Za-z0-9._-]", "_", name)
    # Remove leading/trailing non-alnum
    name = re.sub(r"^[^A-Za-z0-9]+", "", name)
    name = re.sub(r"[^A-Za-z0-9]+$", "", name)
    if len(name) < 3:
        # append predictable data
        h = hashlib.sha1(name.encode("utf-8")).hexdigest()[:6]
        name = (name + "pdf" + h)[:6]
    if len(name) > 500:
        h = hashlib.sha1(name.encode("utf-8")).hexdigest()[:8]
        name = name[:500] + "_" + h
    result = f"{prefix}{name}"
    result = re.sub(r"^[^A-Za-z0-9]+", "", result)
    result = re.sub(r"[^A-Za-z0-9]+$", "", result)
    if len(result) < 3:
        result = "pdf_default"
    if len(result) > 1024:
        result = result[:1024]
    return result


def _mappings_path(persist_directory: Optional[str]) -> Optional[str]:
    if not persist_directory:
        return None
    Path(persist_directory).mkdir(parents=True, exist_ok=True)
    return os.path.join(persist_directory, MAPPINGS_FILENAME)


def _load_mappings(persist_directory: Optional[str]) -> Dict[str, str]:
    p = _mappings_path(persist_directory)
    if not p or not os.path.exists(p):
        return {}
    try:
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def _save_mapping(persist_directory: Optional[str], sanitized: str, original: str) -> None:
    p = _mappings_path(persist_directory)
    if not p:
        return
    mappings = _load_mappings(persist_directory)
    mappings[sanitized] = original
    with open(p, "w", encoding="utf-8") as f:
        json.dump(mappings, f, ensure_ascii=False, indent=2)


def build_chroma_index(
    chunks: List[Document],
    embedding_model,
    pdf_id: str,
    persist_directory: Optional[str] = None,
    collection_name: Optional[str] = None,
) -> Tuple[Chroma, str]:
    """
    Build a Chroma index for a single PDF.
    - Accepts any pdf_id (original filename) and guarantees a valid collection name.
    - Stores the mapping sanitized_collection_name -> original pdf_id in persist_directory.
    Returns: (Chroma db instance, used_collection_name)
    """
    # Ensure each chunk carries a 'source' tag (original filename)
    for d in chunks:
        d.metadata = {**(d.metadata or {}), "source": pdf_id, "original_filename": pdf_id}

    # Determine a safe collection name (if user supplied one, sanitize it; else derive from pdf_id)
    if collection_name:
        safe_name = _sanitize_name(collection_name)
    else:
        safe_name = _sanitize_name(pdf_id)

    # Create Chroma collection
    db = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory=persist_directory,
        collection_name=safe_name,
    )

    # Persist Chroma if directory provided
    if persist_directory:
        try:
            db.persist()
        except Exception:
            # If persist fails, we still return the db (in-memory)
            pass

    # Save mapping sanitized -> original filename so we can load it later by original name
    _save_mapping(persist_directory, safe_name, pdf_id)

    return db, safe_name


def load_chroma_index(
    embedding_model,
    pdf_id_or_collection_name: str,
    persist_directory: str,
) -> Tuple[Optional[Chroma], Optional[str]]:
    """
    Load an existing Chroma collection.
    You can pass either:
      - the original filename (pdf_id) used during upload, OR
      - the sanitized collection_name
    Returns: (db, used_collection_name) or (None, None) if not found.
    """
    mappings = _load_mappings(persist_directory)
    # If the input matches a sanitized name, use it directly; else try to find it in mappings values
    if pdf_id_or_collection_name in mappings:
        collection_name = pdf_id_or_collection_name
    else:
        # look up sanitized key by original filename
        collection_name = None
        for k, v in mappings.items():
            if v == pdf_id_or_collection_name:
                collection_name = k
                break
        # If still None, try sanitize as fallback
        if collection_name is None:
            collection_name = _sanitize_name(pdf_id_or_collection_name)

    try:
        db = Chroma(
            persist_directory=persist_directory,
            collection_name=collection_name,
            embedding_function=embedding_model,
        )
        return db, collection_name
    except Exception:
        return None, None


def similarity_search(
    db: Chroma,
    query: str,
    k: int = 3,
    filter_metadata: Optional[Dict[str, Any]] = None,
):
    return db.similarity_search(query, k=k, filter=filter_metadata)


def similarity_search_with_scores(
    db: Chroma,
    query: str,
    k: int = 3,
    filter_metadata: Optional[Dict[str, Any]] = None,
):
    return db.similarity_search_with_score(query, k=k, filter=filter_metadata)