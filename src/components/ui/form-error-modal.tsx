"use client";
import * as React from "react";

interface FormErrorModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  errors?: unknown; // errors can be complex objects from form libraries
}

export const FormErrorModal = ({ isOpen, onClose, errors, ...props }: FormErrorModalProps) => {
  if (!isOpen) return null;
  return (
    <div 
      role="dialog" 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        ...props.style
      }}
      {...props}
    >
      <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", maxWidth: "400px", width: "90%", textAlign: "center" }}>
        <h3 style={{ color: "#ef4444" }}>Error en formulario</h3>
        <p style={{ fontSize: "14px", color: "#64748b" }}>Por favor verifique los datos ingresados.</p>
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
