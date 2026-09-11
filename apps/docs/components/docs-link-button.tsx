import Link from "next/link";

import { Button, type ButtonProps } from "@/components/ui/button";

export function DocsLinkButton({
  href,
  children,
  variant = "default",
  ...props
}: ButtonProps & { href: string }) {
  return (
    <Button variant={variant} asChild {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
