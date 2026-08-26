"use client";
import * as React from "react";

interface ExportExcelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: unknown[]; // Data for excel export is typically any array
  fileName?: string;
  label?: string;
}

export const ExportExcelButton = ({ data, fileName, label, ...props }: ExportExcelButtonProps) => (
  <button 
    type="button" 
    style={{
      padding: "8px 16px",
      backgroundColor: "#22c55e",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      ...props.style
    }}
    {...props}
  >
    {label ?? 'Exportar Excel'}
  </button>
);
