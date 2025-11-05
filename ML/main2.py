from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import List, Dict, Optional
import tempfile
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
load_dotenv() 
import hashlib  

from fastapi.middleware.cors import CORSMiddleware


def _make_external_id(label: str) -> str:
    """Create stable external ID from label."""
    h = hashlib.sha1((label or "").encode("utf-8")).hexdigest()
    return h[:12]

# --- Gemini Integration Imports ---
from routes.gemini_process import (
    router as gemini_process_router,
    set_globals as set_gemini_globals
)
from utils.gemini_edge_extraction import GeminiGraphProcessor

# --- Existing Utility Imports ---
from utils.loader import load_pdf
from utils.chunker import chunk_documents
from utils.embedding import get_embeddings
from utils.vector_db import build_chroma_index, similarity_search_with_scores


# ------------------ CONFIG ------------------
CHROMA_PERSIST_DIR = "chroma_store"



# ------------------ GLOBALS ------------------
vector_db = None
embedding_model = None
current_pdf_name = None
current_collection_name = None
node_storage: Dict[str, List[Dict]] = {}
gemini_processor = None  # NEW


# ------------------ MODELS ------------------
class QueryRequest(BaseModel):
    query: str
    top_k: int = 3
    project_id: Optional[str] = "default"


class SimplifiedNode(BaseModel):
    node_id: int
    distance: float
    similarity: float


class SimplifiedQueryResponse(BaseModel):
    query: str
    pdf_name: Optional[str]
    nodes: List[SimplifiedNode]
    total_results: int
    message: str


class DocumentNode(BaseModel):
    rank: int
    content: str
    metadata: Dict = {}


class QueryResponse(BaseModel):
    query: str
    pdf_name: Optional[str]
    nodes: List[DocumentNode]
    total_results: int


class StatusResponse(BaseModel):
    status: str
    message: str
    pdf_loaded: bool
    pdf_name: Optional[str]


# ------------------ APP LIFESPAN ------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global embedding_model, gemini_processor

    try:
        print("Loading embedding model at startup...")
        embedding_model = get_embeddings(model_name="intfloat/e5-large-v2")
        print("Embedding model loaded successfully.")
    except Exception as e:
        print(f"Failed to load embedding model at startup: {e}")
        embedding_model = None

    # --- Gemini Initialization ---
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if gemini_api_key:
        try:
            print("Initializing Gemini processor...")
            gemini_processor = GeminiGraphProcessor(api_key=gemini_api_key)
            set_gemini_globals(node_storage, gemini_processor)
            print("Gemini processor initialized successfully.")
        except Exception as e:
            print(f"Warning: Failed to initialize Gemini processor: {e}")
            gemini_processor = None
    else:
        print("Warning: GEMINI_API_KEY not set. Gemini features disabled.")

    yield
    print("Shutting down application.")


# ------------------ FASTAPI INIT ------------------
app = FastAPI(
    title="PDF RAG API",
    description="API for PDF semantic search using LangChain + Chroma + Gemini Graph",
    version="1.1.0",
    lifespan=lifespan,
)



from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include Gemini router
app.include_router(gemini_process_router)


# ------------------ HELPERS ------------------
def ensure_embeddings_loaded() -> None:
    global embedding_model
    if embedding_model is None:
        try:
            print("Embedding model missing; loading on-demand...")
            embedding_model = get_embeddings(model_name="intfloat/e5-large-v2")
            print("Embedding model loaded on-demand.")
        except Exception as e:
            print(f"On-demand embedding load failed: {e}")
            raise HTTPException(status_code=500, detail="Embedding model not loaded")


# ------------------ ROUTES ------------------
# @app.post("/upload-pdf", response_model=StatusResponse)
# async def upload_pdf(file: UploadFile = File(...)):
#     global vector_db, current_pdf_name, current_collection_name, embedding_model

#     if not file.filename.lower().endswith(".pdf"):
#         raise HTTPException(status_code=400, detail="Only PDF files are allowed")

#     ensure_embeddings_loaded()

#     try:
#         with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
#             content = await file.read()
#             tmp_file.write(content)
#             tmp_path = tmp_file.name

#         print(f"Loading PDF: {file.filename}")
#         docs = load_pdf(tmp_path)
#         print(f"Loaded {len(docs)} pages")

#         print("Chunking documents...")
#         chunks = chunk_documents(docs, chunk_size=800, chunk_overlap=150)
#         print(f"Created {len(chunks)} chunks")

#         print("Building Chroma vector store...")
#         db, used_collection_name = build_chroma_index(
#             chunks=chunks,
#             embedding_model=embedding_model,
#             pdf_id=file.filename,
#             persist_directory=CHROMA_PERSIST_DIR,
#             collection_name=None,
#         )

#         vector_db = db
#         current_pdf_name = file.filename
#         current_collection_name = used_collection_name
#         print(f"Vector store ready: {current_collection_name}")

#         os.unlink(tmp_path)
#         return StatusResponse(
#             status="success",
#             message=f"PDF '{file.filename}' processed successfully.",
#             pdf_loaded=True,
#             pdf_name=file.filename,
#         )

