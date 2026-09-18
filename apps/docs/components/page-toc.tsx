"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "preview", label: "Preview" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "props", label: "Props" },
  { id: "source", label: "Source" },
];

const LINE_RATIO = 0.35;

function comparePosition(a: Element, b: Element) {
  // eslint-disable-next-line no-bitwise
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

export function PageToc() {
  const pathname = usePathname();
  const [items, setItems] = React.useState(sections);
  const [active, setActive] = React.useState("overview");
  const [progress, setProgress] = React.useState(0);
  const elements = React.useRef<HTMLElement[]>([]);

  React.useEffect(() => {
    let frame = 0;
    const discover = () => {
      const found = sections
        .map((section) => document.getElementById(section.id))
        .filter(Boolean) as HTMLElement[];
      found.sort(comparePosition);
      elements.current = found;
      setItems(sections.filter((section) => found.some((element) => element.id === section.id)));
      pick();
    };
    const pick = () => {
      const list = elements.current;
      if (!list.length) return;
      const root = document.documentElement;
      let current = list[0]!;
      if (window.scrollY <= 8) {
        current = list[0]!;
      } else       if (window.scrollY + window.innerHeight >= root.scrollHeight - 40) {
        current = list[list.length - 1]!;
      } else {
        const line = window.innerHeight * LINE_RATIO;
        let best = Infinity;
        for (const element of list) {
          const top = element.getBoundingClientRect().top;
          const distance = top <= line ? line - top : (top - line) * 2;
          if (distance < best) {
            best = distance;
            current = element;
          }
        }
      }
      setActive((previous) => (previous === current.id ? previous : current.id));
    };
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          pick();
          const root = document.documentElement;
          const max = root.scrollHeight - root.clientHeight;
          setProgress(max > 0 ? Math.min(1, root.scrollTop / max) : 0);
        });
      }
    };
    const raf = requestAnimationFrame(discover);
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <div className="space-y-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        On this page
      </p>
      <div
        aria-hidden
        className="h-0.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-foreground transition-[width] duration-150 ease-out motion-reduce:transition-none"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <nav className="space-y-1" aria-label="Table of contents">
        {items.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            data-active={active === section.id}
            onClick={() => setActive(section.id)}
            className="toc-link"
          >
            {section.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
