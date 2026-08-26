"use client";

import React from "react";
import { FieldError } from "react-hook-form";

interface FormFieldProps {
    label: string;
    icon?: React.ReactNode;
    error?: FieldError;
    children: React.ReactNode;
    className?: string;
}

export function VehiculoFormField({
    label,
    icon,
    error,
    children,
    className = "",
}: FormFieldProps) {
    return (
        <div style={{ marginBottom: "15px" }} className={className}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "bold", color: "#475569", marginBottom: "6px" }}>
                {icon && <span style={{ fontSize: "14px" }}>{icon}</span>}
                {label}
            </label>
            <div style={{ position: "relative" }}>
                {children}
            </div>
            {error?.message && (
                <p style={{ margin: "5px 0 0 0", fontSize: "11px", color: "#ef4444", fontWeight: "bold" }}>
                    {error.message}
                </p>
            )}
        </div>
    );
}
