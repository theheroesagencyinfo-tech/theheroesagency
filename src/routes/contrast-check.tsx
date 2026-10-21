import { assetSrc } from "@/components/site";
import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { PageIntro, ReviewCta } from "@/components/page";
import { Button } from "@/components/ui/button";
import { checkContrast } from "@/lib/contrast.functions";
import type { ContrastReport } from "@/lib/contrast-schema";
import dcHome from "@/assets/daniel-carter/home.png.asset.json";
import dcBooks from "@/assets/daniel-carter/books.png.asset.json";
import ewHome from "@/assets/eleanor-whitmore/home.png.asset.json";
import ewEvents from "@/assets/eleanor-whitmore/events.png.asset.json";
import jrHome from "@/assets/jonathan-reed/home.png.asset.json";
import jrContact from "@/assets/jonathan-reed/contact.png.asset.json";

const samples = [
  { label: "Daniel Carter · Homepage", src: assetSrc(dcHome) },
  { label: "Daniel Carter · Books", src: assetSrc(dcBooks) },
  { label: "Eleanor Whitmore · Homepage", src: assetSrc(ewHome) },
  { label: "Eleanor Whitmore · Events", src: assetSrc(ewEvents) },
  { label: "Jonathan Reed · Homepage", src: assetSrc(jrHome) },
  { label: "Jonathan Reed · Contact", src: assetSrc(jrContact) },
];

export const Route = createFileRoute("/contrast-check")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "Free colour contrast check · TheHeroes Agency · Author Studio" },
    { name: "description", content: "Upload a screenshot of your author website and get an AI-powered list of hard-to-read text with accessible colour suggestions." },
    { property: "og:title", content: "Free colour contrast check for author websites" },
    { property: "og:description", content: "Find hard-to-read text on your author website and get accessible colour fixes in seconds." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ContrastCheck,
});

const MAX_WIDTH = 1280;
const MAX_HEIGHT = 2400;

async function toDataUrl(blob: Blob): Promise<string> {
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width, MAX_HEIGHT / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/png");
}

function Swatch({ color }: { color: string }) {
  return <span className="inline-flex items-center gap-1.5 font-mono text-xs">
    <span aria-hidden className="inline-block size-4 border" style={{ backgroundColor: color }} />{color}
  </span>;
}

function ContrastCheck() {
  const fileId = useId();
  const [preview, setPreview] = useState<{ src: string; label: string; blob?: Blob } | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [report, setReport] = useState<ContrastReport | null>(null);
  const [error, setError] = useState("");

  function choose(next: { src: string; label: string; blob?: Blob }) {
    setPreview(next); setReport(null); setError(""); setStatus("idle");
  }

  async function run() {
    if (!preview) return;
    setStatus("loading"); setError(""); setReport(null);
    try {
      const blob = preview.blob ?? await (await fetch(preview.src)).blob();
      const image = await toDataUrl(blob);
      const res = await checkContrast({ data: { image } });
      if (res.ok) { setReport(res.report); setStatus("done"); }
      else { setError(res.message); setStatus("error"); }
    } catch {
      setError("The check couldn't finish. Please try another image."); setStatus("error");
    }
  }

  return <>
    <PageIntro label="Free tool · AI-powered" title="Check your colour contrast.">
      Pick a page from my work or upload a screenshot of your own site. I'll point out text readers may struggle to see and suggest accessible colours to fix it.
    </PageIntro>

    <section className="border-t"><div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-12 md:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-8">
        <fieldset>
          <legend className="text-sm font-semibold">1. Choose a page</legend>
          <div className="mt-3 flex flex-col">
            {samples.map(s => <button key={s.src} type="button" aria-pressed={preview?.src === s.src}
              onClick={() => choose(s)}
              className={`border-l-2 px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-ring ${preview?.src === s.src ? "border-primary font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {s.label}
            </button>)}
          </div>
        </fieldset>
        <div>
          <label htmlFor={fileId} className="text-sm font-semibold">Or upload a screenshot</label>
          <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or WebP, up to 10 MB. Your image is only used for this check.</p>
          <input id={fileId} type="file" accept="image/png,image/jpeg,image/webp"
            className="mt-3 block w-full text-sm file:mr-3 file:border file:bg-secondary file:px-3 file:py-1.5 file:text-foreground"
            onChange={e => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 10 * 1024 * 1024) { setError("That file is over 10 MB."); setStatus("error"); return; }
              choose({ src: URL.createObjectURL(file), label: file.name, blob: file });
            }} />
        </div>
        <Button variant="studio" size="studio" disabled={!preview || status === "loading"} onClick={run}>
          {status === "loading" ? "Checking contrast…" : "Check contrast"}
        </Button>
        <p aria-live="polite" className="text-sm">{error && <span className="text-destructive">{error}</span>}</p>
      </div>

      <div className="min-w-0 space-y-8">
        {preview
          ? <div className="max-h-[60vh] overflow-y-auto border bg-muted" tabIndex={0} aria-label={`Preview: ${preview.label}`}>
              <img src={preview.src} alt={`Screenshot: ${preview.label}`} className="block h-auto w-full" />
            </div>
          : <div className="flex h-64 items-center justify-center border border-dashed text-sm text-muted-foreground">Your page preview appears here</div>}

        {status === "loading" && <p className="text-sm text-muted-foreground" aria-live="polite">Reading the page. This usually takes 20 to 60 seconds.</p>}

        {report && <div aria-live="polite">
          <h2 className="text-2xl">{report.issues.length ? `${report.issues.length} hard-to-read ${report.issues.length === 1 ? "spot" : "spots"}` : "No contrast problems found"}</h2>
          <p className="mt-2 text-muted-foreground">{report.summary}</p>
          <ol className="mt-6 divide-y border-y">
            {report.issues.map((i, n) => <li key={n} className="grid gap-3 py-5 md:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{i.location} · {i.severity === "fail" ? "Fails" : "Borderline"}</p>
                <p className="mt-1 font-serif text-lg">“{i.text}”</p>
                <p className="mt-2 text-sm text-muted-foreground">{i.note}</p>
              </div>
              <div className="space-y-2 text-sm">
                <p>Now: <Swatch color={i.foreground} /> on <Swatch color={i.background} /> · {i.ratio.toFixed(1)}:1 (needs {i.required}:1)</p>
                <p>Try: <Swatch color={i.suggestedForeground} />{i.suggestedBackground && <> on <Swatch color={i.suggestedBackground} /></>} · {i.newRatio.toFixed(1)}:1</p>
                <p className="border px-3 py-2" style={{ color: i.suggestedForeground, backgroundColor: i.suggestedBackground ?? i.background }}>{i.text}</p>
              </div>
            </li>)}
          </ol>
          <p className="mt-4 text-xs text-muted-foreground">Colours and ratios are estimated from the image. Confirm final values with a contrast checker before publishing.</p>
        </div>}
      </div>
    </div></section>
    <ReviewCta />
  </>;
}
