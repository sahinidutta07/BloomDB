import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { q } from "@/lib/api";
import { BLOOM_LEVELS } from "@/lib/bloom";
import { BloomBadge, Cube, EmptyState, PageHeader, Panel, blockLinkClass } from "@/components/bloom/ui";

export const Route = createFileRoute("/_shell/sources/$id")({
  loader: async ({ context, params }) => {
    const [source] = await Promise.all([context.queryClient.ensureQueryData(q.source(params.id)), context.queryClient.ensureQueryData(q.chunks(params.id))]);
    return { title: source.title };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.title} — BloomDB` : "Source — BloomDB" },
    { name: "description", content: "Source content, Bloom distribution and retrieved knowledge chunks." },
    { property: "og:title", content: loaderData ? `${loaderData.title} — BloomDB` : "Source — BloomDB" },
    { property: "og:description", content: "Bloom-classified chunks from a DBMS learning source." },
  ] }),
  component: SourceView,
});

function SourceView() {
  const { id } = Route.useParams();
  const { data: s } = useSuspenseQuery(q.source(id));
  const { data: chunks } = useSuspenseQuery(q.chunks(id));
  const max = Math.max(...Object.values(s.distribution));
  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/sources" className="mb-4 inline-flex items-center gap-2 font-display text-[10px] uppercase text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3 w-3" />Sources</Link>
      <PageHeader eyebrow={s.type} title={s.title} desc={`${s.author} · ${s.pages} pages · added ${s.addedAt}`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg">Retrieved knowledge</h2>
          {chunks.length === 0 ? <EmptyState title="Still mining" desc="This source is being processed. Chunks will appear here shortly." /> :
            chunks.map((c) => (
              <Panel key={c.id} className="p-5">
                <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{c.topic} · page {c.page}</span><BloomBadge level={c.bloom} /></div>
                <h3 className="mt-2 font-sans font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{c.text}</p>
              </Panel>
            ))}
        </div>
        <div className="space-y-6">
          <Panel variant="obsidian" className="p-5">
            <h2 className="text-lg">Bloom distribution</h2>
            <div className="mt-5 flex h-44 items-end gap-2">
              {BLOOM_LEVELS.map((l) => (
                <div key={l.id} className="flex flex-1 flex-col items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{s.distribution[l.id]}</span>
                  <div className={`w-full border-2 border-obsidian ${l.color}`} style={{ height: `${(s.distribution[l.id] / max) * 120}px`, boxShadow: "inset 3px 3px 0 0 oklch(1 0 0 / 0.3)" }} />
                  <span className="font-display text-[8px] uppercase">{l.name.slice(0, 4)}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="p-5">
            <h2 className="text-lg">Source stats</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[["Chunks", s.chunks], ["Concepts", s.concepts], ["Pages", s.pages], ["Status", s.status]].map(([k, v]) => (
                <div key={k} className="slot p-3"><dt className="text-[10px] uppercase text-muted-foreground">{k}</dt><dd className="font-display text-lg">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-4 flex items-center gap-2"><Cube level="apply" size={24} /><Cube level="analyze" size={24} /><Cube level="evaluate" size={24} /></div>
            <Link to="/ask" className={`${blockLinkClass("diamond")} mt-5 w-full`}>Ask about this source</Link>
          </Panel>
        </div>
      </div>
    </div>
  );
}
