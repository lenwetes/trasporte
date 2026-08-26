"use client";
import * as React from "react";

export const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{
        backgroundColor: "#f1f5f9",
        borderRadius: "6px",
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        ...props.style
      }}
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";
