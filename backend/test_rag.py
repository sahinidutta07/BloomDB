from pathlib import Path

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from bloom_classifier import detect_bloom_level


BASE_DIR = Path(__file__).resolve().parent.parent
CHROMA_PATH = BASE_DIR / "data" / "chroma_db"

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectorstore = Chroma(
    persist_directory=str(CHROMA_PATH),
    embedding_function=embeddings
)

question = "Explain what a database is."

bloom_level = detect_bloom_level(question)

results = vectorstore.similarity_search(question, k=3)

print("\n===== BLOOM LEVEL =====")
print(bloom_level)

print("\n===== RETRIEVED CONTENT =====")

for i, document in enumerate(results, start=1):
    print(f"\n--- Result {i} ---")
    print(document.page_content)