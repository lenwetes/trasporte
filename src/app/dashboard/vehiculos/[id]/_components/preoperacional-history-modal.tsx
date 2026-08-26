"use client";

import { PreoperacionalHistory } from "./preoperacional-history";
import { PreoperacionalWithRelations } from "@/types";

interface PreoperacionalHistoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehiculoId: string;
    preoperacionales: PreoperacionalWithRelations[];
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
};

const panelStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    width: "100%",
    maxWidth: "700px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
};

export function PreoperacionalHistoryModal({
    open,
    onOpenChange,
    preoperacionales,
}: PreoperacionalHistoryModalProps) {
    if (!open) return null;

    return (
        <div style={overlayStyle} onClick={() => onOpenChange(false)}>
            <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
                            📋 Historial Preoperacional
                        </h2>
                        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                            Registro de chequeos preoperacionales asociados a este vehículo
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        style={{
                            padding: "6px 12px",
                            backgroundColor: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                            color: "#475569",
                        }}
                    >
                        ✕
                    </button>
                </div>
                <PreoperacionalHistory preoperacionales={preoperacionales} />
            </div>
        </div>
    );
}
