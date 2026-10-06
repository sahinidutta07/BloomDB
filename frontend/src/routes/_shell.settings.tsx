import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL, USE_MOCKS } from "@/lib/api/config";
import { BLOOM_LEVELS } from "@/lib/bloom";
import { BlockButton, PageHeader, Panel } from "@/components/bloom/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({ meta: [
    { title: "Settings — BloomDB" },
    { name: "description", content: "Configure your BloomDB profile, learning goals and backend connection." },
    { property: "og:title", content: "Settings — BloomDB" },
    { property: "og:description", content: "BloomDB preferences." },
  ] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("Riju");
  const [goal, setGoal] = useState("analyze");
  const [daily, setDaily] = useState(20);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Crafting table" title="Settings" />
      <Panel className="p-6">
        <h2 className="text-lg">Profile</h2>
        <label className="mt-4 block text-sm text-muted-foreground">Display name
          <input value={name} onChange={(e) => setName(e.target.value)} className="slot mt-1 block w-full px-3 py-2 text-foreground outline-none" />
        </label>
        <label className="mt-4 block text-sm text-muted-foreground">Daily card goal: <span className="font-mono text-foreground">{daily}</span>
          <input type="range" min={5} max={60} value={daily} onChange={(e) => setDaily(+e.target.value)} className="mt-2 block w-full accent-emerald" />
        </label>
      </Panel>
      <Panel className="p-6">
        <h2 className="text-lg">Target tier</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {BLOOM_LEVELS.map((l) => (
            <button key={l.id} onClick={() => setGoal(l.id)} className={cn("px-3 py-2 font-display text-[10px] uppercase", goal === l.id ? `slot-active ${l.text}` : "slot text-muted-foreground")}>{l.name}</button>
          ))}
        </div>
      </Panel>
      <Panel variant="obsidian" className="p-6">
        <h2 className="text-lg">Backend connection</h2>
        <p className="mt-2 text-sm text-muted-foreground">BloomDB talks to the FastAPI backend at the address set in <code className="font-mono text-diamond">VITE_API_BASE_URL</code>.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="slot p-3"><p className="text-[10px] uppercase text-muted-foreground">API base URL</p><p className="font-mono text-sm">{API_BASE_URL || "not set"}</p></div>
          <div className="slot p-3"><p className="text-[10px] uppercase text-muted-foreground">Data mode</p><p className={cn("font-display text-sm", USE_MOCKS ? "text-gold" : "text-emerald")}>{USE_MOCKS ? "Mock data" : "Live API"}</p></div>
        </div>
      </Panel>
      <BlockButton onClick={() => toast.success("Settings saved")}>Save settings</BlockButton>
    </div>
  );
}
