import { Link } from "@tanstack/react-router";
import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { bloomOf, type BloomLevel } from "@/lib/bloom";

type Tone = "emerald" | "diamond" | "stone" | "wood" | "gold" | "redstone";
const tones: Record<Tone, string> = {
  emerald: "bg-emerald text-primary-foreground",
  diamond: "bg-diamond text-accent-foreground",
  stone: "bg-stone text-foreground",
  wood: "bg-wood text-foreground",
  gold: "bg-gold text-obsidian",
  redstone: "bg-redstone text-destructive-foreground",
};

export function BlockButton({ tone = "emerald", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return <button {...p} className={cn("btn-block", tones[tone], className)} />;
}
export function blockLinkClass(tone: Tone = "emerald") { return cn("btn-block", tones[tone]); }

export function Panel({ className, children, variant = "stone" }: { className?: string; children: ReactNode; variant?: "stone" | "obsidian" | "wood" }) {
  const v = variant === "obsidian" ? "panel-obsidian" : variant === "wood" ? "panel-wood" : "panel";
  return <div className={cn(v, "animate-block-in", className)}>{children}</div>;
}

export function PageHeader({ eyebrow, title, desc, action }: { eyebrow?: string; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="font-display text-xs uppercase text-diamond">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl text-shadow-pixel md:text-4xl">{title}</h1>
        {desc && <p className="mt-2 max-w-2xl text-muted-foreground">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

/** Voxel cube made from 3 faces — used as a Bloom tier "block". */
export function Cube({ level, size = 40, locked }: { level: BloomLevel; size?: number; locked?: boolean }) {
  const l = bloomOf(level);
  return (
    <div className={cn("relative shrink-0", locked && "grayscale opacity-40")} style={{ width: size, height: size }}>
      <div className={cn("absolute inset-0 border-2 border-obsidian", l.color)} style={{ boxShadow: "inset 4px 4px 0 0 oklch(1 0 0 / 0.35), inset -4px -4px 0 0 oklch(0 0 0 / 0.35)" }} />
      <div className="absolute left-1/4 top-1/4 h-1/4 w-1/4 bg-foreground/20" />
      <div className="absolute bottom-1/4 right-1/4 h-1/6 w-1/6 bg-obsidian/30" />
    </div>
  );
}

export function BloomBadge({ level, className }: { level: BloomLevel; className?: string }) {
  const l = bloomOf(level);
  return (
    <span className={cn("inline-flex items-center gap-1.5 border-2 bg-obsidian/60 px-2 py-0.5 font-display text-[10px] uppercase", l.border, l.text, className)}>
      <span className={cn("h-2 w-2", l.color)} />L{l.n} {l.name}
    </span>
  );
}

export function PixelBar({ value, tone = "xp", className, segments = 20 }: { value: number; tone?: "xp" | "diamond" | "gold" | "emerald" | "redstone"; className?: string; segments?: number }) {
  const filled = Math.round((Math.min(100, Math.max(0, value)) / 100) * segments);
  const bg = { xp: "bg-xp", diamond: "bg-diamond", gold: "bg-gold", emerald: "bg-emerald", redstone: "bg-redstone" }[tone];
  return (
    <div className={cn("pixel-bar flex h-4 gap-[2px] p-[2px]", className)}>
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} className={cn("h-full flex-1", i < filled ? bg : "bg-stone-dark")} style={i < filled ? { boxShadow: "inset 0 2px 0 0 oklch(1 0 0 / 0.3)" } : undefined} />
      ))}
    </div>
  );
}

export function Stat({ label, value, sub, icon, tone = "text-foreground" }: { label: string; value: ReactNode; sub?: string; icon: ReactNode; tone?: string }) {
  return (
    <Panel className="p-4">
      <div className="flex items-start gap-3">
        <div className={cn("slot flex h-11 w-11 items-center justify-center", tone)}>{icon}</div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className={cn("font-display text-2xl text-shadow-pixel", tone)}>{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </div>
    </Panel>
  );
}

export function EmptyState({ title, desc, action }: { title: string; desc: string; action?: ReactNode }) {
  return (
    <Panel className="flex flex-col items-center gap-4 p-10 text-center">
      <div className="grid grid-cols-3 gap-1 opacity-60">
        {Array.from({ length: 9 }).map((_, i) => <div key={i} className={cn("h-4 w-4", i % 2 ? "bg-stone" : "bg-stone-dark")} />)}
      </div>
      <h3 className="text-lg">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{desc}</p>
      {action}
    </Panel>
  );
}

export function Mining({ label = "Mining knowledge" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 font-display text-xs uppercase text-diamond">
      <div className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-3 w-3 bg-diamond animate-mine" style={{ animationDelay: `${i * 0.2}s` }} />)}</div>
      {label}…
    </div>
  );
}

export function PageLoading() {
  return <div className="flex min-h-[50vh] items-center justify-center"><Mining label="Loading chunks" /></div>;
}

export function PageError({ error }: { error: Error }) {
  return (
    <div className="p-8">
      <Panel variant="obsidian" className="mx-auto max-w-lg p-8 text-center">
        <h2 className="text-xl text-redstone">Block not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Link to="/dashboard" className={cn(blockLinkClass("stone"), "mt-6")}>Back to base</Link>
      </Panel>
    </div>
  );
}
