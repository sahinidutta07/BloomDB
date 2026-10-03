from pathlib import Path

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma


BASE_DIR = Path(__file__).resolve().parent.parent
CHROMA_PATH = BASE_DIR / "data" / "chroma_db"


# Load the same embedding model used during ingestion
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# Connect to our existing ChromaDB
vectorstore = Chroma(
    persist_directory=str(CHROMA_PATH),
    embedding_function=embeddings
)


# Test question
query = "What is database normalization?"


# Retrieve the 3 most relevant textbook chunks
results = vectorstore.similarity_search(query, k=3)


print("\n===== RETRIEVED TEXT =====\n")

for i, document in enumerate(results, start=1):
    print(f"--- Result {i} ---")
    print(document.page_content)
    print()