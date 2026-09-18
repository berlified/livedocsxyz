import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { WhopDashboard } from "@/components/whop-dashboard";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl">
      <section aria-labelledby="dashboard-title" className="py-10 sm:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Less noise. More signal.</p>
            <h1 id="dashboard-title" className="text-2xl font-medium tracking-tight sm:text-3xl">A dashboard worth opening.</h1>
          </div>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            A Whop-style overview built entirely from livedocs charts. Hover anything.
          </p>
        </div>
        <WhopDashboard />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Line charts, tooltips, and the payments breakdown are live registry components.</p>
          <Link href="/docs/components" className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground no-underline transition-colors hover:text-foreground">
            Explore the charts <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
