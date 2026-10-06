import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutGrid, Library, FileStack, Compass, Layers, Pyramid, TrendingUp, Settings, Sparkles, Menu, X, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/knowledge", label: "Knowledge", icon: Library },
  { to: "/sources", label: "Sources", icon: FileStack },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/ask", label: "Ask AI", icon: Sparkles },
  { to: "/flashcards", label: "Flashcards", icon: Layers },
  { to: "/bloom", label: "Bloom Levels", icon: Pyramid },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center border-2 border-obsidian bg-diamond text-accent-foreground" style={{ boxShadow: "inset 3px 3px 0 0 oklch(1 0 0 / 0.4), inset -3px -3px 0 0 oklch(0 0 0 / 0.3)" }}>
        <Database className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="font-display text-lg text-shadow-pixel">BLOOM<span className="text-emerald">DB</span></span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen md:flex">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b-4 border-obsidian bg-forest px-4 py-3 md:hidden">
        <Logo />
        <button aria-label="Menu" onClick={() => setOpen(!open)} className="slot p-2">{open ? <X /> : <Menu />}</button>
      </header>
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r-4 border-obsidian bg-forest transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0", open && "translate-x-0")}
        style={{ backgroundImage: "var(--texture-stone)", backgroundSize: "16px 16px" }}>
        <div className="h-3 bg-emerald" style={{ boxShadow: "inset 0 -3px 0 0 oklch(0 0 0 / 0.3)" }} />
        <div className="flex h-full flex-col gap-6 p-4">
          <div className="hidden md:block"><Logo /></div>
          <nav className="flex flex-col gap-1.5">
            {nav.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className="slot flex items-center gap-3 px-3 py-2.5 font-display text-[11px] uppercase text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "slot-active !text-foreground" }}>
                <Icon className="h-4 w-4" strokeWidth={2.5} />{label}
              </Link>
            ))}
          </nav>
          <div className="panel-wood mt-auto mb-6 p-3 text-xs">
            <p className="font-display uppercase">Lvl 14 · Analyst</p>
            <p className="mt-1 opacity-80">720 XP to next level</p>
          </div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-obsidian/70 md:hidden" onClick={() => setOpen(false)} />}
      <main className="min-w-0 flex-1 px-4 py-8 md:px-10">{children}</main>
    </div>
  );
}
