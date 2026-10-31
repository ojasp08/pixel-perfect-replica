import { useEffect } from "react";
import { profile } from "@/data/profile";

export function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(onDone, reduce ? 0 : 2200);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onDone();
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, [onDone]);

  return (
    <div className="intro-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background" aria-hidden="false" role="presentation">
      <svg viewBox="0 0 200 100" className="w-40 sm:w-52" aria-hidden="true">
        <text x="100" y="78" textAnchor="middle" className="intro-initials font-display" fontSize="84" fontWeight="800">
          {profile.initials}
        </text>
      </svg>
      <p className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-4xl" aria-label={profile.name}>
        {profile.name.split("").map((c, i) => (
          <span key={i} className="intro-letter" style={{ animationDelay: `${0.55 + i * 0.04}s` }} aria-hidden="true">
            {c === " " ? "\u00A0" : c}
          </span>
        ))}
      </p>
      <div className="intro-line absolute left-0 top-1/2 h-px w-full bg-primary" />
      <button
        onClick={onDone}
        className="absolute bottom-8 right-8 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
      >
        Skip intro →
      </button>
    </div>
  );
}
