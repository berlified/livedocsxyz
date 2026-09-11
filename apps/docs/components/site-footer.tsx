import { Github } from "lucide-react";

import { LivedocsLogo } from "@/components/livedocs-logo";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function BuiltBy({ className }: { className?: string }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      Built by{" "}
      <a
        href={SITE.x}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        @{SITE.handle}
      </a>
    </p>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div className="flex items-center gap-2.5">
          <LivedocsLogo className="h-5" />
          <span className="text-sm font-medium">livedocs</span>
        </div>
        <BuiltBy />
        <a
          href={SITE.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground"
        >
          <Github className="size-3.5" />
          GitHub
        </a>
      </div>
    </footer>
  );
}
