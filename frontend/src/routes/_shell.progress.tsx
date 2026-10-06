import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Award, Flame, Lock, Star } from "lucide-react";
import { q } from "@/lib/api";
import { BLOOM_LEVELS, bloomOf } from "@/lib/bloom";
import { Cube, PageHeader, Panel, PixelBar, Stat } from "@/components/bloom/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/progress")({
  head: () => ({ meta: [
    { title: "Learning Progress — BloomDB" },
    { name: "description", content: "XP, streaks, Bloom progress, topics mastered and achievements." },
    { property: "og:title", content: "Learning Progress — BloomDB" },
    { property: "og:description", content: "Track your DBMS mastery." },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.progress()),
  component: ProgressPage,
});

const days = ["M", "T", "W", "T", "F", "S", "S"];

function ProgressPage() {
  const { data: p } = useSuspenseQuery(q.progress());
  const max = Math.max(...p.weekly);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Stats" title="Learning Progress" />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Knowledge level" value={p.level} sub={`${p.nextLevelXp - p.xp} XP to next`} icon={<Star className="h-5 w-5" />} tone="text-xp" />
        <Stat label="Current streak" value={`${p.streak} days`} sub="best: 14 days" icon={<Flame className="h-5 w-5" />} tone="text-gold" />
        <Stat label="Current tier" value={bloomOf(p.currentBloom).name} sub="Bloom level" icon={<Cube level={p.currentBloom} size={22} />} tone={bloomOf(p.currentBloom).text} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel className="p-5">
          <h2 className="text-lg">XP this week</h2>
          <div className="mt-6 flex h-40 items-end gap-3">
            {p.weekly.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full border-2 border-obsidian bg-xp" style={{ height: `${(v / max) * 130}px`, boxShadow: "inset 3px 3px 0 0 oklch(1 0 0 / 0.3)" }} />
                <span className="font-display text-[10px] text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <h2 className="text-lg">Bloom progress</h2>
          <div className="mt-4 space-y-3">
            {BLOOM_LEVELS.map((l) => (
              <div key={l.id} className="flex items-center gap-3"><Cube level={l.id} size={20} /><span className="w-24 font-display text-[10px] uppercase">{l.name}</span><PixelBar value={p.bloom[l.id]} segments={16} className="flex-1" /></div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <h2 className="text-lg">Topics mastered</h2>
          <div className="mt-4 space-y-3">
            {p.topics.map((t) => (
              <div key={t.name}><div className="flex justify-between text-sm"><span>{t.name}</span><span className="font-mono text-xs text-muted-foreground">{t.mastery}%</span></div>
                <PixelBar value={t.mastery} tone={t.mastery > 75 ? "emerald" : t.mastery > 40 ? "gold" : "redstone"} className="mt-1" /></div>
            ))}
          </div>
        </Panel>
        <Panel variant="obsidian" className="p-5">
          <h2 className="text-lg">Recent activity</h2>
          <ul className="mt-4 space-y-3">{p.activity.map((a) => <li key={a.id} className="flex gap-3 text-sm"><span className="mt-1.5 h-2 w-2 shrink-0 bg-diamond" /><div><p>{a.text}</p><p className="text-xs text-muted-foreground">{a.when}</p></div></li>)}</ul>
        </Panel>
      </div>
      <h2 className="mt-10 text-lg">Achievements</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {p.achievements.map((a) => (
          <div key={a.id} className={cn("slot flex flex-col items-center gap-2 p-4 text-center", !a.unlocked && "opacity-50")}>
            {a.unlocked ? <Award className="h-7 w-7 text-gold" /> : <Lock className="h-7 w-7 text-muted-foreground" />}
            <p className="font-display text-[10px] uppercase">{a.name}</p>
            <p className="text-[11px] text-muted-foreground">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
