import { LandingPage } from "@/components/landing-page";

function SiteRuler({ side }: { side: "left" | "right" }) {
  const spine = side === "left" ? "right-0" : "left-0";
  const strip = side === "left" ? "right-[1px]" : "left-[1px]";
  const dots = side === "left" ? "left-0" : "right-0";
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-y-0 z-0 hidden w-12 min-[1440px]:block ${side === "left" ? "left-5" : "right-5"}`}
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        opacity: 0.7,
      }}
    >
      <div className={`absolute inset-y-0 ${spine} w-px bg-border`} />
      <div
        className={`ruler-strip absolute inset-y-0 ${strip} h-[calc(100%+60px)] w-5`}
        style={{
          backgroundImage: [
            "repeating-linear-gradient(to bottom, transparent 0 59px, var(--border) 59px 60px)",
            "repeating-linear-gradient(to bottom, transparent 0 11px, var(--border) 11px 12px)",
          ].join(", "),
          backgroundSize: "16px 60px, 8px 60px",
          backgroundPosition: side === "left" ? "right top, right top" : "left top, left top",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className={`absolute inset-y-0 ${dots} w-4`}
        style={{
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1.6px)",
          backgroundSize: "12px 12px",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <SiteRuler side="left" />
      <SiteRuler side="right" />
      <LandingPage />
    </div>
  );
}
