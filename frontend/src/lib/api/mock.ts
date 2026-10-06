// Isolated mock data. Replace by real FastAPI responses via src/lib/api/index.ts.
import type { BloomLevel } from "@/lib/bloom";
import type { Source, Chunk, Deck, Flashcard, Progress, AskResult } from "./types";

export const mockSources: Source[] = [
  { id: "korth-ch1", title: "Database System Concepts — Ch. 1: Introduction", type: "textbook", author: "Silberschatz, Korth, Sudarshan", pages: 42, chunks: 128, concepts: 34, status: "ready", addedAt: "2026-09-28", distribution: { remember: 32, understand: 38, apply: 22, analyze: 18, evaluate: 10, create: 8 } },
  { id: "korth-ch7", title: "Ch. 7: Relational Database Design (Normalization)", type: "chapter", author: "Silberschatz et al.", pages: 58, chunks: 174, concepts: 46, status: "ready", addedAt: "2026-09-30", distribution: { remember: 28, understand: 40, apply: 44, analyze: 32, evaluate: 18, create: 12 } },
  { id: "sql-notes", title: "SQL Joins & Subqueries — Lecture Notes", type: "notes", author: "Prof. Mehta", pages: 18, chunks: 61, concepts: 19, status: "ready", addedAt: "2026-10-01", distribution: { remember: 10, understand: 14, apply: 22, analyze: 9, evaluate: 4, create: 2 } },
  { id: "txn-pdf", title: "Transactions, Concurrency & Recovery", type: "pdf", author: "Navathe", pages: 64, chunks: 190, concepts: 51, status: "processing", addedAt: "2026-10-05", distribution: { remember: 30, understand: 42, apply: 30, analyze: 40, evaluate: 28, create: 20 } },
  { id: "index-notes", title: "Indexing: B+ Trees and Hashing", type: "notes", author: "Self", pages: 12, chunks: 40, concepts: 14, status: "ready", addedAt: "2026-10-03", distribution: { remember: 8, understand: 10, apply: 8, analyze: 7, evaluate: 5, create: 2 } },
];

export const mockChunks: Chunk[] = [
  { id: "c1", sourceId: "korth-ch7", topic: "Normalization", title: "Third Normal Form (3NF)", text: "A relation is in 3NF if, for every non-trivial functional dependency X → A, either X is a superkey or A is a prime attribute. 3NF removes transitive dependencies while preserving dependencies.", bloom: "understand", score: 0.94, page: 312 },
  { id: "c2", sourceId: "korth-ch7", topic: "Normalization", title: "BCNF vs 3NF", text: "BCNF is stricter: every determinant must be a superkey. A BCNF decomposition is always lossless but may not preserve all functional dependencies, which is why 3NF is sometimes preferred.", bloom: "evaluate", score: 0.91, page: 318 },
  { id: "c3", sourceId: "sql-notes", topic: "SQL", title: "INNER vs LEFT JOIN", text: "INNER JOIN returns rows with matches in both tables. LEFT JOIN returns all rows from the left table, filling NULLs where the right table has no match.", bloom: "apply", score: 0.88, page: 4 },
  { id: "c4", sourceId: "txn-pdf", topic: "Transactions", title: "ACID properties", text: "Atomicity, Consistency, Isolation and Durability together guarantee reliable transaction processing even in the presence of failures and concurrent access.", bloom: "remember", score: 0.86, page: 21 },
  { id: "c5", sourceId: "txn-pdf", topic: "Concurrency", title: "Two-Phase Locking", text: "In 2PL a transaction acquires all locks in a growing phase and releases them in a shrinking phase. Strict 2PL holds exclusive locks until commit, preventing cascading aborts.", bloom: "analyze", score: 0.84, page: 47 },
  { id: "c6", sourceId: "index-notes", topic: "Indexing", title: "B+ Tree leaf structure", text: "All records live in leaf nodes linked sequentially, enabling efficient range queries. Internal nodes only store keys that guide the search.", bloom: "understand", score: 0.82, page: 3 },
  { id: "c7", sourceId: "korth-ch1", topic: "ER Model", title: "Designing an ER schema for a library", text: "Identify entities (Book, Member, Loan), relationships and cardinalities, then map to relations with appropriate primary and foreign keys.", bloom: "create", score: 0.8, page: 15 },
  { id: "c8", sourceId: "index-notes", topic: "Indexing", title: "When to choose hashing over B+ trees", text: "Hash indexes excel at equality lookups but cannot support range queries; B+ trees are the general-purpose choice for mixed workloads.", bloom: "evaluate", score: 0.79, page: 9 },
];

const cards = (deckId: string, items: [string, string, BloomLevel][]): Flashcard[] =>
  items.map(([front, back, bloom], i) => ({ id: `${deckId}-${i}`, deckId, front, back, bloom }));

