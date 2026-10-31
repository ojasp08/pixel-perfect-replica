import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Intro } from "@/components/Intro";
import { profile } from "@/data/profile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ojas Patkar — Portfolio" },
      { name: "description", content: "Ojas Patkar — first-year Computer Engineering student in Mumbai. Curious, creative, and always learning." },
      { property: "og:title", content: "Ojas Patkar — Portfolio" },
      { property: "og:description", content: "First-year Computer Engineering student in Mumbai. Curious, creative, and always learning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  ...(profile.projects.length ? [{ id: "work", label: "Work" }] : []),
  { id: "contact", label: "Contact" },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-visible"), io.unobserve(e.target))),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Index() {
  const [intro, setIntro] = useState<"pending" | "show" | "done">("pending");
  useEffect(() => {
    setIntro(sessionStorage.getItem("intro-seen") ? "done" : "show");
  }, []);
  const finish = useCallback(() => {
    sessionStorage.setItem("intro-seen", "1");
    setIntro("done");
  }, []);
  useReveal();

  return (
    <>
      {intro === "show" && <Intro onDone={finish} />}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-background/75 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Main">
          <a href="#top" className="font-display text-lg font-extrabold tracking-tight">
            {profile.initials}<span className="text-primary">.</span>
          </a>
          <ul className="flex gap-4 font-mono text-[11px] uppercase tracking-widest sm:gap-8 sm:text-xs">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="text-muted-foreground transition-colors hover:text-primary">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main">
        <section id="top" className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-6xl flex-col justify-center px-5 py-20 sm:px-8">
          <div key={intro} className={intro === "pending" ? "opacity-0" : "hero-enter"}>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
              {profile.location} — {profile.role}
            </p>
            <h1 className="mt-6 font-display text-[clamp(3.5rem,13vw,10rem)] font-extrabold leading-[0.88] tracking-[-0.04em]">
              Ojas<br />Patkar<span className="text-primary">.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{profile.intro}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#contact" className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5">
                Say hello
              </a>
              <a href="#about" className="rounded-full border border-border px-6 py-3 font-medium transition-colors hover:border-primary hover:text-primary">
                More about me ↓
              </a>
            </div>
          </div>
        </section>

        <Section id="about" index="01" title="About me">
          <div className="grid gap-12 md:grid-cols-[1fr_16rem]">
            <div className="space-y-6 text-lg leading-relaxed text-foreground/85">
              {profile.about.map((p, i) => (
                <p key={i} className={i === profile.about.length - 1 ? "font-display text-2xl font-bold text-foreground" : ""}>{p}</p>
              ))}
            </div>
            <aside className="space-y-4 border-l border-border pl-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Off the clock</h3>
              <ul className="flex flex-wrap gap-2">
                {profile.interests.map((t) => (
                  <li key={t} className="rounded-full border border-border px-3 py-1 text-sm">{t}</li>
                ))}
              </ul>
            </aside>
          </div>
        </Section>

        <Section id="skills" index="02" title="Skills">
          <div className="grid gap-16 md:grid-cols-2">
            <SkillList heading="Technical" items={profile.technicalSkills} />
            <SkillList heading="Personal" items={profile.personalSkills} />
          </div>
        </Section>

        {profile.projects.length > 0 && (
          <Section id="work" index="03" title="Work">
            <ul className="divide-y divide-border border-y border-border">
              {profile.projects.map((p) => (
                <li key={p.title} className="group py-8 transition-colors hover:bg-card">
                  <h3 className="font-display text-3xl font-bold group-hover:text-primary">
                    {p.href ? <a href={p.href} target="_blank" rel="noreferrer">{p.title} ↗</a> : p.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{p.description}</p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section id="contact" index={profile.projects.length ? "04" : "03"} title="Let's talk">
          <p className="max-w-xl text-lg text-muted-foreground">Have an idea, a question, or just want to say hi? My inbox is open.</p>
          <a
            href={`mailto:${profile.email}`}
            className="group mt-10 inline-block break-all font-display text-[clamp(1.6rem,5.5vw,4.5rem)] font-bold leading-tight tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary to-primary bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
              {profile.email}
            </span>
          </a>
          <ul className="mt-12 flex gap-6 font-mono text-sm uppercase tracking-widest">
            {profile.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-primary">{s.label} ↗</a>
              </li>
            ))}
          </ul>
        </Section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl justify-between px-5 py-8 font-mono text-xs text-muted-foreground sm:px-8">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>{profile.location}</span>
        </div>
      </footer>
    </>
  );
}

function Section({ id, index, title, children }: { id: string; index: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-14 border-t border-border">
      <div className="reveal mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="mb-14 flex items-baseline gap-4">
          <span className="font-mono text-sm text-primary">{index}</span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function SkillList({ heading, items }: { heading: string; items: { name: string; detail: string }[] }) {
  return (
    <div>
      <h3 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">{heading}</h3>
      <ul className="border-t border-border">
        {items.map((s) => (
          <li key={s.name} className="group border-b border-border py-5">
            <p className="font-display text-2xl font-bold transition-colors group-hover:text-primary">{s.name}</p>
            <p className="mt-1 text-muted-foreground">{s.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
