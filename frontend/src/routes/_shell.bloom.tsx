import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { q } from "@/lib/api";
import { BLOOM_LEVELS } from "@/lib/bloom";
import { Cube, PageHeader, Panel, PixelBar } from "@/components/bloom/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/bloom")({
  head: () => ({ meta: [
    { title: "Bloom's Taxonomy Path — BloomDB" },
    { name: "description", content: "Progress through six cognitive tiers: Remember, Understand, Apply, Analyze, Evaluate and Create." },
    { property: "og:title", content: "Bloom's Taxonomy Path — BloomDB" },
    { property: "og:description", content: "Six tiers of DBMS mastery." },
  ] }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(q.progress()), context.queryClient.ensureQueryData(q.sources())]),
  component: Bloom,
});

function Bloom() {
  const { data: p } = useSuspenseQuery(q.progress());
  const { data: sources } = useSuspenseQuery(q.sources());
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Progression" title="Bloom's Taxonomy" desc="Each tier unlocks once you've built a foundation in the one below — from wood to emerald." />
      <div className="grid gap-4 lg:grid-cols-6 lg:items-end">
        {BLOOM_LEVELS.map((l, idx) => {
          const pct = p.bloom[l.id];
          const unlocked = idx === 0 || p.bloom[BLOOM_LEVELS[idx - 1]!.id] >= 20;
          const count = sources.reduce((a, s) => a + s.distribution[l.id], 0);
          return (
            <Panel key={l.id} variant={l.id === "create" ? "obsidian" : "stone"} className={cn("relative flex min-w-0 gap-4 p-4 lg:flex-col", !unlocked && "opacity-60")}>
              <div className="lg:mb-2">
                <div className="hidden lg:block" style={{ height: (5 - idx) * 0 + idx * 16 }} />
                <Cube level={l.id} size={56} locked={!unlocked} />
              </div>
              <div className="flex-1">
                <p className="font-display text-[10px] uppercase text-muted-foreground">Tier {l.n} · {l.block}</p>
                <h2 className={cn("mt-1 text-lg", l.text)}>{l.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{l.desc}</p>
                <p className="mt-3 text-xs">{count} notes &amp; questions</p>
                <div className="mt-2 flex items-center gap-2"><PixelBar value={pct} segments={10} className="flex-1" /><span className="font-mono text-xs">{pct}%</span></div>
                {!unlocked && <p className="mt-3 inline-flex items-center gap-1 font-display text-[10px] uppercase text-redstone"><Lock className="h-3 w-3" />Locked</p>}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
