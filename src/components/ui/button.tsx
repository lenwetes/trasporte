"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-primary/20 bg-background shadow-sm hover:bg-slate-50 hover:text-primary transition-all duration-300",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 transition-all duration-300",
        ghost: "hover:bg-slate-100 hover:text-primary transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-primary text-primary-foreground shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 active:translate-y-0 text-[10px] font-black uppercase tracking-[0.2em] rounded-none",
        "premium-outline": "border border-primary/20 bg-background text-primary shadow-sm hover:bg-slate-50 hover:shadow-premium transition-all duration-300 hover:-translate-y-1 active:translate-y-0 text-[10px] font-black uppercase tracking-[0.2em] rounded-none",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
