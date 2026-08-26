"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

import { UploadCloud, File as FileIcon, X, AlertCircle, Check } from "lucide-react";

interface FileUploadProps {
    label?: string;
    accept?: string[]; // e.g., ['image/png', 'application/pdf']
    maxSizeMB?: number;
    onFileSelect: (file: File | null) => void;
    error?: string;
}

export function FileUpload({
    label = "Subir documento",
    accept = ["image/jpeg", "image/png", "application/pdf"],
    maxSizeMB = 5,
    onFileSelect,
    error: externalError,
}: FileUploadProps) {
    const [file, setFile] = React.useState<File | null>(null);
    const [dragActive, setDragActive] = React.useState(false);
    const [internalError, setInternalError] = React.useState<string | null>(
        null,
    );
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (selectedFile: File): boolean => {
        // Validate Type
        if (accept.length > 0 && !accept.includes(selectedFile.type)) {
            setInternalError(
                `Tipo de archivo no permitido. Tipos aceptados: ${accept.join(", ")}`,
            );
            return false;
        }

        // Validate Size
        if (selectedFile.size > maxSizeMB * 1024 * 1024) {
            setInternalError(
                `El archivo excede el tamaño máximo de ${maxSizeMB}MB.`,
            );
            return false;
        }

        setInternalError(null);
        return true;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                onFileSelect(droppedFile);
            } else {
                setFile(null);
                onFileSelect(null);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                onFileSelect(selectedFile);
            } else {
                setFile(null);
                onFileSelect(null);
            }
        }
    };

    const removeFile = () => {
        setFile(null);
        onFileSelect(null);
        setInternalError(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const displayedError = externalError || internalError;

    return (
        <div style={{ marginBottom: "16px" }}>
            {label && (
                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>
                    {label}
                </label>
            )}

            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                    position: "relative",
                    border: `2px dashed ${dragActive ? "#10b981" : "#e2e8f0"}`,
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                    backgroundColor: dragActive ? "#f0fdf4" : "#f8fafc",
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer"
                }}
                onClick={() => !file && inputRef.current?.click()}
            >
                {!file ? (
                    <>
                        <input
                            ref={inputRef}
                            type="file"
                            accept={accept.join(",")}
                            onChange={handleChange}
                            style={{ display: "none" }}
                        />
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                            <div style={{ 
                                width: "48px", 
                                height: "48px", 
                                borderRadius: "50%", 
                                backgroundColor: "white", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                color: "#10b981",
                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
                            }}>
                                <UploadCloud size={24} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                                    Haz clic para subir o arrastra un archivo
                                </p>
                                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                                    {accept
                                        .map((t) => t.split("/")[1].toUpperCase())
                                        .join(", ")}{" "}
                                    (Max {maxSizeMB}MB)
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "white", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ 
                                width: "40px", 
                                height: "40px", 
                                borderRadius: "8px", 
                                backgroundColor: "#f1f5f9", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                color: "#475569"
                            }}>
                                <FileIcon size={20} />
                            </div>
                            <div style={{ textAlign: "left" }}>
                                <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1e293b", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {file.name}
                                </p>
                                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFile();
                            }}
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                border: "none",
                                backgroundColor: "#fef2f2",
                                color: "#ef4444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer"
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>

            {displayedError && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", color: "#dc2626", fontSize: "12px", fontWeight: "600" }}>
                    <AlertCircle size={14} />
                    {displayedError}
                </div>
            )}

            {!displayedError && file && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", color: "#059669", fontSize: "12px", fontWeight: "600" }}>
                    <Check size={14} />
                    Archivo listo para subir
                </div>
            )}
        </div>
    );
}
