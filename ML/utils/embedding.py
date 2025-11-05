from langchain_community.embeddings import HuggingFaceEmbeddings

def get_embeddings(model_name="BAAI/bge-large-en-v1.5"):
    """Return embedding model object (not embeddings list)"""
    embeddings = HuggingFaceEmbeddings(model_name=model_name)
    return embeddings