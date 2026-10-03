from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from query_pipeline import process_question


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(title="BloomDB")


# ============================================================
# CORS
# ============================================================

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


# ============================================================
# REQUEST MODEL
# ============================================================

class QuestionRequest(BaseModel):
    question: str


# ============================================================
# HOME ROUTE
# ============================================================

@app.get("/")
def home():

    return {
        "message": "BloomDB backend is running!"
    }


# ============================================================
# ASK ROUTE
# ============================================================

@app.post("/ask")
def ask_question(request: QuestionRequest):

    bloom_level, answer, source_info = process_question(
        request.question
    )

    return {
        "question": request.question,
        "bloom_level": bloom_level,
        "answer": answer,
        "source": source_info
    }