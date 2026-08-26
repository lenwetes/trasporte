"use client";

interface Asiento {
    cuentaId: string;
    debito: number;
    credito: number;
}

interface AdvancedModeProps {
    asientos: Asiento[];
    metadata: {
        cuentas: { id: string; codigo: string; nombre: string }[];
    } | null;
    handleAddAsiento: () => void;
    handleRemoveAsiento: (index: number) => void;
    updateAsiento: (
        index: number,
        field: string,
        value: string | number,
    ) => void;
}

/**
 * Modo avanzado: tabla de asientos contables PUC con partida doble manual.
 * REFACTORIZADO A SKELETON HTML
 */
export function TransactionAdvancedMode({
    asientos,
    metadata,
    handleAddAsiento,
    handleRemoveAsiento,
    updateAsiento,
}: AdvancedModeProps) {
    return (
        <div style={{ display: "grid", gap: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                <h4 style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                    Detalle Técnico de Asientos PUC
                </h4>
                <button
                    type="button"
                    style={{ padding: "5px 12px", fontSize: "11px", fontWeight: "bold", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", cursor: "pointer" }}
                    onClick={handleAddAsiento}
                >
                    + Añadir Fila
                </button>
            </div>

            <div style={{ overflowX: "auto", border: "1px solid #f1f5f9", borderRadius: "8px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead style={{ backgroundColor: "#f8fafc" }}>
                        <tr>
                            <th style={{ padding: "10px", textAlign: "left", color: "#64748b" }}>Cuenta PUC</th>
                            <th style={{ padding: "10px", textAlign: "right", color: "#64748b", width: "120px" }}>Débito ($)</th>
                            <th style={{ padding: "10px", textAlign: "right", color: "#64748b", width: "120px" }}>Crédito ($)</th>
                            <th style={{ padding: "10px", width: "40px" }}></th>
                        </tr>
                    </thead>
                    <tbody style={{ backgroundColor: "#fff" }}>
                        {asientos.map((as, index) => (
                            <tr key={index} style={{ borderTop: "1px solid #f8fafc" }}>
                                <td style={{ padding: "10px" }}>
                                    <select
                                        style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "12px" }}
                                        value={as.cuentaId}
                                        onChange={(e) => updateAsiento(index, "cuentaId", e.target.value)}
                                    >
                                        <option value="">Seleccionar cuenta...</option>
                                        {metadata?.cuentas.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                [{c.codigo}] {c.nombre?.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td style={{ padding: "10px" }}>
                                    <input
                                        type="number"
                                        style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", textAlign: "right", fontWeight: "bold" }}
                                        value={String(as.debito || "")}
                                        onChange={(e) => updateAsiento(index, "debito", Number(e.target.value))}
                                    />
                                </td>
                                <td style={{ padding: "10px" }}>
                                    <input
                                        type="number"
                                        style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px", textAlign: "right", fontWeight: "bold" }}
                                        value={String(as.credito || "")}
                                        onChange={(e) => updateAsiento(index, "credito", Number(e.target.value))}
                                    />
                                </td>
                                <td style={{ padding: "10px", textAlign: "center" }}>
                                    <button
                                        type="button"
                                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px" }}
                                        onClick={() => handleRemoveAsiento(index)}
                                        disabled={asientos.length <= 2}
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
