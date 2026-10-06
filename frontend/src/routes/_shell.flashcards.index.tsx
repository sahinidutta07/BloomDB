import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Layers } from "lucide-react";
import { q } from "@/lib/api";
import { BloomBadge, PageHeader, Panel, PixelBar } from "@/components/bloom/ui";

export const Route = createFileRoute("/_shell/flashcards/")({
  head: () => ({ meta: [
    { title: "Flashcard Decks — BloomDB" },
    { name: "description", content: "Revise DBMS concepts with Bloom-tagged flashcard decks." },
    { property: "og:title", content: "Flashcard Decks — BloomDB" },
    { property: "og:description", content: "Bloom-tagged DBMS flashcards." },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.decks()),
  component: Decks,
});

function Decks() {
  const { data } = useSuspenseQuery(q.decks());
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Chest" title="Flashcard Decks" desc="Generated from your sources and tagged by tier. Open a deck to start a revision run." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((d) => (
          <Link key={d.id} to="/flashcards/$id" params={{ id: d.id }} className="group">
            <div className="relative">
              <div className="panel absolute inset-0 translate-x-2 translate-y-2 opacity-60" />
              <Panel className="relative p-5 transition-transform group-hover:-translate-y-1">
                <div className="slot mb-4 flex h-12 w-12 items-center justify-center text-gold"><Layers className="h-5 w-5" /></div>
                <p className="text-xs text-muted-foreground">{d.topic}</p>
                <h3 className="mt-1 text-base">{d.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{d.cards.length} cards</p>
                <div className="mt-3 flex flex-wrap gap-1">{[...new Set(d.cards.map((c) => c.bloom))].slice(0, 2).map((b) => <BloomBadge key={b} level={b} />)}</div>
                <p className="mt-4 font-display text-[10px] uppercase text-muted-foreground">Mastery {d.mastery}%</p>
                <PixelBar value={d.mastery} segments={12} className="mt-1" />
              </Panel>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
