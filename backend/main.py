from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from query_pipeline import process_question


app = FastAPI(title="BloomDB")


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class QuestionRequest(BaseModel):
    question: str
    bloom_level: str | None = None


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():
    return {
        "message": "BloomDB backend is running!"
    }


# ============================================================
# ASK BLOOMDB
# ============================================================

@app.post("/ask")
def ask_question(request: QuestionRequest):

    bloom_level, answer, source_info = process_question(
        request.question,
        request.bloom_level
    )

    return {
        "question": request.question,
        "bloom_level": bloom_level,
        "answer": answer,
        "source": source_info
    }