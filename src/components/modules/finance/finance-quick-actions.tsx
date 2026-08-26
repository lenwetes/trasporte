"use client";

import Link from "next/link";
import { TransaccionWithAsientos } from "@/types/finance";

interface FinanceQuickActionsProps {
    movimientosHoy: TransaccionWithAsientos[];
}

export function FinanceQuickActions({
    movimientosHoy,
}: FinanceQuickActionsProps) {
    const handleExport = () => {
        if (movimientosHoy.length === 0) {
            alert("No hay movimientos hoy para exportar");
            return;
        }

        const headers = [
            "Fecha",
            "Tipo",
            "Descripción",
            "Monto",
            "Tercero",
            "Usuario",
        ];
        const rows = movimientosHoy.map((mov) => {
            const isIngreso = mov.tipo === "INGRESO";
            const monto = mov.asientos.reduce((acc: number, current) => {
                if (isIngreso) return acc + Number(current.debito);
                return acc + Number(current.credito);
            }, 0);

            return [
                new Date(mov.fecha).toLocaleString(),
                mov.tipo,
                mov.descripcion,
                monto,
                mov.tercero
                    ? `${mov.tercero.nombres} ${mov.tercero.apellidos || ""}`
                    : "General",
                mov.creadoPor.nombres,
            ];
        });

        const csvContent = [headers, ...rows]
            .map((e) => e.join(","))
            .join("\n");
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `movimientos_caja_${new Date().toISOString().split("T")[0]}.csv`,
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert("Movimientos exportados exitosamente");
    };

    const buttonStyle = {
        padding: "8px 16px",
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        color: "#0f172a"
    };

    return (
        <div style={{ display: "flex", gap: "10px" }}>
            <button
                style={buttonStyle}
                onClick={handleExport}
            >
                📥 Descargar Kárdex Diario
            </button>

            <Link href="/dashboard/finance/transactions" style={{ textDecoration: "none" }}>
                <button style={buttonStyle}>
                    📅 Consultar Histórico
                </button>
            </Link>
        </div>
    );
}
