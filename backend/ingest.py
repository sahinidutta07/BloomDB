from pathlib import Path
import shutil
import fitz

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

BOOKS_DIR = BASE_DIR / "data" / "books"
CHROMA_PATH = BASE_DIR / "data" / "chroma_db"


# ============================================================
# CLEAR OLD CHROMA DATABASE
# ============================================================

if CHROMA_PATH.exists():
    shutil.rmtree(CHROMA_PATH)

print("Old ChromaDB cleared.")


# ============================================================
# READ ALL PDF BOOKS
# ============================================================

documents = []

pdf_files = sorted(BOOKS_DIR.glob("*.pdf"))

if not pdf_files:
    raise FileNotFoundError(
        f"No PDF books found in: {BOOKS_DIR}"
    )

print(f"\nFound {len(pdf_files)} PDF book(s).\n")


for pdf_path in pdf_files:

    print(f"Reading: {pdf_path.name}")

    pdf = fitz.open(pdf_path)

    book_name = pdf_path.stem
    page_count = len(pdf)

    for page_number, page in enumerate(pdf, start=1):

        text = page.get_text().strip()

        if not text:
            continue

        documents.append(
            Document(
                page_content=text,
                metadata={
                    "book": book_name,
                    "source": pdf_path.name,
                    "page": page_number
                }
            )
        )

    pdf.close()

    print(f"Pages processed: {page_count}")


print(
    f"\nLoaded {len(documents)} pages "
    f"from {len(pdf_files)} books."
)


# ============================================================
# SPLIT INTO CHUNKS
# ============================================================

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=150
)

chunks = text_splitter.split_documents(documents)

print(f"Created {len(chunks)} chunks.")


# ============================================================
# EMBEDDINGS
# ============================================================

print("\nLoading embedding model...")

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# ============================================================
# STORE IN CHROMADB
# ============================================================

print("\nCreating ChromaDB...")

Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory=str(CHROMA_PATH)
)


# ============================================================
# DONE
# ============================================================

print("\n======================================")
print("All PDF books successfully indexed!")
print("======================================")

print(f"\nBooks processed: {len(pdf_files)}")
print(f"Pages loaded: {len(documents)}")
print(f"Chunks created: {len(chunks)}")

print("\nChromaDB location:")
print(CHROMA_PATH)