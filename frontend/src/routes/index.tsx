import { createFileRoute, Link } from "@tanstack/react-router";
import { FileUp, Pyramid, Search, Layers } from "lucide-react";
import hero from "@/assets/hero-voxel.jpg";
import { Logo } from "@/components/bloom/AppShell";
import { Cube, Panel, blockLinkClass } from "@/components/bloom/ui";
import { BLOOM_LEVELS } from "@/lib/bloom";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BloomDB — Mine DBMS knowledge, block by block" },
      { name: "description", content: "AI-powered DBMS learning: add textbooks and notes, organize them by Bloom's Taxonomy, search, ask and revise." },
      { property: "og:title", content: "BloomDB — Mine DBMS knowledge, block by block" },
      { property: "og:description", content: "AI-powered DBMS learning organized by Bloom's Taxonomy." },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: FileUp, title: "Add sources", text: "Upload textbooks, chapters, PDFs and notes." },
  { icon: Pyramid, title: "Classify", text: "Every chunk is tagged with a Bloom level." },
  { icon: Search, title: "Retrieve", text: "Semantic search and AI answers grounded in your material." },
  { icon: Layers, title: "Revise", text: "Flashcards and progress tracking per tier." },
];

function Landing() {
  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <Logo />
        <Link to="/dashboard" className={blockLinkClass("stone")}>Open app</Link>
      </header>
      <section className="relative flex min-h-[92vh] items-end overflow-hidden border-b-4 border-obsidian">
        <img src={hero} alt="Voxel library tower glowing with diamond-blue knowledge cubes" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 md:px-12">
          <p className="font-display text-xs uppercase text-diamond">AI · DBMS · Bloom's Taxonomy</p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight text-shadow-pixel md:text-6xl">Mine database knowledge, block by block.</h1>
          <p className="mt-5 max-w-xl text-lg text-foreground/80">BloomDB turns your DBMS textbooks and notes into a structured knowledge world — organized from Remember to Create.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard" className={blockLinkClass("emerald")}>Start mining</Link>
            <Link to="/ask" className={blockLinkClass("diamond")}>Ask a question</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-12">
        <h2 className="text-2xl md:text-3xl">Six tiers of mastery</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-6">
          {BLOOM_LEVELS.map((l) => (
            <Panel key={l.id} className="flex flex-col items-center gap-3 p-4 text-center">
              <Cube level={l.id} size={48} />
              <p className={`font-display text-xs uppercase ${l.text}`}>L{l.n} {l.name}</p>
              <p className="text-xs text-muted-foreground">{l.verbs}</p>
            </Panel>
          ))}
        </div>

        <h2 className="mt-20 text-2xl md:text-3xl">How it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <Panel key={s.title} className="p-5">
              <div className="slot mb-4 flex h-12 w-12 items-center justify-center text-diamond"><s.icon className="h-5 w-5" /></div>
              <p className="font-display text-[10px] text-muted-foreground">STEP {i + 1}</p>
              <h3 className="mt-1 text-base">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </Panel>
          ))}
        </div>
      </section>
      <footer className="border-t-4 border-obsidian bg-forest px-6 py-6 text-center font-display text-[10px] uppercase text-muted-foreground">BloomDB · A DBMS knowledge retrieval project</footer>
    </div>
  );
}
