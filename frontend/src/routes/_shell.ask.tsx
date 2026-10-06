import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { questionsApi } from "@/lib/api";
import { bloomOf } from "@/lib/bloom";
import { BloomBadge, BlockButton, Cube, Mining, PageHeader, Panel, PixelBar } from "@/components/bloom/ui";

export const Route = createFileRoute("/_shell/ask")({
  head: () => ({ meta: [
    { title: "Ask AI — BloomDB" },
    { name: "description", content: "Ask any DBMS question and get grounded answers with detected Bloom level and sources." },
    { property: "og:title", content: "Ask AI — BloomDB" },
    { property: "og:description", content: "Grounded AI answers to DBMS questions." },
  ] }),
  component: Ask,
});

const examples = ["Explain the difference between 3NF and BCNF", "Write a query to find employees above department average", "Design an ER schema for a library system", "Which is better for range queries: hashing or B+ trees?"];

function Ask() {
  const [text, setText] = useState("");
  const ask = useMutation({ mutationFn: questionsApi.ask });
  const r = ask.data;
  const l = r && bloomOf(r.bloom);
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="Enchanting table" title="Ask BloomDB" desc="Answers are retrieved from your sources and pitched at the right cognitive tier." />
      <Panel variant="obsidian" className="p-4">
        <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) ask.mutate(text.trim()); }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Ask a DBMS question…"
            className="slot w-full resize-none bg-stone-dark p-4 outline-none placeholder:text-muted-foreground" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {examples.map((e) => <button type="button" key={e} onClick={() => setText(e)} className="border-2 border-border px-2 py-1 text-xs text-muted-foreground hover:border-diamond hover:text-diamond">{e}</button>)}
            </div>
            <BlockButton tone="diamond" disabled={ask.isPending || !text.trim()}><Sparkles className="h-4 w-4" />Ask</BlockButton>
          </div>
        </form>
      </Panel>

      {ask.isPending && <div className="mt-8"><Mining label="Retrieving and reasoning" /></div>}
      {ask.isError && <Panel className="mt-8 border-redstone p-5 text-redstone">{(ask.error as Error).message}</Panel>}

      {r && l && !ask.isPending && (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Panel className="p-6">
              <div className="flex items-center gap-2 font-display text-xs uppercase text-diamond"><Sparkles className="h-4 w-4" />AI explanation</div>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/90">{r.answer}</p>
            </Panel>
            <div>
              <h2 className="mb-3 text-lg">Retrieved knowledge</h2>
              <div className="space-y-3">
                {r.retrieved.map((c) => (
                  <Panel key={c.id} className="p-4">
                    <div className="flex items-center justify-between"><span className="font-mono text-xs text-emerald">{(c.score * 100).toFixed(0)}% match · p.{c.page}</span><BloomBadge level={c.bloom} /></div>
                    <h3 className="mt-1 font-sans text-sm font-semibold">{c.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
                  </Panel>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Panel variant="obsidian" className="p-5">
              <p className="font-display text-[10px] uppercase text-muted-foreground">Detected Bloom level</p>
              <div className="mt-4 flex items-center gap-4"><Cube level={r.bloom} size={56} />
                <div><p className={`font-display text-xl ${l.text}`}>L{l.n} {l.name}</p><p className="text-xs text-muted-foreground">{l.verbs}</p></div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Confidence</p>
              <PixelBar value={r.confidence * 100} tone="diamond" className="mt-1" />
            </Panel>
            <Panel className="p-5">
              <p className="font-display text-[10px] uppercase text-muted-foreground">Related concepts</p>
              <div className="mt-3 flex flex-wrap gap-2">{r.related.map((x) => <button key={x} onClick={() => { setText(`Explain ${x}`); }} className="slot px-2.5 py-1 text-xs hover:text-diamond">{x}</button>)}</div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}
