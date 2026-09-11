import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";

export default function ThemingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-3">
        <Badge variant="outline">Guides</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">Theming</h1>
        <p className="text-base leading-7 text-muted-foreground">
          FrostUI is dark-first. Toggle light mode by applying the{" "}
          <code className="text-foreground">.light</code> class on{" "}
          <code className="text-foreground">html</code> or use next-themes.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Live preview</CardTitle>
          <CardDescription>
            Semantic tokens drive every primitive below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Badge variant="outline">Badge</Badge>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">next-themes</h2>
        <CodeBlock
          language="tsx"
          code={`import { ThemeProvider } from "next-themes"

export function AppProviders({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}`}
        />
      </section>
    </div>
  );
}
