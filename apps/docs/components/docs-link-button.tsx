"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "frosted-ui";

export function DocsLinkButton({
  href,
  children,
  ...props
}: ButtonProps & { href: string }) {
  return (
    <Button {...props} render={<Link href={href} />}>
      {children}
    </Button>
  );
}
