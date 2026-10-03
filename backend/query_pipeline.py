import os
import re
from pathlib import Path

from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI

from bloom_classifier import detect_bloom_level


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
CHROMA_PATH = BASE_DIR / "data" / "chroma_db"

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")


# ============================================================
# EMBEDDINGS
# ============================================================

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# ============================================================
# CHROMA DATABASE
# ============================================================

vectorstore = Chroma(
    persist_directory=str(CHROMA_PATH),
    embedding_function=embeddings
)


# ============================================================
# GEMINI
# ============================================================

llm = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    google_api_key=api_key
)


# ============================================================
# TEXT CLEANING
# ============================================================

def clean_text(text):
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# ============================================================
# SOURCE / BOOK / PAGE EXTRACTION
# ============================================================

def get_source_info(documents):

    sources = []

    for document in documents:

        book = document.metadata.get("book")
        source = document.metadata.get("source")
        page = document.metadata.get("page")

        if book and page:

            source_info = {
                "book": book,
                "source": source,
                "page": page
            }

        elif source:

            source_info = {
                "book": source,
                "source": source,
                "page": None
            }

        else:
            continue

        if source_info not in sources:
            sources.append(source_info)

    return sources


# ============================================================
# DISPLAY-FRIENDLY BOOK NAME
# ============================================================

def format_book_name(filename):

    book_names = {
        "fundamentals-of-database-systems.pdf":
            "Fundamentals of Database Systems — Elmasri & Navathe",

        "Abraham-Silberschatz-Henry-F.-Korth-S.-Sudarshan-Database-System-Concepts-McGraw-Hill-Education-2019.pdf":
            "Database System Concepts — Silberschatz, Korth & Sudarshan",

        "An-Introduction-to-Database-Systems-8e-By-C-J-Date-CodeBlah.com_.pdf":
            "An Introduction to Database Systems — C. J. Date",

        "ullman_the_complete_book.pdf":
            "The Complete Book — Ullman & Widom"
    }

    return book_names.get(
        filename,
        Path(filename).stem.replace("_", " ").replace("-", " ")
    )


# ============================================================
# CONCEPT EXTRACTION
# ============================================================

def extract_concept(question):

    question = question.lower().strip()

    patterns = [
        r"^what is an? (.+?)[?]?$",
        r"^what are (.+?)[?]?$",
        r"^define (.+?)[?]?$",
        r"^explain (.+?)[?]?$",
    ]

    for pattern in patterns:

        match = re.match(pattern, question)

        if match:
            return match.group(1).strip()

    return question


# ============================================================
# DBMS CONCEPT DEFINITIONS
# ============================================================

CONCEPT_DEFINITIONS = {

    "database":
        "A database is a collection of logically related data that can be stored, managed, and accessed systematically.",

    "dbms":
        "A DBMS (Database Management System) is software that allows users to create, define, manipulate, manage, and protect databases.",

    "database management system":
        "A Database Management System (DBMS) is software used to create, define, manipulate, manage, and provide controlled access to databases.",

    "table":
        "A table is a structure in a relational database that organizes data into rows and columns.",

    "field":
        "A field is a smaller unit of data within a record. In a table, fields correspond to attributes or columns.",

    "column":
        "A column is a set of values of a particular type in a relational table. It is also called an attribute.",

    "row":
        "A row is a single record in a relational table containing values for the attributes of that record.",

    "record":
        "A record is a collection of related fields representing one entity or instance in a database table.",

    "primary key":
        "A primary key is an attribute or combination of attributes that uniquely identifies each record in a table.",

    "candidate key":
        "A candidate key is a minimal set of attributes that can uniquely identify each record in a table.",

    "super key":
        "A super key is a set of one or more attributes that uniquely identifies each record in a table.",

    "foreign key":
        "A foreign key is an attribute or set of attributes in one table that refers to a key in another table.",

    "database key":
        "Database keys are attributes or combinations of attributes used to uniquely identify records and establish relationships between tables.",

    "normalization":
        "Normalization is the process of organizing data in a database to reduce redundancy and avoid undesirable data anomalies.",

    "1nf":
        "First Normal Form (1NF) requires that each attribute contains atomic values and that repeating groups are removed.",

    "2nf":
        "Second Normal Form (2NF) requires a relation to be in 1NF and to have no partial dependency on a candidate key.",

    "3nf":
        "Third Normal Form (3NF) requires a relation to be in 2NF and to have no transitive dependency of non-key attributes on a candidate key.",

    "data independence":
        "Data independence is the ability to change the database schema at one level without requiring changes at the next higher level.",

    "schema":
        "A database schema is the logical structure or design of a database, including its tables, attributes, and relationships.",

    "data model":
        "A data model is a collection of concepts used to describe the structure, relationships, constraints, and operations of data in a database.",

    "entity":
        "An entity is a distinguishable real-world object or concept about which information is stored in a database.",

    "attribute":
        "An attribute is a property or characteristic that describes an entity.",

    "relationship":
        "A relationship represents an association between two or more entities in a database.",

    "sql":
        "SQL (Structured Query Language) is a language used to define, manipulate, query, and control data in relational database systems.",
}


# ============================================================
# CONCEPT-AWARE FALLBACK
# ============================================================

