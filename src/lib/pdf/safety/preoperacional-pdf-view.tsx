"use client";

import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { PreoperacionalPDFData } from "./types";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: "Helvetica",
        fontSize: 9,
        color: "#1e293b",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: "2pt solid #10b981",
        paddingBottom: 10,
        marginBottom: 15,
    },
    logo: {
        width: 120,
        height: "auto",
        objectFit: "contain",
    },
    companyInfo: {
        textAlign: "right",
    },
    companyName: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#0f172a",
    },
    textMuted: {
        fontSize: 7,
        color: "#64748b",
        marginTop: 2,
    },
    titleSection: {
        textAlign: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#0f172a",
        marginBottom: 5,
    },
    reportId: {
        fontSize: 8,
        color: "#94a3b8",
    },
    infoGrid: {
        flexDirection: "row",
        backgroundColor: "#f8fafc",
        padding: 10,
        borderRadius: 4,
        marginBottom: 20,
    },
    infoCol: {
        flex: 1,
    },
    label: {
        fontSize: 7,
        fontWeight: "bold",
        color: "#64748b",
        textTransform: "uppercase",
        marginBottom: 2,
    },
    value: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#1e293b",
        marginBottom: 5,
    },
    resultBadge: {
        fontSize: 10,
        fontWeight: "bold",
        marginTop: 5,
    },
    table: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#10b981",
        color: "white",
        fontWeight: "bold",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    tableCell: {
        padding: 5,
        fontSize: 8,
    },
    colItem: { width: "45%" },
    colCrit: { width: "15%", textAlign: "center" },
    colStatus: { width: "15%", textAlign: "center" },
    colObs: { width: "25%" },
    
    obsSection: {
        marginTop: 15,
        padding: 10,
        backgroundColor: "#fff7ed",
        borderLeft: "3pt solid #f97316",
    },
    signatureContainer: {
        marginTop: 40,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    signatureBox: {
        width: "45%",
        borderTop: "1pt solid #e2e8f0",
        paddingTop: 5,
        alignItems: "center",
    },
    signatureImage: {
        width: 100,
        height: 40,
        marginBottom: 5,
        objectFit: "contain",
    },
    footer: {
        position: "absolute",
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: "center",
        fontSize: 7,
        color: "#94a3b8",
        borderTop: "1pt solid #f1f5f9",
        paddingTop: 5,
    }
});

export function PreoperacionalPDFView({ data }: { data: PreoperacionalPDFData }) {
    const primaryColor = data.config?.colorPrimario || "#10b981";
    const companyName = data.config?.nombreEmpresa || "COOPETRAES";
    const logoUrl = data.config?.logoUrl || "/logo-empresa.png";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: primaryColor }]}>
                    <Image src={logoUrl} style={styles.logo} />
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>{companyName}</Text>
                        <Text style={styles.textMuted}>NIT: 823.003.742-5</Text>
                        <Text style={styles.textMuted}>{data.config?.direccion || "Sede Principal"}</Text>
                        <Text style={styles.textMuted}>{data.config?.telefono || ""} | {data.config?.email || ""}</Text>
                    </View>
                </View>

                {/* Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>INSPECCIÓN PREOPERACIONAL DIARIA</Text>
                    <Text style={styles.reportId}>Reporte ID: {data.id.substring(0, 8).toUpperCase()}</Text>
                    <Text style={[styles.reportId, { marginTop: 2 }]}>
                        Fecha: {format(new Date(data.fecha), "PPP", { locale: es })}
                    </Text>
                </View>

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoCol}>
                        <Text style={styles.label}>Vehículo</Text>
                        <Text style={styles.value}>{data.vehiculo.marca} {data.vehiculo.modelo} ({data.vehiculo.placa.toUpperCase()})</Text>
                        <Text style={styles.label}>Kilometraje</Text>
                        <Text style={styles.value}>{data.kilometraje.toLocaleString()} KM</Text>
                    </View>
                    <View style={styles.infoCol}>
                        <Text style={styles.label}>Conductor</Text>
                        <Text style={styles.value}>{data.conductor.nombres} {data.conductor.apellidos}</Text>
                        <Text style={styles.label}>Resultado General</Text>
                        <Text style={[
                            styles.resultBadge, 
                            { color: data.resultado === "APROBADO" ? "#16a34a" : "#dc2626" }
                        ]}>
                            {data.resultado}
                        </Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={[styles.tableHeader, { backgroundColor: primaryColor }]}>
                        <Text style={[styles.tableCell, styles.colItem]}>ÍTEM DE INSPECCIÓN</Text>
                        <Text style={[styles.tableCell, styles.colCrit]}>CRITICIDAD</Text>
                        <Text style={[styles.tableCell, styles.colStatus]}>ESTADO</Text>
                        <Text style={[styles.tableCell, styles.colObs]}>OBSERVACIONES</Text>
                    </View>
                    {data.detalles.map((d, i) => (
                        <View key={i} style={styles.tableRow} wrap={false}>
                            <Text style={[styles.tableCell, styles.colItem]}>{d.item}</Text>
                            <Text style={[styles.tableCell, styles.colCrit]}>{d.criticidad}</Text>
                            <Text style={[
                                styles.tableCell, 
                                styles.colStatus,
                                { fontWeight: "bold", color: d.estado ? "#16a34a" : "#dc2626" }
                            ]}>
                                {d.estado ? "✓ PASA" : "✗ FALLA"}
                            </Text>
                            <Text style={[styles.tableCell, styles.colObs]}>{d.observacion || "-"}</Text>
                        </View>
                    ))}
                </View>

                {/* Observations */}
                {data.observaciones && (
                    <View style={styles.obsSection}>
                        <Text style={styles.label}>Observaciones Generales:</Text>
                        <Text style={{ fontSize: 8, color: "#475569", marginTop: 2 }}>{data.observaciones}</Text>
                    </View>
                )}

                {/* Signatures */}
                <View style={styles.signatureContainer}>
                    <View style={styles.signatureBox}>
                        {data.firmaDigital && (
                            <Image src={data.firmaDigital} style={styles.signatureImage} />
                        )}
                        <Text style={{ fontSize: 8, fontWeight: "bold" }}>____________________________</Text>
                        <Text style={{ fontSize: 7, marginTop: 2 }}>FIRMA DEL CONDUCTOR</Text>
                        <Text style={styles.textMuted}>C.C. {data.conductor.numeroDocumento}</Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <View style={{ height: 40 }} />
                        <Text style={{ fontSize: 8, fontWeight: "bold" }}>____________________________</Text>
                        <Text style={{ fontSize: 7, marginTop: 2 }}>REVISIÓN CONTROL INTERNO</Text>
                        <Text style={styles.textMuted}>Sello y Fecha de Validación</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text>Este documento es una constancia digital oficial. Página 1 de 1. Generado por SGIT Coopetraes.</Text>
                </View>
            </Page>
        </Document>
    );
}
