"use client";
import * as React from "react";

interface ConfirmDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
  variant?: "destructive" | "warning" | "default";
}

export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading, 
  title, 
  description, 
  variant = "destructive",
  ...props 
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const confirmBtnStyles: Record<string, React.CSSProperties> = {
    destructive: { backgroundColor: "#ef4444", color: "#fff" },
    warning: { backgroundColor: "#f59e0b", color: "#fff" },
    default: { backgroundColor: "#2563eb", color: "#fff" },
  };

  const currentBtnStyle = confirmBtnStyles[variant] || confirmBtnStyles.destructive;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "8px",
        maxWidth: "400px",
        width: "90%",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        ...props.style
      }} {...props}>
        {title && <h2 style={{ marginTop: 0, fontSize: "18px", fontWeight: "bold", color: variant === "destructive" ? "#ef4444" : "#0f172a" }}>{title}</h2>}
        {description && <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>{description}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button 
            type="button"
            onClick={onClose} 
            disabled={loading}
            style={{ padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: "6px", backgroundColor: "#fff", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={onConfirm} 
            disabled={loading}
            style={{ 
              padding: "8px 16px", 
              border: "none", 
              borderRadius: "6px", 
              fontWeight: "bold", 
              cursor: "pointer",
              ...currentBtnStyle
            }}
          >
            {loading ? 'Cargando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};
