"use client";
import * as React from "react";

interface MinimalStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
}

export const MinimalStatCard = ({ label, value, ...props }: MinimalStatCardProps) => (
  <div {...props} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", ...props.style }}>
    <span style={{ fontSize: "12px", color: "#64748b" }}>{label}: </span>
    <span style={{ fontWeight: "bold" }}>{value}</span>
  </div>
);
