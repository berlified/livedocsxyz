import * as React from "react";

import { cn } from "@/lib/utils";

export function LivedocsLogo({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 37 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-6 w-auto shrink-0 text-foreground", className)}
      {...props}
    >
      <g fill="currentColor">
        <path d="m18.5002 22.9265 17.2647-9.9611-17.2647-9.9654-17.26515 9.9654z" />
        <path d="m17.265 25.0653-17.265-9.961v19.9303l17.265 9.9654z" />
        <path d="m19.7363 25.0652v19.9348l17.2646-9.9654v-19.9304z" opacity=".5" />
      </g>
    </svg>
  );
}
