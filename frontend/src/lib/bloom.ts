export type BloomLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";

export const BLOOM_LEVELS: {
  id: BloomLevel; n: number; name: string; block: string; desc: string; verbs: string;
  color: string; text: string; border: string;
}[] = [
  { id: "remember", n: 1, name: "Remember", block: "Oak", desc: "Recall facts, terms and basic DBMS definitions.", verbs: "define · list · recall", color: "bg-wood", text: "text-wood", border: "border-wood" },
  { id: "understand", n: 2, name: "Understand", block: "Stone", desc: "Explain ideas like normalization or ACID in your own words.", verbs: "explain · summarize · classify", color: "bg-stone", text: "text-iron", border: "border-stone" },
  { id: "apply", n: 3, name: "Apply", block: "Iron", desc: "Use concepts: write SQL, draw ER diagrams, normalize tables.", verbs: "write · solve · implement", color: "bg-iron", text: "text-iron", border: "border-iron" },
  { id: "analyze", n: 4, name: "Analyze", block: "Gold", desc: "Break down schemas, query plans and dependencies.", verbs: "compare · decompose · trace", color: "bg-gold", text: "text-gold", border: "border-gold" },
  { id: "evaluate", n: 5, name: "Evaluate", block: "Diamond", desc: "Judge designs, indexing strategies and trade-offs.", verbs: "justify · critique · assess", color: "bg-diamond", text: "text-diamond", border: "border-diamond" },
  { id: "create", n: 6, name: "Create", block: "Emerald", desc: "Design new databases, systems and optimizations.", verbs: "design · construct · propose", color: "bg-emerald", text: "text-emerald", border: "border-emerald" },
];

export const bloomOf = (id: BloomLevel) => BLOOM_LEVELS.find((l) => l.id === id)!;
