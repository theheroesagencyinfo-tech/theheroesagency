const journey = [
  { h: "Discovery", p: "A reader finds your book, a podcast episode, or a talk, and searches your name." },
  { h: "Free chapter", p: "Your site offers a chapter or workbook in exchange for an email address." },
  { h: "Welcome sequence", p: "Five emails build trust and show the reader how you work beyond the book." },
  { h: "Enquiry", p: "The reader books a call, hires you to speak, or signs up for your program." },
];

const reviewParts = [
  { h: "Message clarity", p: "Does your homepage say who you help and why your book matters, within five seconds?" },
  { h: "Reader capture", p: "Where readers leave without giving an email, and what would make them stay." },
  { h: "Mobile reading", p: "How your site looks and loads on a phone, where most readers arrive." },
  { h: "Three priority fixes", p: "The changes I'd make first, ordered by effort and likely impact." },
];

function Label({ children }: { children: string }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{children}</p>;
}

export function ReaderJourney({ secondary = false }: { secondary?: boolean }) {
  return (
    <section aria-labelledby="journey-h" className={`border-t ${secondary ? "bg-secondary" : ""}`}>
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Label>The reader journey</Label>
        <h2 id="journey-h" className="mt-4 max-w-[24ch] text-4xl">From someone who read your book to someone who hires you.</h2>
        <ol className="mt-12 grid gap-0 md:grid-cols-4">
          {journey.map((s, i) => (
            <li key={s.h} className="relative border-l border-foreground/20 pb-10 pl-6 md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pr-6 md:pt-6">
              <span aria-hidden className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-ring md:-top-[5px] md:left-0" />
              <span className="font-serif text-sm italic text-muted-foreground">Step {i + 1}</span>
              <h3 className="mt-1 text-2xl">{s.h}</h3>
              <p className="mt-2 text-muted-foreground">{s.p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ReviewPreview({ secondary = false }: { secondary?: boolean }) {
  return (
    <section aria-labelledby="preview-h" className={`border-t ${secondary ? "bg-secondary" : ""}`}>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1fr_2fr]">
        <div>
          <Label>What your review covers</Label>
          <h2 id="preview-h" className="mt-4 text-4xl">A short video, four clear sections.</h2>
          <p className="mt-4 max-w-[45ch] text-muted-foreground">No sales pitch. You can use the notes yourself.</p>
        </div>
        <ol className="divide-y border-y">
          {reviewParts.map((r, i) => (
            <li key={r.h} className="grid gap-2 py-6 sm:grid-cols-[3rem_1fr]">
              <span className="font-serif text-2xl text-ring">0{i + 1}</span>
              <div>
                <h3 className="text-xl">{r.h}</h3>
                <p className="mt-1 text-muted-foreground">{r.p}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
