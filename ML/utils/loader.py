from langchain_community.document_loaders import PyPDFLoader

def load_pdf(path: str):
    """Load PDF using PyPDFLoader"""
    loader = PyPDFLoader(path)
    return loader.load()