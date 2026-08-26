"use client";
import * as React from "react";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const FormSelect = ({ label, children, error, ...props }: FormSelectProps) => (
  <div style={{ marginBottom: "15px" }}>
    {label && <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: 500 }}>{label}</label>}
    <select 
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: "6px",
        border: `1px solid ${error ? '#ef4444' : '#e2e8f0'}`,
        backgroundColor: "#fff",
        fontSize: "14px"
      }}
      {...props}
    >
      {children}
    </select>
    {error && <span style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", display: "block" }}>{error}</span>}
  </div>
);
