import { LandingPage } from "@/components/landing-page";

const STRIP_STYLE = {
  backgroundImage: [
    "repeating-linear-gradient(to bottom, transparent 0 59px, var(--border) 59px 60px)",
    "repeating-linear-gradient(to bottom, transparent 0 11px, var(--border) 11px 12px)",
    "radial-gradient(circle, var(--border) 1px, transparent 1.6px)",
  ].join(", "),
  backgroundSize: "16px 60px, 9px 60px, 12px 12px",
  backgroundRepeat: "repeat",
} as const;

function Ruler({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-y-0 z-0 hidden w-10 overflow-hidden min-[1440px]:block ${side === "left" ? "left-5" : "right-5"}`}
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        opacity: 0.7,
      }}
    >
      <div
        className="ruler-strip h-[calc(100%+60px)] w-full"
        style={{
          ...STRIP_STYLE,
          backgroundPosition: side === "left" ? "right top, right top, left top" : "left top, left top, right top",
        }}
      />
    </div>
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