def create_fallback_answer(question, documents, bloom_level):

    concept = extract_concept(question)

    source_info = get_source_info(documents)

    if source_info:

        source_text = "\n".join(
            f"- {format_book_name(source['source'])}"
            f" — Page {source['page']}"
            for source in source_info
        )

    else:

        source_text = "- DBMS textbook knowledge base"


    # --------------------------------------------------------
    # Direct concept match
    # --------------------------------------------------------

    if concept in CONCEPT_DEFINITIONS:

        answer = CONCEPT_DEFINITIONS[concept]

        return f"""
BloomDB identified this question at the {bloom_level} level of Bloom's Taxonomy.

TEXTBOOK-BASED ANSWER

{answer}

SOURCE / BOOK

{source_text}

NOTE

AI generation is temporarily unavailable because the Gemini API quota has been reached.
"""


    # --------------------------------------------------------
    # Search retrieved textbook content
    # --------------------------------------------------------

    full_text = " ".join(
        clean_text(document.page_content)
        for document in documents
    )

    sentences = re.split(
        r"(?<=[.!?])\s+",
        full_text
    )

    question_words = set(
        re.findall(
            r"\b[a-zA-Z]{3,}\b",
            question.lower()
        )
    )

    scored_sentences = []

    for sentence in sentences:

        sentence = sentence.strip()

        if len(sentence) < 40:
            continue

        words = set(
            re.findall(
                r"\b[a-zA-Z]{3,}\b",
                sentence.lower()
            )
        )

        score = len(
            question_words.intersection(words)
        )

        scored_sentences.append(
            (score, sentence)
        )


    scored_sentences.sort(
        key=lambda x: x[0],
        reverse=True
    )


    selected = []

    for score, sentence in scored_sentences:

        if sentence not in selected:
            selected.append(sentence)

        if len(selected) >= 3:
            break


    if selected:

        answer = " ".join(selected)

    else:

        answer = clean_text(
            documents[0].page_content
        )[:600]


    return f"""
BloomDB identified this question at the {bloom_level} level of Bloom's Taxonomy.

TEXTBOOK-BASED ANSWER

{answer}

SOURCE / BOOK

{source_text}

NOTE

AI generation is temporarily unavailable because the Gemini API quota has been reached.
"""


# ============================================================
# MAIN BLOOMDB PIPELINE
# ============================================================

def process_question(question, selected_bloom_level=None):

    # --------------------------------------------------------
    # 1. Bloom detection / user-selected Bloom level
    # --------------------------------------------------------

    if selected_bloom_level:
        bloom_level = selected_bloom_level
    else:
        bloom_level = detect_bloom_level(question)


    # --------------------------------------------------------
    # 2. Retrieve textbook content
    # --------------------------------------------------------

    results = vectorstore.similarity_search(
        question,
        k=3
    )


    # --------------------------------------------------------
    # 3. Extract source information
    # --------------------------------------------------------

    source_info = get_source_info(results)


    # --------------------------------------------------------
    # 4. Combine retrieved context
    # --------------------------------------------------------

    context = "\n\n".join(
        document.page_content
        for document in results
    )


    # --------------------------------------------------------
    # 5. Bloom-specific instructions
    # --------------------------------------------------------

    bloom_instructions = {

        "Remember":
            "Focus on definitions, facts, terminology, and direct recall.",

        "Understand":
            "Explain the concept clearly in simple language and include a suitable example where useful.",

        "Apply":
            "Show how the concept can be used to solve a practical DBMS problem. Include steps where appropriate.",

        "Analyze":
            "Break the concept into parts, identify relationships, causes, differences, or problems, and explain your reasoning.",

        "Evaluate":
            "Critically assess the concept, design, or solution using relevant DBMS principles and justify the reasoning.",

        "Create":
            "Develop or design a solution using the DBMS concepts from the textbook. Clearly explain the design decisions."
    }

    level_instruction = bloom_instructions.get(
        bloom_level,
        bloom_instructions["Understand"]
    )


    # --------------------------------------------------------
    # 6. Gemini prompt
    # --------------------------------------------------------

    prompt = f"""
You are BloomDB, an intelligent DBMS learning assistant.

Bloom's Taxonomy level:
{bloom_level}

Bloom-level instruction:
{level_instruction}

Student question:
{question}

Use ONLY the textbook context below.

TEXTBOOK CONTEXT:
{context}

Instructions:

- Answer according to the selected Bloom's Taxonomy level.
- Follow the Bloom-level instruction carefully.
- Give a clear and educational answer.
- Use simple language.
- Do not copy large portions of the textbook.
- Do not invent information.
- Stay grounded in the provided textbook.
- Focus directly on the student's question.
"""


    # --------------------------------------------------------
    # 7. Gemini generation
    # --------------------------------------------------------

    try:

        response = llm.invoke(prompt)

        answer = response.content

        if isinstance(answer, list):

            answer = "\n".join(
                item.get("text", "")
                for item in answer
                if isinstance(item, dict)
                and item.get("type") == "text"
            )

        return bloom_level, answer, source_info


    # --------------------------------------------------------
    # 8. Gemini unavailable → local fallback
    # --------------------------------------------------------

    except Exception as e:

        error_message = str(e)

        if (
            "RESOURCE_EXHAUSTED" in error_message
            or "429" in error_message
        ):

            answer = create_fallback_answer(
                question,
                results,
                bloom_level
            )

            return bloom_level, answer, source_info


        answer = create_fallback_answer(
            question,
            results,
            bloom_level
        )

        return bloom_level, answer, source_info


# ============================================================
# DIRECT TEST
# ============================================================

if __name__ == "__main__":

    question = "What is a database?"

    bloom_level, answer, source_info = process_question(question)

    print("\n===== BLOOM LEVEL =====")
    print(bloom_level)

    print("\n===== ANSWER =====")
    print(answer)

    print("\n===== SOURCES =====")

    for source in source_info:

        print(
            f"{format_book_name(source['source'])}"
            f" — Page {source['page']}"
        )