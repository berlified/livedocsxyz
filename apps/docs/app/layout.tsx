import type { Metadata } from "next";

import { FrostThemeProvider } from "@/components/frost-theme-provider";
import { DocsShell } from "@/components/docs-shell";

import "frosted-ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FrostUI",
    template: "%s — FrostUI",
  },
  description:
    "Documentation for FrostUI — built on Whop Frosted UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <FrostThemeProvider>
          <DocsShell>{children}</DocsShell>
        </FrostThemeProvider>
      </body>
    </html>
  );
}
