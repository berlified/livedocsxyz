import { LandingPage } from "@/components/landing-page";

function Ruler({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-y-0 z-0 hidden w-10 min-[1440px]:block ${side === "left" ? "left-5" : "right-5"}`}
      style={{
        backgroundImage: [
          "repeating-linear-gradient(to bottom, transparent 0 59px, var(--border) 59px 60px)",
          "repeating-linear-gradient(to bottom, transparent 0 11px, var(--border) 11px 12px)",
          "radial-gradient(circle, var(--border) 1px, transparent 1.6px)",
        ].join(", "),
        backgroundSize: `16px 100%, 9px 100%, 14px 14px`,
        backgroundPosition: side === "left" ? "right top, right top, left top" : "left top, left top, right top",
        backgroundRepeat: "no-repeat, no-repeat, repeat",
        maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        opacity: 0.7,
      }}
    />
  );
}

export default function HomePage() {
  return (
    <div className="relative mx-auto max-w-6xl">
      <Ruler side="left" />
      <Ruler side="right" />
      <LandingPage />
    </div>
  );
}
