"use client";
import * as React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "warning" | "success";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", style, ...props }, ref) => {
    const variantStyles: Record<string, React.CSSProperties> = {
      default: { backgroundColor: "#fff", borderColor: "#e2e8f0", color: "#0f172a" },
      destructive: { backgroundColor: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" },
      warning: { backgroundColor: "#fffbeb", borderColor: "#fef3c7", color: "#92400e" },
      success: { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0", color: "#166534" },
    };

    const currentStyle = variantStyles[variant] || variantStyles.default;

    return (
      <div 
        role="alert" 
        ref={ref} 
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid",
          padding: "16px",
          ...currentStyle,
          ...style
        }}
        {...props} 
      />
    );
  }
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, style, ...props }, ref) => (
    <h5 
      ref={ref} 
      style={{
        marginBottom: "4px",
        fontWeight: 600,
        lineHeight: "1",
        letterSpacing: "-0.025em",
        ...style
      }}
      {...props} 
    />
  )
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div 
      ref={ref} 
      style={{
        fontSize: "14px",
        opacity: 0.9,
        ...style
      }}
      {...props} 
    />
  )
);
AlertDescription.displayName = "AlertDescription";
