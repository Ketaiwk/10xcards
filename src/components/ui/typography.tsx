import * as React from "react";
import { cn } from "@/lib/utils";

type TypographyVariant =
  | "display01"
  | "display02"
  | "display03"
  | "display04"
  | "heading01"
  | "heading02"
  | "heading03"
  | "heading04"
  | "body01"
  | "body02"
  | "helper"
  | "label01"
  | "label02";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant: TypographyVariant;
  as?: keyof JSX.IntrinsicElements;
}

const variantStyles: Record<TypographyVariant, string> = {
  // Display styles
  display01: "text-7xl font-light tracking-tight",
  display02: "text-6xl font-light tracking-tight",
  display03: "text-5xl font-light tracking-tight",
  display04: "text-4xl font-light tracking-tight",

  // Heading styles
  heading01: "text-3xl font-semibold tracking-tight",
  heading02: "text-2xl font-semibold tracking-tight",
  heading03: "text-xl font-semibold tracking-tight",
  heading04: "text-lg font-semibold tracking-tight",

  // Body styles
  body01: "text-base leading-normal",
  body02: "text-sm leading-normal",

  // Helper text
  helper: "text-xs leading-normal text-gray-600",

  // Label styles
  label01: "text-sm font-medium",
  label02: "text-xs font-medium",
};

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant, as, className, children, ...props }, ref) => {
    const Component = as || defaultElementForVariant(variant);

    return React.createElement(
      Component,
      {
        ref,
        className: cn(variantStyles[variant], className),
        ...props,
      },
      children
    );
  }
);

function defaultElementForVariant(variant: TypographyVariant): keyof JSX.IntrinsicElements {
  if (variant.startsWith("display") || variant.startsWith("heading")) {
    const level = variant.slice(-2);
    return `h${level}` as keyof JSX.IntrinsicElements;
  }

  if (variant.startsWith("label")) {
    return "label";
  }

  return "p";
}

Typography.displayName = "Typography";

export { Typography };
export type { TypographyVariant, TypographyProps };
