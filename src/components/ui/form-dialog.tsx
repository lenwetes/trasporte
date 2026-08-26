"use client";
import * as React from "react";

interface FormDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  isLoading?: boolean;
  submitLabel?: string;
}

export const FormDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  children, 
  title, 
  isLoading, 
  submitLabel, 
  ...props 
}: FormDialogProps) => {
  if (!isOpen) return null;
  return (
    <div 
      role="dialog" 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        ...props.style
      }}
      {...props}
    >
      <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", maxWidth: "500px", width: "90%" }}>
        {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
        <form onSubmit={onSubmit}>
          {children}
          <div style={{ marginTop: "15px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={onClose} disabled={isLoading} style={{ padding: "8px 16px", cursor: "pointer" }}>
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} style={{ padding: "8px 16px", cursor: "pointer", backgroundColor: "#0f172a", color: "#fff", border: "none", borderRadius: "6px" }}>
              {submitLabel ?? 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
