import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { q } from "@/lib/api";
import { BLOOM_LEVELS, type BloomLevel } from "@/lib/bloom";
import { BloomBadge, EmptyState, PageHeader, Panel } from "@/components/bloom/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/knowledge")({
  head: () => ({ meta: [
    { title: "Knowledge Base — BloomDB" },
    { name: "description", content: "Browse every mined DBMS knowledge chunk, filtered by topic and Bloom level." },
    { property: "og:title", content: "Knowledge Base — BloomDB" },
    { property: "og:description", content: "Every DBMS knowledge chunk, organized by Bloom level." },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.chunks()),
  component: Knowledge,
});

function Knowledge() {
  const { data: chunks } = useSuspenseQuery(q.chunks());
  const [text, setText] = useState("");
  const [bloom, setBloom] = useState<BloomLevel | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const topics = [...new Set(chunks.map((c) => c.topic))];
  const list = useMemo(() => chunks.filter((c) =>
    (!bloom || c.bloom === bloom) && (!topic || c.topic === topic) && (c.title + c.text).toLowerCase().includes(text.toLowerCase())), [chunks, bloom, topic, text]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Inventory" title="Knowledge Base" desc="Every chunk mined from your sources, tagged with its cognitive tier." />
      <Panel className="p-4">
        <label className="slot flex items-center gap-3 px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search concepts, e.g. BCNF, joins, 2PL…" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {BLOOM_LEVELS.map((l) => (
            <button key={l.id} onClick={() => setBloom(bloom === l.id ? null : l.id)}
              className={cn("border-2 px-2.5 py-1 font-display text-[10px] uppercase", bloom === l.id ? `${l.border} ${l.text} bg-obsidian` : "border-border text-muted-foreground")}>{l.name}</button>
          ))}
          <span className="mx-2 w-px bg-border" />
          {topics.map((t) => (
            <button key={t} onClick={() => setTopic(topic === t ? null : t)}
              className={cn("border-2 px-2.5 py-1 text-xs", topic === t ? "border-diamond text-diamond" : "border-border text-muted-foreground")}>{t}</button>
          ))}
        </div>
      </Panel>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {list.map((c) => (
          <Panel key={c.id} className="p-5">
            <div className="flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{c.topic} · p.{c.page}</span><BloomBadge level={c.bloom} /></div>
            <h3 className="mt-2 font-sans text-base font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{c.text}</p>
            <Link to="/sources/$id" params={{ id: c.sourceId }} className="mt-3 inline-block font-display text-[10px] uppercase text-diamond">Open source →</Link>
          </Panel>
        ))}
      </div>
      {list.length === 0 && <div className="mt-6"><EmptyState title="No blocks here" desc="Nothing matches those filters. Try a broader search or another tier." /></div>}
    </div>
  );
}