export const mockDecks: Deck[] = [
  { id: "normalization", title: "Normalization", topic: "Relational Design", mastery: 68, cards: cards("normalization", [
    ["What is a functional dependency?", "X → Y means the value of X uniquely determines the value of Y in every tuple.", "remember"],
    ["Why decompose into 3NF?", "To remove transitive dependencies and reduce update anomalies while keeping dependencies.", "understand"],
    ["Normalize R(A,B,C) with A→B, B→C to 3NF.", "R1(A,B), R2(B,C).", "apply"],
    ["When is BCNF preferable to 3NF?", "When dependency preservation can be sacrificed for zero redundancy from FDs.", "evaluate"],
  ]) },
  { id: "sql", title: "SQL Mastery", topic: "Queries", mastery: 81, cards: cards("sql", [
    ["What does GROUP BY do?", "Collapses rows sharing values into summary rows for aggregate functions.", "remember"],
    ["Difference between WHERE and HAVING?", "WHERE filters rows before grouping; HAVING filters groups after aggregation.", "understand"],
    ["Write: employees earning above dept average.", "SELECT * FROM emp e WHERE salary > (SELECT AVG(salary) FROM emp WHERE dept = e.dept);", "apply"],
  ]) },
  { id: "transactions", title: "Transactions & ACID", topic: "Concurrency", mastery: 42, cards: cards("transactions", [
    ["Expand ACID.", "Atomicity, Consistency, Isolation, Durability.", "remember"],
    ["What is a dirty read?", "Reading uncommitted data written by another transaction.", "understand"],
    ["Is schedule r1(x) w2(x) w1(x) conflict-serializable?", "No — the precedence graph has a cycle T1→T2→T1.", "analyze"],
  ]) },
  { id: "indexing", title: "Indexing & Storage", topic: "Physical Design", mastery: 25, cards: cards("indexing", [
    ["What is a clustered index?", "An index whose order matches the physical order of rows.", "remember"],
    ["Design an index strategy for a read-heavy orders table.", "Composite B+ tree on (customer_id, created_at), covering frequent columns.", "create"],
  ]) },
];

export const mockProgress: Progress = {
  xp: 4280, level: 14, nextLevelXp: 5000, streak: 9, knowledgeMined: 593, conceptsDiscovered: 164,
  currentBloom: "analyze",
  bloom: { remember: 92, understand: 78, apply: 64, analyze: 41, evaluate: 22, create: 9 },
  topics: [
    { name: "ER Model", mastery: 90 }, { name: "SQL", mastery: 81 }, { name: "Normalization", mastery: 68 },
    { name: "Transactions", mastery: 42 }, { name: "Indexing", mastery: 25 }, { name: "Query Optimization", mastery: 12 },
  ],
  weekly: [120, 340, 210, 480, 390, 160, 520],
  activity: [
    { id: "a1", text: "Mined 46 concepts from Ch. 7: Normalization", when: "2h ago", kind: "source" },
    { id: "a2", text: "Reached Analyze tier in Transactions", when: "5h ago", kind: "level" },
    { id: "a3", text: "Reviewed 24 flashcards in SQL Mastery", when: "Yesterday", kind: "cards" },
    { id: "a4", text: "Asked: \"Compare 3NF and BCNF\"", when: "Yesterday", kind: "ask" },
    { id: "a5", text: "Unlocked achievement: Query Smith", when: "2 days ago", kind: "achievement" },
  ],
  achievements: [
    { id: "first", name: "First Block", desc: "Add your first source", unlocked: true },
    { id: "query", name: "Query Smith", desc: "Ask 25 questions", unlocked: true },
    { id: "streak", name: "Torchbearer", desc: "7-day streak", unlocked: true },
    { id: "normal", name: "Normal Form", desc: "Master normalization", unlocked: false },
    { id: "diamond", name: "Diamond Mind", desc: "Reach Evaluate tier", unlocked: false },
    { id: "architect", name: "Architect", desc: "Reach Create tier", unlocked: false },
  ],
};

export function mockAsk(question: string): AskResult {
  const q = question.toLowerCase();
  const bloom: BloomLevel =
    /design|create|propose|build/.test(q) ? "create" :
    /better|justify|evaluate|which should|trade/.test(q) ? "evaluate" :
    /compare|difference|analy|why does/.test(q) ? "analyze" :
    /write|how to|solve|normalize|query/.test(q) ? "apply" :
    /explain|why|describe/.test(q) ? "understand" : "remember";
  const words = q.split(/\W+/).filter((w) => w.length > 2);
  const retrieved = mockChunks
    .map((c) => ({ ...c, score: Math.min(0.99, c.score * 0.6 + words.filter((w) => (c.title + c.text).toLowerCase().includes(w)).length * 0.12) }))
    .sort((a, b) => b.score - a.score).slice(0, 3);
  return {
    question, bloom, confidence: 0.87, retrieved,
    answer: `Based on your sources, here is a ${bloom}-level explanation.\n\n${retrieved.map((r) => `• ${r.title}: ${r.text}`).join("\n\n")}\n\nTo go one tier deeper, try connecting these ideas to a concrete schema from your own notes.`,
    related: ["Functional Dependencies", "Lossless Decomposition", "ACID", "B+ Trees", "Query Plans"],
  };
}
