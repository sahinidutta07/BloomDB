import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { q } from "@/lib/api";
import { BloomBadge, BlockButton, PageHeader, Panel, PixelBar } from "@/components/bloom/ui";

export const Route = createFileRoute("/_shell/flashcards/$id")({
  loader: async ({ context, params }) => ({ title: (await context.queryClient.ensureQueryData(q.deck(params.id))).title }),
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.title ?? "Deck"} flashcards — BloomDB` },
    { name: "description", content: "Flip, recall and rate DBMS flashcards." },
    { property: "og:title", content: `${loaderData?.title ?? "Deck"} flashcards — BloomDB` },
    { property: "og:description", content: "DBMS flashcard revision run." },
  ] }),
  component: Study,
});

function Study() {
  const { id } = Route.useParams();
  const { data: deck } = useSuspenseQuery(q.deck(id));
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const done = i >= deck.cards.length;
  const card = deck.cards[i]!;
  const next = (k: boolean) => { if (k) setKnown(known + 1); setFlipped(false); setI(i + 1); };

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/flashcards" className="mb-4 inline-flex items-center gap-2 font-display text-[10px] uppercase text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3 w-3" />Decks</Link>
      <PageHeader eyebrow={deck.topic} title={deck.title} />
      <div className="mb-6 flex items-center gap-4">
        <PixelBar value={(Math.min(i, deck.cards.length) / deck.cards.length) * 100} className="flex-1" />
        <span className="font-mono text-xs text-muted-foreground">{Math.min(i + 1, deck.cards.length)}/{deck.cards.length}</span>
      </div>
      {done ? (
        <Panel variant="wood" className="p-10 text-center">
          <h2 className="text-2xl text-shadow-pixel">Run complete</h2>
          <p className="mt-2">You knew {known} of {deck.cards.length} cards · +{known * 15} XP</p>
          <BlockButton tone="gold" className="mt-6" onClick={() => { setI(0); setKnown(0); }}><RotateCcw className="h-4 w-4" />Again</BlockButton>
        </Panel>
      ) : (
        <>
          <button onClick={() => setFlipped(!flipped)} className="w-full text-left" aria-label="Flip card">
            <Panel key={`${i}-${flipped}`} variant={flipped ? "obsidian" : "stone"} className="flex min-h-72 flex-col p-8">
              <div className="flex items-center justify-between"><span className="font-display text-[10px] uppercase text-muted-foreground">{flipped ? "Answer" : "Question"}</span><BloomBadge level={card.bloom} /></div>
              <p className={flipped ? "my-auto py-8 text-lg leading-relaxed" : "my-auto py-8 font-display text-xl leading-relaxed"}>{flipped ? card.back : card.front}</p>
              <p className="text-center text-xs text-muted-foreground">Click to flip</p>
            </Panel>
          </button>
          <div className="mt-6 flex justify-center gap-3">
            <BlockButton tone="redstone" onClick={() => next(false)}>Still learning</BlockButton>
            <BlockButton tone="emerald" onClick={() => next(true)}>Got it</BlockButton>
          </div>
        </>
      )}
    </div>
  );
}
