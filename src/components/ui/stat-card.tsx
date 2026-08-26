"use client";
import * as React from "react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ label, value, icon, color, className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={className}
      style={{
        padding: "20px",
        borderRadius: "0px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        ...props.style
      }}
      {...props}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "#64748b" }}>{label}</span>
        {icon && <div style={{ color: color || "#0f172a" }}>{icon}</div>}
      </div>
      <span style={{ fontSize: "24px", fontWeight: 700 }}>{value}</span>
    </div>
  )
);
StatCard.displayName = "StatCard";
