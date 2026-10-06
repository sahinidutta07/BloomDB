import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { searchApi } from "@/lib/api";
import { BLOOM_LEVELS, type BloomLevel } from "@/lib/bloom";
import { BloomBadge, BlockButton, EmptyState, Mining, PageHeader, Panel } from "@/components/bloom/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/explore")({
  head: () => ({ meta: [
    { title: "Explore — BloomDB" },
    { name: "description", content: "Semantic search across all your DBMS sources, filtered by Bloom level." },
    { property: "og:title", content: "Explore — BloomDB" },
    { property: "og:description", content: "Semantic search across your DBMS sources." },
  ] }),
  component: Explore,
});

const suggestions = ["normalization", "join", "locking", "B+ tree", "ACID", "ER"];

function Explore() {
  const [input, setInput] = useState("");
  const [term, setTerm] = useState("");
  const [bloom, setBloom] = useState<BloomLevel | undefined>();
  const { data, isFetching } = useQuery({ queryKey: ["search", term, bloom], queryFn: () => searchApi.search(term, bloom), enabled: !!term });

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Semantic search" title="Explore" desc="Search your world for any DBMS concept and see where it lives across tiers." />
      <form onSubmit={(e) => { e.preventDefault(); setTerm(input.trim()); }} className="flex gap-3">
        <label className="slot flex flex-1 items-center gap-3 px-4 py-3">
          <Search className="h-4 w-4 text-diamond" />
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search concepts…" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
        </label>
        <BlockButton tone="diamond" type="submit">Search</BlockButton>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {BLOOM_LEVELS.map((l) => (
          <button key={l.id} onClick={() => setBloom(bloom === l.id ? undefined : l.id)}
            className={cn("border-2 px-2.5 py-1 font-display text-[10px] uppercase", bloom === l.id ? `${l.border} ${l.text} bg-obsidian` : "border-border text-muted-foreground")}>{l.name}</button>
        ))}
      </div>
      <div className="mt-8 space-y-4">
        {!term && (
          <Panel className="p-6">
            <p className="font-display text-xs uppercase text-muted-foreground">Try searching</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => <button key={s} onClick={() => { setInput(s); setTerm(s); }} className="slot px-3 py-1.5 text-sm hover:text-diamond">{s}</button>)}
            </div>
          </Panel>
        )}
        {isFetching && <Mining label="Searching" />}
        {data?.map((c) => (
          <Panel key={c.id} className="p-5">
            <div className="flex items-center justify-between"><span className="font-mono text-xs text-emerald">relevance {(c.score * 100).toFixed(0)}%</span><BloomBadge level={c.bloom} /></div>
            <h3 className="mt-2 font-sans font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm text-foreground/80">{c.text}</p>
          </Panel>
        ))}
        {term && !isFetching && data?.length === 0 && <EmptyState title="No ore found" desc={`Nothing matched "${term}". Try another term or remove the tier filter.`} />}
      </div>
    </div>
  );
}
