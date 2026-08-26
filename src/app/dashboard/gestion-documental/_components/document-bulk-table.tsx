"use client";

import React from "react";
import { useDocumentBrowser, FullFile } from "./document-bulk-table/use-document-browser";

export type { FullFile };

interface DocumentBulkTableProps {
    initialFiles: FullFile[];
}

export function DocumentBulkTable({ initialFiles }: DocumentBulkTableProps) {
    const {
        searchTerm,
        setSearchTerm,
        activeModule,
        setActiveModule,
        filteredDocs,
        stats,
    } = useDocumentBrowser(initialFiles);

    return (
        <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
            <h1>Gestión Documental</h1>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
                <div style={{ border: "1px solid #ddd", padding: "10px" }}>
                    <div style={{ fontSize: "12px", color: "#666" }}>Total Archivos</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>{stats.totalItems}</div>
                </div>
                <div style={{ border: "1px solid #ddd", padding: "10px" }}>
                    <div style={{ fontSize: "12px", color: "#666" }}>Vencidos</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "red" }}>{stats.vencidos}</div>
                </div>
                {/* ... more stats ... */}
            </div>

            <div style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center" }}>
                <select value={activeModule} onChange={(e) => setActiveModule(e.target.value)}>
                    <option value="ALL">Todo</option>
                    <option value="VEHICULO">Vehículos</option>
                    <option value="CONDUCTOR">Conductores</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="SINIESTRO">Siniestros</option>
                    <option value="FINANZAS">Finanzas</option>
                </select>
                <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ flex: 1, padding: "5px" }}
                />
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #eee" }}>
                <thead style={{ backgroundColor: "#f9f9f9" }}>
                    <tr>
                        <th style={{ border: "1px solid #eee", padding: "8px", textAlign: "left" }}>Entidad</th>
                        <th style={{ border: "1px solid #eee", padding: "8px", textAlign: "left" }}>Categoría</th>
                        <th style={{ border: "1px solid #eee", padding: "8px", textAlign: "left" }}>Vencimiento</th>
                        <th style={{ border: "1px solid #eee", padding: "8px", textAlign: "right" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDocs.map((doc) => (
                        <tr key={doc.id}>
                            <td style={{ border: "1px solid #eee", padding: "8px" }}>
                                <div>{doc.entidadNombre}</div>
                                <div style={{ fontSize: "10px", color: "#999" }}>{doc.entidadTipo}</div>
                            </td>
                            <td style={{ border: "1px solid #eee", padding: "8px" }}>
                                <div>{doc.categoriaLabel}</div>
                                <div style={{ fontSize: "10px", color: "#999" }}>{(doc.tamano / 1024 / 1024).toFixed(2)} MB</div>
                            </td>
                            <td style={{ border: "1px solid #eee", padding: "8px" }}>
                                {doc.vencimiento ? new Date(doc.vencimiento).toLocaleDateString() : "Permanente"}
                            </td>
                            <td style={{ border: "1px solid #eee", padding: "8px", textAlign: "right" }}>
                                <a href={`/api/files/${doc.original.nombreUnico}`} target="_blank" rel="noreferrer" style={{ fontSize: "12px" }}>Ver</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {filteredDocs.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                    No se encontraron documentos.
                </div>
            )}
        </div>
    );
}