#     except Exception as e:
#         if 'tmp_path' in locals():
#             try:
#                 os.unlink(tmp_path)
#             except Exception:
#                 pass
#         raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    global vector_db, current_pdf_name, current_collection_name, embedding_model, gemini_processor, node_storage

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    ensure_embeddings_loaded()

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        print(f"Loading PDF: {file.filename}")
        docs = load_pdf(tmp_path)
        print(f"Loaded {len(docs)} pages")

        print("Chunking documents...")
        chunks = chunk_documents(docs, chunk_size=800, chunk_overlap=150)
        print(f"Created {len(chunks)} chunks")

        print("Building Chroma vector store...")
        db, used_collection_name = build_chroma_index(
            chunks=chunks,
            embedding_model=embedding_model,
            pdf_id=file.filename,
            persist_directory=CHROMA_PERSIST_DIR,
            collection_name=None,
        )

        vector_db = db
        current_pdf_name = file.filename
        current_collection_name = used_collection_name
        print(f"Vector store ready: {current_collection_name}")

        # --- Gemini Processing ---
        nodes, edges = [], []
        if gemini_processor:
            print("Extracting nodes and edges via Gemini...")
            try:
                nodes, edges = gemini_processor.process(chunks)
                print(f"Extracted {len(nodes)} nodes and {len(edges)} edges")
                
                # Store nodes in node_storage with proper externalId
                project_id = "upload_" + file.filename
                processed_nodes = []
                for i, node in enumerate(nodes):
                    external_id = _make_external_id(node.get('name', f"node_{i}"))
                    processed_nodes.append({
                        "externalId": external_id,
                        "node_id": i,
                        "name": node.get('name', f"Node {i}"),
                        "content": node.get('content', ''),
                        "type": node.get('type', 'concept'),
                        "confidence": node.get('confidence', 1.0),
                        "metadata": node.get('metadata', {})
                    })
                
                node_storage[project_id] = processed_nodes
                print(f"Stored {len(processed_nodes)} Gemini nodes for project '{project_id}'")
                
            except Exception as e:
                print(f"Gemini processing failed: {e}")
                # Don't fail the entire upload if Gemini fails
        else:
            print("Gemini processor not initialized; skipping graph extraction.")

        os.unlink(tmp_path)

        # Return comprehensive response
        return {
            "status": "success",
            "message": f"PDF '{file.filename}' processed successfully.",
            "pdf_loaded": True,
            "pdf_name": file.filename,
            "collection": current_collection_name,
            "gemini_processing": {
                "success": gemini_processor is not None,
                "nodes_count": len(nodes),
                "edges_count": len(edges),
                "nodes": nodes,  # Return the actual nodes
                "edges": edges   # Return the actual edges
            },
            "total_chunks": len(chunks)
        }

    except Exception as e:
        if 'tmp_path' in locals():
            try:
                os.unlink(tmp_path)
            except Exception:
                pass
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
@app.post("/query", response_model=SimplifiedQueryResponse)
async def query_documents(request: QueryRequest):
    global vector_db, current_pdf_name, node_storage, gemini_processor

    if vector_db is None:
        raise HTTPException(status_code=400, detail="No PDF loaded. Upload a PDF first.")
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        retrieved_pairs = similarity_search_with_scores(vector_db, request.query, k=request.top_k)
        full_nodes, simplified_nodes = [], []

        for i, (doc, score) in enumerate(retrieved_pairs, start=1):
            meta = dict(getattr(doc, "metadata", {}) or {})
            distance = float(score)
            similarity = 1.0 / (1.0 + float(score)) if score is not None else 0.0
            
            # Extract label/name from content
            content = getattr(doc, "page_content", "")
            label = content.split('\n')[0][:80] if content else f"node_{i}"
            external_id = _make_external_id(label)
            
            full_nodes.append({
                "externalId": external_id,  # ADD THIS
                "node_id": i - 1,
                "rank": i,
                "name": label,
                "content": content,
                "metadata": meta,
                "distance": distance,
                "similarity": similarity,
                "confidence": similarity,  # Use similarity as confidence
                "type": "process"  # Default type
            })
            simplified_nodes.append(SimplifiedNode(node_id=i - 1, distance=distance, similarity=similarity))

        project_id = request.project_id or "default"
        node_storage[project_id] = full_nodes
        print(f"Stored {len(full_nodes)} full nodes for project '{project_id}'")

        # --- Sync Gemini globals after query ---
        set_gemini_globals(node_storage, gemini_processor)

        return SimplifiedQueryResponse(
            query=request.query,
            pdf_name=current_pdf_name,
            nodes=simplified_nodes,
            total_results=len(simplified_nodes),
            message=f"Full node data stored for project '{project_id}'."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying documents: {str(e)}")

@app.delete("/reset", response_model=StatusResponse)
async def reset_database():
    global vector_db, current_pdf_name, current_collection_name
    try:
        vector_db = None
        current_pdf_name = None
        current_collection_name = None
        return StatusResponse(
            status="success",
            message="Vector database reset successfully",
            pdf_loaded=False,
            pdf_name=None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting database: {str(e)}")


@app.get("/current-pdf")
async def get_current_pdf():
    if vector_db is None:
        return {"pdf_loaded": False, "pdf_name": None, "message": "No PDF currently loaded"}
    return {"pdf_loaded": True, "pdf_name": current_pdf_name, "collection": current_collection_name}


@app.get("/stored-nodes/{project_id}")
async def get_stored_nodes(project_id: str = "default"):
    if project_id not in node_storage:
        raise HTTPException(status_code=404, detail=f"No stored nodes for project '{project_id}'")
    return {
        "project_id": project_id,
        "node_count": len(node_storage[project_id]),
        "nodes": node_storage[project_id],
    }


# ------------------ MAIN ------------------
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
