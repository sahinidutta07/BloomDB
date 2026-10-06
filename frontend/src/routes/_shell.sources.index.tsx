import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FileUp, BookOpen, FileText, NotebookPen, File } from "lucide-react";
import { toast } from "sonner";
import { q, sourcesApi } from "@/lib/api";
import { BLOOM_LEVELS } from "@/lib/bloom";
import { BlockButton, Mining, PageHeader, Panel } from "@/components/bloom/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/sources/")({
  head: () => ({ meta: [
    { title: "Sources — BloomDB" },
    { name: "description", content: "Manage the textbooks, chapters, PDFs and notes that power your DBMS knowledge base." },
    { property: "og:title", content: "Sources — BloomDB" },
    { property: "og:description", content: "Your DBMS learning sources." },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(q.sources()),
  component: Sources,
});

const icons = { textbook: BookOpen, chapter: FileText, notes: NotebookPen, pdf: File };

function Sources() {
  const { data } = useSuspenseQuery(q.sources());
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  async function onFile(f?: File) {
    if (!f) return;
    setUploading(f.name);
    try { await sourcesApi.upload(f); toast.success(`${f.name} queued for mining`); }
    catch (e) { toast.error((e as Error).message); }
    finally { setUploading(null); }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Ore deposits" title="Sources" desc="Add DBMS material. BloomDB chunks it, classifies every piece and adds it to your world."
        action={<BlockButton onClick={() => input.current?.click()}><FileUp className="h-4 w-4" />Add source</BlockButton>} />
      <input ref={input} type="file" accept=".pdf,.txt,.md,.docx" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />

      <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}
        className="slot mb-6 flex flex-col items-center gap-2 border-dashed p-8 text-center">
        {uploading ? <Mining label={`Mining ${uploading}`} /> : <>
          <FileUp className="h-6 w-6 text-diamond" />
          <p className="font-display text-xs uppercase">Drop a PDF, notes or chapter here</p>
          <p className="text-xs text-muted-foreground">PDF · TXT · MD · DOCX</p>
        </>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((s) => {
          const Icon = icons[s.type];
          const total = Object.values(s.distribution).reduce((a, b) => a + b, 0);
          return (
            <Link key={s.id} to="/sources/$id" params={{ id: s.id }} className="group">
              <Panel className="h-full p-5 transition-transform group-hover:-translate-y-1">
                <div className="flex gap-4">
                  <div className="panel-wood flex h-12 w-12 shrink-0 items-center justify-center"><Icon className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-[10px] uppercase text-wood">{s.type}</span>
                      <span className={cn("font-display text-[10px] uppercase", s.status === "ready" ? "text-emerald" : "text-gold animate-mine")}>{s.status}</span>
                    </div>
                    <h3 className="mt-1 font-sans text-base font-semibold leading-snug">{s.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{s.author} · {s.pages} pages · {s.chunks} chunks</p>
                  </div>
                </div>
                <div className="pixel-bar mt-4 flex h-4 p-[2px]">
                  {BLOOM_LEVELS.map((l) => <div key={l.id} className={l.color} style={{ width: `${(s.distribution[l.id] / total) * 100}%` }} title={l.name} />)}
                </div>
              </Panel>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
