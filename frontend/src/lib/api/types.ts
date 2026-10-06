import type { BloomLevel } from "@/lib/bloom";

export type BloomDistribution = Record<BloomLevel, number>;
export interface Source {
  id: string; title: string; type: "textbook" | "chapter" | "notes" | "pdf"; author: string;
  pages: number; chunks: number; concepts: number; status: "ready" | "processing" | "failed";
  addedAt: string; distribution: BloomDistribution;
}
export interface Chunk { id: string; sourceId: string; topic: string; title: string; text: string; bloom: BloomLevel; score: number; page: number; }
export interface Flashcard { id: string; deckId: string; front: string; back: string; bloom: BloomLevel; }
export interface Deck { id: string; title: string; topic: string; mastery: number; cards: Flashcard[]; }
export interface Progress {
  xp: number; level: number; nextLevelXp: number; streak: number; knowledgeMined: number; conceptsDiscovered: number;
  currentBloom: BloomLevel; bloom: BloomDistribution; topics: { name: string; mastery: number }[]; weekly: number[];
  activity: { id: string; text: string; when: string; kind: string }[];
  achievements: { id: string; name: string; desc: string; unlocked: boolean }[];
}
export interface AskResult { question: string; bloom: BloomLevel; confidence: number; answer: string; retrieved: Chunk[]; related: string[]; }
