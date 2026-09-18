"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function useInView<T extends HTMLElement>(threshold = 0, rootMargin = "0px") {
  const ref = React.useRef<T>(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let done = false;
    let observer: IntersectionObserver | null = null;
    let timer = 0;
    const show = () => {
      if (done) return;
      done = true;
      setVisible(true);
      cleanup();
    };
    const inView = () => {
      const rect = node.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    };
    const onFallback = () => {
      if (inView()) show();
    };
    const cleanup = () => {
      observer?.disconnect();
      observer = null;
      window.removeEventListener("scroll", onFallback);
      window.removeEventListener("resize", onFallback);
      window.clearTimeout(timer);
    };
    if (inView()) {
      show();
      return cleanup;
    }
    if (typeof IntersectionObserver === "undefined") {
      show();
      return cleanup;
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) show();
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    window.addEventListener("scroll", onFallback, { passive: true });
    window.addEventListener("resize", onFallback);
    timer = window.setTimeout(onFallback, 800);
    return cleanup;
  }, [threshold, rootMargin]);
  return { ref, visible };
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, visible } = useInView<HTMLSpanElement>(0.4);
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("en-US")}{suffix}
    </span>
  );
}
