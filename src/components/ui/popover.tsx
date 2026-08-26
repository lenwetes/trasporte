"use client";
import * as React from "react";

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Popover = ({ children, open, onOpenChange }: PopoverProps) => {
  return <>{children}</>;
};

export const PopoverTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }>(
  ({ className, asChild, ...props }, ref) => (
    <div ref={ref} style={{ display: "inline-flex", cursor: "pointer" }} {...props} />
  )
);
PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { align?: string; sideOffset?: number; asChild?: boolean }>(
  ({ align, sideOffset, asChild, className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={className}
      style={{
        zIndex: 50,
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#fff",
        padding: "16px",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        ...props.style
      }}
      {...props} 
    />
  )
);
PopoverContent.displayName = "PopoverContent";
