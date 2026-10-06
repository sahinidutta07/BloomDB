import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Pickaxe, Gem, Flame, Star, Pyramid, ArrowRight } from "lucide-react";
import { q } from "@/lib/api";
import { BLOOM_LEVELS, bloomOf } from "@/lib/bloom";
import { BloomBadge, Cube, PageHeader, Panel, PixelBar, Stat, blockLinkClass } from "@/components/bloom/ui";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — BloomDB" },
    { name: "description", content: "Your DBMS learning base: knowledge mined, Bloom level, XP and streaks." },
    { property: "og:title", content: "Dashboard — BloomDB" },
    { property: "og:description", content: "Your DBMS learning base at a glance." },
  ] }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(q.progress()), context.queryClient.ensureQueryData(q.sources())]),
  component: Dashboard,
});

function Dashboard() {
  const { data: p } = useSuspenseQuery(q.progress());
  const { data: sources } = useSuspenseQuery(q.sources());
  const cur = bloomOf(p.currentBloom);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Welcome back, miner" title="Base Camp" desc="Pick up where you left off — your knowledge world keeps growing."
        action={<Link to="/ask" className={blockLinkClass("diamond")}>Ask BloomDB</Link>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="Knowledge mined" value={p.knowledgeMined} sub="chunks" icon={<Pickaxe className="h-5 w-5" />} tone="text-diamond" />
        <Stat label="Concepts" value={p.conceptsDiscovered} sub="discovered" icon={<Gem className="h-5 w-5" />} tone="text-emerald" />
        <Stat label="Bloom level" value={`L${cur.n}`} sub={cur.name} icon={<Pyramid className="h-5 w-5" />} tone={cur.text} />
        <Stat label="XP" value={p.xp.toLocaleString()} sub={`Level ${p.level}`} icon={<Star className="h-5 w-5" />} tone="text-xp" />
        <Stat label="Streak" value={`${p.streak}d`} sub="keep it lit" icon={<Flame className="h-5 w-5" />} tone="text-gold" />
      </div>

      <Panel className="mt-6 p-5">
        <div className="flex items-center justify-between font-display text-xs uppercase">
          <span className="text-xp">Level {p.level}</span><span className="text-muted-foreground">{p.xp} / {p.nextLevelXp} XP</span>
        </div>
        <PixelBar value={(p.xp / p.nextLevelXp) * 100} className="mt-3" segments={30} />
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg">Bloom progression</h2><Link to="/bloom" className="font-display text-[10px] uppercase text-diamond">View path →</Link></div>
          <div className="space-y-3">
            {BLOOM_LEVELS.map((l) => (
              <div key={l.id} className="flex items-center gap-3">
                <Cube level={l.id} size={28} locked={p.bloom[l.id] === 0} />
                <span className="w-24 font-display text-[10px] uppercase">{l.name}</span>
                <PixelBar value={p.bloom[l.id]} tone={l.id === "evaluate" ? "diamond" : l.id === "analyze" ? "gold" : "emerald"} className="flex-1" />
                <span className="w-10 text-right font-mono text-xs text-muted-foreground">{p.bloom[l.id]}%</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel variant="obsidian" className="p-5">
          <h2 className="text-lg">Recent activity</h2>
          <ul className="mt-4 space-y-3">
            {p.activity.map((a) => (
              <li key={a.id} className="flex gap-3 text-sm"><span className="mt-1.5 h-2 w-2 shrink-0 bg-emerald" /><div><p>{a.text}</p><p className="text-xs text-muted-foreground">{a.when}</p></div></li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg">Recent sources</h2><Link to="/sources" className="font-display text-[10px] uppercase text-diamond">All sources →</Link></div>
        <div className="grid gap-4 md:grid-cols-3">
          {sources.slice(0, 3).map((s) => (
            <Link key={s.id} to="/sources/$id" params={{ id: s.id }} className="group">
              <Panel className="h-full p-4 transition-transform group-hover:-translate-y-1">
                <p className="font-display text-[10px] uppercase text-wood">{s.type}</p>
                <h3 className="mt-1 font-sans text-sm font-semibold">{s.title}</h3>
                <p className="mt-3 text-xs text-muted-foreground">{s.chunks} chunks · {s.concepts} concepts</p>
                <div className="mt-3 flex items-center justify-between"><BloomBadge level="understand" /><ArrowRight className="h-4 w-4 text-muted-foreground" /></div>
              </Panel>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
