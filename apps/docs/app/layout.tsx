import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { DocsShell } from "@/components/docs-shell";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "livedocs: Beautiful charts. Built for your product.",
    template: "%s — livedocs",
  },
  description: "Modern, composable React charts for dashboards and data-rich products. Install with shadcn. Make them yours.",
  metadataBase: new URL("https://www.livedocs.xyz"),

  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },

  openGraph: {
    type: "website",
    url: "https://www.livedocs.xyz",
    title: "livedocs: Beautiful charts. Built for your product.",
    description: "Modern, composable React charts for dashboards and data-rich products. Install with shadcn. Make them yours.",
    images: [
      {
        url: "/livedocs.png",
        width: 1200,
        height: 630,
        alt: "livedocs — Beautiful charts. Built for your product.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "livedocs: Beautiful charts. Built for your product.",
    description: "Modern, composable React charts for dashboards and data-rich products. Install with shadcn. Make them yours.",
    images: ["/livedocs.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geist.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <ThemeProvider>
          <DocsShell>{children}</DocsShell>
        </ThemeProvider>
      </body>
    </html>
  );
}