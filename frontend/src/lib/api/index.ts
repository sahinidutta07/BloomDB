// API service layer. Each function calls the FastAPI backend when configured,
// otherwise resolves isolated mock data so the UI stays fully functional.
import { queryOptions } from "@tanstack/react-query";
import { USE_MOCKS, http } from "./config";
import {
  mockSources,
  mockChunks,
  mockDecks,
  mockProgress,
  mockAsk,
} from "./mock";
import type {
  Source,
  Chunk,
  Deck,
  Progress,
  AskResult,
} from "./types";
import type { BloomLevel } from "@/lib/bloom";

const delay = <T,>(v: T, ms = 250) =>
  new Promise<T>((r) => setTimeout(() => r(v), ms));

export const sourcesApi = {
  list: () =>
    USE_MOCKS
      ? delay(mockSources)
      : http<Source[]>("/sources"),

  get: async (id: string) => {
    if (!USE_MOCKS) {
      return http<Source>(`/sources/${id}`);
    }

    const s = mockSources.find((x) => x.id === id);

    if (!s) {
      throw new Error("Source not found");
    }

    return delay(s);
  },

  upload: async (file: File) => {
    if (USE_MOCKS) {
      return delay({ ok: true, name: file.name }, 1200);
    }

    const fd = new FormData();
    fd.append("file", file);

    return http<{ ok: boolean; name: string }>("/sources/upload", {
      method: "POST",
      body: fd,
      headers: {},
    });
  },
};

export const documentsApi = {
  chunks: (sourceId?: string) =>
    USE_MOCKS
      ? delay(
          sourceId
            ? mockChunks.filter((c) => c.sourceId === sourceId)
            : mockChunks
        )
      : http<Chunk[]>(
          `/documents/chunks${
            sourceId ? `?source_id=${sourceId}` : ""
          }`
        ),
};

export const searchApi = {
  search: (q: string, bloom?: BloomLevel) =>
    USE_MOCKS
      ? delay(
          mockChunks.filter(
            (c) =>
              (!bloom || c.bloom === bloom) &&
              (c.title + c.text + c.topic)
                .toLowerCase()
                .includes(q.toLowerCase())
          )
        )
      : http<Chunk[]>(
          `/search?q=${encodeURIComponent(q)}${
            bloom ? `&bloom=${bloom}` : ""
          }`
        ),
};

export const questionsApi = {
  ask: async (question: string): Promise<AskResult> => {
    if (USE_MOCKS) {
      return delay(mockAsk(question), 1100);
    }

    const data = await http<{
      question: string;
      bloom_level: BloomLevel;
      answer: string;
      source: {
        book: string;
        source: string;
        page: number;
      }[];
    }>("/ask", {
      method: "POST",
      body: JSON.stringify({ question }),
    });

    return {
      question: data.question,
      bloom: data.bloom_level,
      confidence: 1,
      answer: data.answer,

      retrieved: data.source.map((item, index) => ({
        id: `${item.book}-${item.page}-${index}`,
        sourceId: item.book,
        topic: "DBMS",
        title: item.source,
        text: `Source: ${item.source}`,
        bloom: data.bloom_level,
        score: 1,
        page: item.page,
      })),

      related: [],
    };
  },
};

export const bloomApi = {
  classify: (text: string) =>
    USE_MOCKS
      ? delay({
          bloom: mockAsk(text).bloom,
          confidence: 0.87,
        })
      : http<{ bloom: BloomLevel; confidence: number }>(
          "/bloom/classify",
          {
            method: "POST",
            body: JSON.stringify({ text }),
          }
        ),
};

export const flashcardsApi = {
  decks: () =>
    USE_MOCKS
      ? delay(mockDecks)
      : http<Deck[]>("/flashcards/decks"),

  deck: async (id: string) => {
    if (!USE_MOCKS) {
      return http<Deck>(`/flashcards/decks/${id}`);
    }

    const d = mockDecks.find((x) => x.id === id);

    if (!d) {
      throw new Error("Deck not found");
    }

    return delay(d);
  },
};

export const progressApi = {
  get: () =>
    USE_MOCKS
      ? delay(mockProgress)
      : http<Progress>("/progress"),
};

export const q = {
  sources: () =>
    queryOptions({
      queryKey: ["sources"],
      queryFn: sourcesApi.list,
    }),

  source: (id: string) =>
    queryOptions({
      queryKey: ["source", id],
      queryFn: () => sourcesApi.get(id),
    }),

  chunks: (sourceId?: string) =>
    queryOptions({
      queryKey: ["chunks", sourceId ?? "all"],
      queryFn: () => documentsApi.chunks(sourceId),
    }),

  decks: () =>
    queryOptions({
      queryKey: ["decks"],
      queryFn: flashcardsApi.decks,
    }),

  deck: (id: string) =>
    queryOptions({
      queryKey: ["deck", id],
      queryFn: () => flashcardsApi.deck(id),
    }),

  progress: () =>
    queryOptions({
      queryKey: ["progress"],
      queryFn: progressApi.get,
    }),
};

export type * from "./types";