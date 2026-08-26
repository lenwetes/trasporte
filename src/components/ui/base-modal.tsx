"use client";
import * as React from "react";

interface BaseModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const BaseModal = ({ isOpen, onClose, children, title, ...props }: BaseModalProps) => {
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
        {children}
        <button 
          type="button"
          onClick={onClose}
          style={{ marginTop: "15px", padding: "8px 16px", cursor: "pointer" }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
