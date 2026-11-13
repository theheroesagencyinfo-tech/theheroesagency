import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { assetSrc } from "@/components/site";
import { ReviewForm } from "@/components/ReviewForm";
import { ProjectRating } from "@/components/project-rating";
import danielHome from "@/assets/daniel-carter/home.png.asset.json";
import eleanorHome from "@/assets/eleanor-whitmore/home.png.asset.json";
import jonathanHome from "@/assets/jonathan-reed/home.png.asset.json";
import bookPhoto from "@/assets/home-book.webp";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "TheHeroes Agency · Author Studio: websites and funnels for nonfiction authors" },
      { name: "description", content: "Author websites, email funnels and book launch creative that turn readers into subscribers, client enquiries and speaking invitations. Get a free author site review." },
      { property: "og:title", content: "TheHeroes Agency · Author Studio" },
      { property: "og:description", content: "Your book opens the door. We build what comes next: websites, email funnels and launch creative for nonfiction authors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const sections = [
  ["top", "Top"], ["studio", "Studio"], ["services", "What we build"], ["work", "Selected work"],
  ["difference", "Why TheHeroes"], ["journey", "Reader journey"], ["process", "How it works"], ["review", "Free site review"],
] as const;

const services = [
  { h: "Author websites", p: "A distinctive digital home for your books, expertise, speaking and services. Designed to establish credibility and make the next step obvious.", to: "/services" as const },
  { h: "Email & reader funnels", p: "Reader magnets, signup experiences and welcome emails that turn passing interest into an audience you can reach again.", to: "/services" as const },
  { h: "Book launch creative", p: "Launch pages, email campaigns and supporting creative that give your next release a clear, coordinated digital presence.", to: "/services" as const },
];

const projects = [
  { to: "/projects/daniel-carter" as const, slug: "daniel-carter", name: "Daniel Carter", meta: "Author website · 8 pages", img: danielHome, p: "A digital home bringing his books, ideas, speaking work and reader resources together." },
  { to: "/projects/eleanor-whitmore" as const, slug: "eleanor-whitmore", name: "Eleanor Whitmore", meta: "Author website · 7 pages", img: eleanorHome, p: "A warm, welcoming platform for her book, events, journal and reader resources." },
  { to: "/projects/jonathan-reed" as const, slug: "jonathan-reed", name: "Jonathan Reed", meta: "Literary author website · 6 pages", img: jonathanHome, p: "A considered presentation of his books, essays, speaking events and resources." },
];

const journey = [
  { n: "01", label: "Discovery", h: "They find you.", p: "Through your book, a talk, a podcast or a recommendation.", note: "A first point of discovery", cls: "md:col-start-1 md:row-start-1", photo: "h-[330px] md:h-[clamp(330px,43vw,570px)]" },
  { n: "02", label: "Connection", h: "They stay.", p: "Your website gives them a useful reason to join your reader list.", note: "A reason to stay", cls: "md:col-start-2 md:row-start-1 md:mt-32", photo: "h-[260px] md:h-[clamp(235px,28vw,365px)]" },
  { n: "03", label: "Relationship", h: "They get to know you.", p: "Helpful emails build trust and show how your expertise can help.", note: "Trust built over time", cls: "ml-[10%] md:col-start-1 md:row-start-2 md:ml-[15%]", photo: "h-[280px] md:h-[clamp(250px,30vw,390px)]" },
  { n: "04", label: "Opportunity", h: "They take action.", p: "A conversation, client enquiry, speaking invitation or book sale.", note: "The next opportunity", cls: "md:col-start-2 md:row-start-2 md:mt-20", photo: "h-[300px] md:h-[clamp(300px,36vw,465px)]" },
];

const checks = [
  { h: "Message clarity", p: "Can a new visitor understand who you help and what you offer within five seconds?" },
  { h: "Reader capture", p: "Where are readers leaving without joining your audience, and what would give them a reason to stay?" },
  { h: "Mobile experience", p: "How clearly does your website work on the phone most readers use?" },
  { h: "Three priority fixes", p: "A short list of the improvements worth making first, ordered by effort and likely impact." },
];

const ROUTE = "M280 210 C470 150 660 170 760 350 S720 650 450 760 S650 900 790 1010";
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/** Empty frame kept until the studio supplies its own photograph. */
function PhotoFrame({ label, className = "" }: { label: string; className?: string }) {
  return <div role="img" aria-label={label} className={`relative flex items-end overflow-hidden border bg-secondary p-4 ${className}`}>
    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
  </div>;
}

function Eyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  return <p className={`reveal text-[11px] font-semibold uppercase tracking-[0.2em] ${dark ? "text-pitch-accent" : "text-primary"}`}>{children}</p>;
}

function Home() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = <T extends Element>(s: string) => el.querySelector<T>(s);
    const reveals = el.querySelectorAll(".reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("visible")), { threshold: 0.12 });
    reveals.forEach((r) => io.observe(r));

    const opening = q<HTMLDivElement>("[data-opening]");
    const spacer = q<HTMLDivElement>("[data-opening-spacer]");
    const book = q<HTMLDivElement>("[data-book]");
    const editorial = q<HTMLDivElement>("[data-editorial]");
    const side = q<HTMLDivElement>("[data-side]");
    const hint = q<HTMLDivElement>("[data-hint]");
    const scenes = Array.from(el.querySelectorAll<HTMLElement>("[data-scene]"));
    const dots = Array.from(el.querySelectorAll<HTMLAnchorElement>("[data-dot]"));
    const path = q<SVGPathElement>("#journeyRoutePath");
    const plane = q<SVGGElement>("#journeyPlane");
    const comp = q<HTMLDivElement>("[data-journey]");

    if (reduced) {
      opening?.style.setProperty("display", "none");
      spacer?.style.setProperty("display", "none");
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      if (!reduced && opening && spacer && book) {
        const range = Math.max(1, spacer.offsetHeight - vh * 0.2);
        const p = clamp(window.scrollY / range);
        const turn = clamp((p - 0.36) / 0.42);
        book.style.transform = `translate3d(0,${-Math.sin(p * Math.PI) * 34}px,${turn * -90}px) scale(${1 + clamp(p / 0.68) * 1.42}) rotateX(${p * 4}deg) rotateY(${turn * -7}deg)`;
        if (editorial) editorial.style.opacity = String(1 - clamp((p - 0.72) / 0.22) * 0.9);
        const s = clamp((p - 0.12) / 0.24);
        if (side) { side.style.opacity = String(s); side.style.transform = `translateY(${(1 - s) * 12}px)`; }
        if (hint) hint.style.opacity = String(1 - clamp(p * 3.1));
        const out = clamp((p - 0.7) / 0.18);
        opening.style.opacity = String(1 - out);
        opening.style.visibility = out >= 1 ? "hidden" : "visible";
        opening.style.pointerEvents = out > 0.5 ? "none" : "auto";
      }
      let active = 0;
      scenes.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.top < vh * 0.55) active = i;
        if (reduced || window.innerWidth < 768) return;
        const near = clamp((r.top + r.height / 2 - vh * 0.52) / vh, -1, 1);
        s.style.transform = `perspective(1400px) translate3d(0,${clamp(near * 17, -24, 24)}px,${-Math.min(40, Math.abs(near) * 40)}px) rotateX(${clamp(near * -4.2, -5, 5)}deg)`;
        s.style.opacity = String(1 - Math.min(0.13, Math.abs(near) * 0.13));
        s.querySelectorAll<HTMLElement>("[data-depth]").forEach((d) => {
          const depth = Number(d.dataset["depth"]) || 0.1;
          d.style.transform = `translate3d(0,${-near * vh * depth * 0.12}px,${depth * 22}px) rotateY(${near * depth * 2}deg)`;
        });
      });
      dots.forEach((d, i) => d.dataset["active"] = String(i === active));
      if (path && plane && comp) {
        const total = path.getTotalLength();
        const r = comp.getBoundingClientRect();
        const prog = reduced ? 0 : clamp((vh * 0.78 - r.top) / (r.height + vh * 0.56));
        const pt = path.getPointAtLength(total * prog);
        const ah = path.getPointAtLength(Math.min(total, total * prog + 2));
        plane.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${(Math.atan2(ah.y - pt.y, ah.x - pt.x) * 180) / Math.PI})`);
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  return (
    <div ref={root} className="home6 overflow-x-clip">
      {/* Cinematic opening: covers the page until the visitor scrolls through it */}
      <div data-opening aria-hidden="true" className="book-stage fixed inset-0 z-[60] grid place-items-center overflow-hidden">
        <div data-editorial className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 text-center">
          <p className="absolute left-5 top-[12%] text-[9px] font-semibold uppercase tracking-[0.24em] text-primary sm:left-[7vw] sm:top-[10%]">TheHeroes Agency · Author Studio</p>
          <p className="display max-w-[1100px] font-serif text-[clamp(52px,9.2vw,132px)] text-foreground/20">A book is only<br />the <em className="text-primary/30">beginning.</em></p>
          <div data-side className="absolute bottom-[16%] right-6 w-[150px] text-left text-[11px] leading-relaxed text-foreground opacity-0 sm:right-[7vw] sm:w-[190px]">
            <strong className="mb-2 block font-serif text-lg font-medium leading-tight">We build what comes next.</strong>
            Author websites, email funnels and book launch creative that take your expertise further.
          </div>
        </div>
        <div data-book className="book-inner relative z-[2] w-[min(52vw,420px)]">
          <img src={bookPhoto} alt="" width={717} height={1014} fetchPriority="high" className="block max-h-[62svh] w-full select-none object-contain" draggable={false} />
        </div>
        <div data-hint className="book-hint absolute inset-x-0 bottom-8 z-[4] text-center text-[9px] uppercase tracking-[0.22em] text-muted-foreground">Scroll to open the story</div>
      </div>
      <div data-opening-spacer className="h-[150vh] md:h-[190vh]" aria-hidden="true" />

      {/* Section progress rail */}
      <nav aria-label="Page sections" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
        {sections.map(([id, label]) => (
          <a key={id} href={`#${id}`} data-dot aria-label={label} title={label}
            className="h-[5px] w-[5px] rounded-full bg-foreground/25 transition-all data-[active=true]:h-6 data-[active=true]:bg-primary" />
        ))}
      </nav>

      {/* Hero */}
      <section id="top" data-scene className="scene relative scroll-mt-24 px-5 pb-24 pt-14 sm:px-[7vw] md:min-h-[calc(100svh-70px)] md:pt-20">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 md:grid-cols-[1.02fr_.98fr] md:gap-[7vw]">
          <div>
            <Eyebrow>Digital platforms for nonfiction authors</Eyebrow>
            <h1 className="display reveal mt-5 font-serif text-[clamp(46px,7vw,100px)]">Your book opens the door. <em className="text-primary">We build what comes next.</em></h1>
            <p className="reveal mt-6 max-w-[500px] leading-relaxed text-muted-foreground sm:text-lg">We design author websites, email funnels and book launch creative that turn your expertise into readers, subscribers, client enquiries and speaking opportunities.</p>
            <div className="reveal mt-9 flex flex-wrap items-center gap-6">
              <a href="#review" className="inline-flex items-center gap-4 bg-primary px-5 py-3.5 text-sm text-primary-foreground transition hover:-translate-y-0.5">Get my free site review <span aria-hidden>↗</span></a>
              <a href="#work" className="border-b border-foreground pb-1 text-sm">Explore selected work</a>
            </div>
            <p className="reveal mt-12 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Strategy · Design · Development · Reader growth</p>
          </div>
          <div className="relative mx-auto h-[400px] w-full max-w-[620px] sm:h-[540px] md:h-[min(650px,60vw)]" style={{ transformStyle: "preserve-3d" }}>
            <p className="absolute left-0 top-[8%] z-[4] text-[9px] uppercase tracking-[0.2em] text-primary [writing-mode:vertical-rl]">Ideas in form · The author studio</p>
            <div data-depth="0.16" className="absolute right-0 top-[4%] z-[2] h-[82%] w-[72%] shadow-xl"><PhotoFrame label="Studio photo" className="h-full !items-start justify-end" /></div>
            <div data-depth="0.28" className="absolute bottom-[2%] left-0 z-[3] h-[43%] w-[43%] border-[6px] border-background shadow-xl sm:border-[10px]"><PhotoFrame label="Detail photo" className="h-full" /></div>
            <div data-depth="0.35" className="absolute -bottom-[2%] right-[5%] z-[1] h-[34%] w-[25%]"><PhotoFrame label="Photo" className="h-full" /></div>
          </div>
        </div>
      </section>

      {/* Studio statement */}
      <section id="studio" data-scene className="scene scroll-mt-20 bg-pitch px-5 py-24 text-pitch-foreground sm:px-[7vw] md:flex md:min-h-[76vh] md:items-center">
        <div className="mx-auto grid w-full max-w-[1320px] gap-8 md:grid-cols-[.7fr_1.3fr] md:gap-[8vw]">
          <Eyebrow dark>A platform, not just a website</Eyebrow>
          <div>
            <h2 className="display reveal font-serif text-[clamp(40px,6vw,82px)]">A book builds authority. <em className="text-pitch-accent">A connected platform puts it to work.</em></h2>
            <p className="reveal mt-6 max-w-[420px] text-sm leading-loose text-pitch-muted">Your website, reader magnet, email journey and launch materials should work together. We bring those pieces into one clear experience, designed around what you want your expertise to do next.</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" data-scene className="scene scroll-mt-20 px-5 py-24 sm:px-[7vw] md:py-32">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><Eyebrow>What we build</Eyebrow><h2 className="display reveal mt-4 font-serif text-[clamp(40px,5.5vw,76px)]">Three parts. <em className="text-primary">One connected system.</em></h2></div>
            <p className="reveal max-w-[340px] text-sm leading-relaxed text-muted-foreground">The essentials that help nonfiction authors look credible, stay connected to readers and create opportunities beyond the book.</p>
          </div>
          <div className="border-t border-foreground/20">
            {services.map((s, i) => (
              <Link key={s.h} to={s.to} className="reveal grid grid-cols-[36px_1fr_24px] items-center gap-3 border-b border-foreground/20 py-6 transition-all hover:px-2 md:grid-cols-[90px_1fr_1fr_42px] md:gap-6 md:py-8 md:hover:px-4">
                <span className="font-serif text-lg text-primary">0{i + 1}</span>
                <h3 className="font-serif text-[26px] tracking-tight md:text-[clamp(25px,3vw,40px)]">{s.h}</h3>
                <p className="col-start-2 row-start-2 max-w-[430px] text-sm leading-relaxed text-muted-foreground md:col-start-3 md:row-start-1">{s.p}</p>
                <span aria-hidden className="col-start-3 row-span-2 row-start-1 text-2xl text-primary md:col-start-4 md:row-span-1">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section id="work" data-scene className="scene scroll-mt-20 bg-secondary px-5 py-24 sm:px-[7vw] md:py-32">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><Eyebrow>Selected work · Real author projects</Eyebrow><h2 className="display reveal mt-4 font-serif text-[clamp(42px,6vw,82px)]">Different voices.<br /><em className="text-primary">Thoughtful digital homes.</em></h2></div>
            <p className="reveal max-w-[290px] text-sm leading-relaxed text-muted-foreground">Each author has a different story, audience and visual language. The work should reflect that.</p>
          </div>
          <div className="grid items-start gap-14 md:grid-cols-[1.13fr_.87fr] md:gap-x-[5vw]">
            {projects.map((p, i) => (
              <article key={p.slug} className={`reveal ${i === 1 ? "md:mt-28" : ""} ${i === 2 ? "md:col-start-1 md:-mt-5" : ""}`}>
                <Link to={p.to} className="group block aspect-[4/3] overflow-hidden border bg-muted shadow-lg" aria-label={`View the ${p.name} author website`}>
                  <img src={assetSrc(p.img)} alt={`${p.name} author website homepage`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.035]" />
                </Link>
                <div className="mt-4 flex justify-between gap-5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground"><span>{p.meta}</span><span>0{i + 1} / 03</span></div>
                <h3 className="mt-2 font-serif text-[27px] md:text-3xl">{p.name}</h3>
                <ProjectRating project={p.slug} />
                <p className="mt-2 max-w-[460px] text-sm leading-relaxed text-muted-foreground">{p.p}</p>
                <Link to={p.to} className="mt-4 inline-block border-b border-primary pb-1 text-[11px] uppercase tracking-[0.1em] text-primary">View project ↗</Link>
              </article>
            ))}
            <div className="reveal self-end md:col-start-2"><Link to="/work" className="inline-block border-b border-foreground pb-1 text-sm">See all work ↗</Link></div>
          </div>
        </div>
      </section>

      {/* Difference */}
      <section id="difference" data-scene className="scene scroll-mt-20 px-5 py-24 sm:px-[7vw] md:py-32">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 md:grid-cols-2 md:gap-[8vw]">
          <div>
            <Eyebrow>Why TheHeroes</Eyebrow>
            <h2 className="display reveal mt-4 font-serif text-[clamp(40px,5.7vw,78px)]">Not just a good-looking site. <em className="text-primary">A reason for readers to stay.</em></h2>
            <p className="reveal mt-6 max-w-[490px] text-sm leading-loose text-muted-foreground">A lot of author websites stop at introducing the book. We look at the full journey: what a visitor understands, what makes them stay, how they join your audience and where that relationship can lead. Design matters. So does what the design helps people do.</p>
            <a href="#review" className="reveal mt-6 inline-block border-b border-foreground pb-1 text-sm">See what your site could improve ↗</a>
          </div>
          <div data-depth="0.18" className="reveal"><PhotoFrame label="Creative direction · Digital experience" className="h-[390px] md:h-[600px]" /></div>
        </div>
      </section>

      {/* Reader journey */}
      <section id="journey" data-scene className="scene scroll-mt-20 px-5 py-24 sm:px-[7vw] md:py-36">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><Eyebrow>The reader journey</Eyebrow><h2 className="display reveal mt-4 max-w-[760px] font-serif text-[clamp(42px,6vw,82px)]">From discovering your work to taking the next step.</h2></div>
            <p className="reveal max-w-[290px] text-sm leading-relaxed text-muted-foreground">A book creates the first connection. A thoughtful digital experience gives that connection somewhere to go.</p>
          </div>
          <div data-journey className="relative isolate grid gap-10 md:grid-cols-[1.12fr_.88fr] md:gap-x-[8%] md:gap-y-16">
            <svg className="journey-route pointer-events-none absolute inset-0 -z-0 hidden h-full w-full overflow-visible md:block" viewBox="0 0 1000 1150" preserveAspectRatio="none" aria-hidden="true">
              <path className="route-underlay" d={ROUTE} />
              <path className="route-line" id="journeyRoutePath" d={ROUTE} />
              <g id="journeyPlane" transform="translate(280 210)"><path className="plane-shape" d="M-18 -10 L20 0 L-18 12 L-9 1 Z" /><path className="plane-fold" d="M-9 1 L20 0 M-9 1 L-3 8" /></g>
            </svg>
            {journey.map((j) => (
              <article key={j.n} className={`reveal relative z-[1] min-w-0 ${j.cls}`}>
                <PhotoFrame label={j.note} className={`w-full ${j.photo}`} />
                <div className="mb-3 mt-5 flex items-center gap-3">
                  <span className="text-[10px] font-bold tracking-[0.18em] text-primary">{j.n}</span>
                  <span className="h-px w-8 bg-primary/60" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{j.label}</span>
                </div>
                <h3 className="font-serif text-[clamp(27px,3vw,39px)] leading-tight tracking-tight">{j.h}</h3>
                <p className="mt-2 max-w-[370px] text-sm leading-relaxed text-muted-foreground">{j.p}</p>
              </article>
            ))}
          </div>
          <div className="mt-20 flex flex-col justify-between gap-3 border-t border-foreground/20 pt-5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:flex-row">
            <span>One connected experience, from first impression to action.</span>
            <Link to="/services" className="font-semibold text-primary">Built around your expertise ↗</Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" data-scene className="scene scroll-mt-20 px-5 py-24 sm:px-[7vw] md:py-32">
        <div className="mx-auto grid max-w-[1320px] gap-12 md:grid-cols-[.8fr_1.2fr] md:gap-[8vw]">
          <div>
            <Eyebrow>A clear starting point</Eyebrow>
            <h2 className="display reveal mt-4 font-serif text-[clamp(40px,5.5vw,76px)]">Find out what your site is costing you.</h2>
            <p className="reveal mt-5 max-w-[330px] text-sm leading-loose text-muted-foreground">Start with a free author site review. No pressure, no vague advice. Just a practical look at what could work harder.</p>
          </div>
          <ol className="border-t border-foreground/20">
            {checks.map((c, i) => (
              <li key={c.h} className="reveal grid grid-cols-[44px_1fr] gap-5 border-b border-foreground/20 py-6 md:grid-cols-[55px_1fr]">
                <span className="font-serif text-lg text-primary">0{i + 1}</span>
                <div><h3 className="font-serif text-2xl">{c.h}</h3><p className="mt-1.5 max-w-[500px] text-sm leading-relaxed text-muted-foreground">{c.p}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Review CTA with the working form */}
      <section id="review" data-scene className="scene scroll-mt-20 bg-pitch px-5 py-24 text-pitch-foreground sm:px-[7vw] md:py-32">
        <div className="mx-auto grid max-w-[1320px] items-start gap-12 md:grid-cols-[1.1fr_.9fr] md:gap-[6vw]">
          <div>
            <Eyebrow dark>Your next chapter starts here</Eyebrow>
            <h2 className="display reveal mt-4 font-serif text-[clamp(44px,7vw,100px)]">Make more of the attention your book earns.</h2>
            <p className="reveal mt-6 max-w-[440px] text-sm leading-loose text-pitch-muted">Tell us about your book and your website. We'll review the experience and send practical notes on how to turn more readers into leads and opportunities.</p>
          </div>
          <div className="reveal bg-background p-6 text-foreground sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Free author site review</p>
            <p className="mb-6 mt-2 text-sm text-muted-foreground">Get a clear view of what's working, what's missing and what to improve next.</p>
            <ReviewForm mode="review" />
          </div>
        </div>
      </section>
    </div>
  );
}
