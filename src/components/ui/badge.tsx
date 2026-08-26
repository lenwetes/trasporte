"use client";
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className, style, ...props }, ref) => {
    const variantStyles: Record<string, React.CSSProperties> = {
      default: { backgroundColor: "#0f172a", color: "#fff", border: "none" },
      secondary: { backgroundColor: "#f8fafc", color: "#0f172a", border: "1px solid #e2e8f0" },
      destructive: { backgroundColor: "#dc2626", color: "#fff", border: "none" },
      outline: { backgroundColor: "transparent", border: "1px solid #0f172a", color: "#0f172a" },
      success: { backgroundColor: "#059669", color: "#fff", border: "none" },
    };

    const currentStyle = variantStyles[variant] || variantStyles.default;

    return (
      <span
        ref={ref}
        style={{
          display: "inline-flex",
          alignItems: "center",
          borderRadius: "9999px",
          padding: "2px 10px",
          fontSize: "12px",
          fontWeight: 600,
          ...currentStyle,
          ...style
        }}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
