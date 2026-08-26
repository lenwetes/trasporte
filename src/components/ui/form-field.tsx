"use client";
import * as React from "react";

/**
 * FormField (Wrapper Legacy)
 * Este componente es una versión simplificada y de "Pure HTML" que admite
 * etiquetas, iconos y mensajes de error de forma directa.
 */

// Usamos una unión de tipos para permitir props de input o textarea de forma segura
export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  rows?: number; // Añadido explícitamente para soportar textareas
}

export const FormField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, icon, error, className, style, rows, ...props }, ref) => {
    const isTextarea = rows !== undefined || props.type === "textarea";
    const Comp = (isTextarea ? "textarea" : "input") as React.ElementType;

    return (
      <div style={{ marginBottom: "15px", width: "100%" }}>
        {label && (
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: 500, color: "#475569" }}>
            {label}
          </label>
        )}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          {icon && React.isValidElement(icon) && (
            <div style={{ position: "absolute", left: "12px", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 16 })}
            </div>
          )}
          <Comp
            ref={ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
            rows={rows}
            style={{
              width: "100%",
              padding: "8px 12px",
              paddingLeft: icon ? "35px" : "12px",
              borderRadius: "8px",
              border: `1px solid ${error ? '#ef4444' : '#e2e8f0'}`,
              fontSize: "14px",
              backgroundColor: "#fff",
              outline: "none",
              transition: "border-color 0.2s",
              minHeight: isTextarea ? "80px" : "auto",
              ...style
            }}
            {...props}
          />
        </div>
        {error && (
          <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px", margin: 0 }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
