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
import { formatCurrency } from "@/lib/utils";

// Registrar fuentes si es necesario, pero usaremos las estándar por ahora para evitar problemas de red
// O usar fuentes seguras del sistema

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 30,
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 2,
        borderBottomColor: "#0f172a",
        borderBottomStyle: "solid",
        paddingBottom: 10,
        marginBottom: 20,
    },
    logoContainer: {
        flexDirection: "row",
        gap: 10,
    },
    logoPlaceholder: {
        width: 40,
        height: 40,
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    empresaInfo: {
        flexDirection: "column",
    },
    empresaNombre: {
        fontSize: 14,
        fontWeight: "black",
        textTransform: "uppercase",
        color: "#0f172a",
    },
    empresaSub: {
        fontSize: 8,
        color: "#64748b",
        marginTop: 2,
    },
    headerRight: {
        alignItems: "flex-end",
    },
    badge: {
        backgroundColor: "#0f172a",
        color: "#FFFFFF",
        fontSize: 8,
        padding: "2 6",
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: 5,
    },
    loanId: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0f172a",
    },
    sectionTitle: {
        fontSize: 9,
        fontWeight: "bold",
        textTransform: "uppercase",
        color: "#94a3b8",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
        paddingBottom: 4,
        marginBottom: 10,
        letterSpacing: 1,
    },
    grid: {
        flexDirection: "row",
        gap: 20,
        marginBottom: 20,
    },
    infoBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#f1f5f9",
        padding: 10,
    },
    label: {
        fontSize: 7,
        fontWeight: "bold",
        color: "#94a3b8",
        textTransform: "uppercase",
        marginBottom: 2,
    },
    value: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#0f172a",
    },
    summaryBox: {
        width: "40%",
        borderWidth: 2,
        borderColor: "#0f172a",
        padding: 10,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    summaryTotal: {
        borderTopWidth: 2,
        borderTopColor: "#f8fafc",
        paddingTop: 5,
        marginTop: 5,
    },
    totalValue: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#10b981",
    },
    balanceBanner: {
        backgroundColor: "#0f172a",
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    balanceTitle: {
        color: "#34d399",
        fontSize: 8,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 2,
    },
    balanceSubtitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    balanceValue: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    statusBadge: {
        backgroundColor: "#10b981",
        color: "#0f172a",
        fontSize: 7,
        padding: "2 8",
        marginTop: 5,
        fontWeight: "bold",
    },
    table: {
        width: "auto",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f8fafc",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    tableCell: {
        padding: 6,
        fontSize: 8,
    },
    colRef: { width: "15%" },
    colDate: { width: "25%" },
    colCap: { width: "20%", textAlign: "right" },
    colInt: { width: "20%", textAlign: "right", color: "#10b981" },
    colTotal: { width: "20%", textAlign: "right", fontWeight: "bold", backgroundColor: "#f8fafc" },
    
    legalSection: {
        marginTop: 30,
        borderTopWidth: 2,
        borderTopColor: "#0f172a",
        paddingTop: 15,
    },
    legalGrid: {
        flexDirection: "row",
        gap: 30,
    },
    clause: {
        flexDirection: "row",
        gap: 5,
        marginBottom: 8,
    },
    clauseNum: {
        fontSize: 8,
        fontWeight: "bold",
        color: "#cbd5e1",
    },
    clauseText: {
        fontSize: 7,
        color: "#64748b",
        flex: 1,
        textTransform: "uppercase",
    },
    signatureContainer: {
        marginTop: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 50,
    },
    signatureLine: {
        flex: 1,
        borderTopWidth: 2,
        borderTopColor: "#0f172a",
        paddingTop: 5,
        alignItems: "center",
    },
    signatureName: {
        fontSize: 9,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    signatureRole: {
        fontSize: 7,
        color: "#94a3b8",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: "center",
        borderTopWidth: 1,
        borderTopColor: "#f1f5f9",
        paddingTop: 10,
    },
    footerText: {
        fontSize: 6,
        color: "#cbd5e1",
        textTransform: "uppercase",
        letterSpacing: 1,
    }
});

interface LoanPDFData {
    id: string;
    montoCapital: number;
    saldoActual: number;
    tasaMensual: number;
    numCuotas: number;
    tipo: string;
    estado: string;
    usuario?: { nombres: string; apellidos: string; numeroDocumento: string; telefono?: string | null };
    cuotas?: { id: string; numCuota: number; fechaVencimiento: string | Date; valorCapital: number; valorInteres: number; totalCuota: number }[];
}

interface EmpresaPDFData {
    nombre: string;
    nit: string;
    direccion: string;
    telefono: string;
    email: string;
    logo?: string | null;
}

interface LoanStatementPDFProps {
    loan: LoanPDFData;
    empresa: EmpresaPDFData;
}

export function LoanStatementPDF({ loan, empresa }: LoanStatementPDFProps) {
    const totalInteres = loan.cuotas?.reduce((acc: number, c) => acc + Number(c.valorInteres || 0), 0) || 0;
    const totalPagar = Number(loan.montoCapital || 0) + totalInteres;

    return (
        <Document title={`COOPETRAES_EXTRACTO_${loan.id}`}>
            {/* PAGINA 1: RESUMEN Y TABLA */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        {empresa.logo ? (
                            <Image src={empresa.logo} style={{ width: 60, objectFit: "contain" }} />
                        ) : (
                            <View style={styles.logoPlaceholder}><Text>CPT</Text></View>
                        )}
                        <View style={styles.empresaInfo}>
                            <Text style={styles.empresaNombre}>{empresa.nombre}</Text>
                            <Text style={styles.empresaSub}>NIT: {empresa.nit}</Text>
                            <Text style={styles.empresaSub}>{empresa.direccion}</Text>
                            <Text style={styles.empresaSub}>TEL: {empresa.telefono} — {empresa.email}</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <View style={styles.badge}><Text>EXTRACTO DE CARTERA</Text></View>
                        <Text style={styles.loanId}>#{loan.id.slice(-8).toUpperCase()}</Text>
                        <Text style={[styles.empresaSub, { marginTop: 5, fontWeight: "bold" }]}>EMISIÓN: {new Date().toLocaleDateString()}</Text>
                    </View>
                </View>

                <View style={styles.grid}>
                    <View style={styles.infoBox}>
                        <Text style={styles.sectionTitle}>01. Datos del Titular</Text>
                        <Text style={styles.label}>Nombre Completo / Razón Social</Text>
                        <Text style={[styles.value, { marginBottom: 8 }]}>{loan.usuario?.nombres} {loan.usuario?.apellidos}</Text>
                        
                        <View style={{ flexDirection: "row", gap: 20 }}>
                            <View>
                                <Text style={styles.label}>Documento</Text>
                                <Text style={styles.value}>{loan.usuario?.numeroDocumento || "—"}</Text>
                            </View>
                            <View>
                                <Text style={styles.label}>Teléfono</Text>
                                <Text style={styles.value}>{loan.usuario?.telefono || "—"}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.summaryBox}>
                        <Text style={[styles.sectionTitle, { color: "#0f172a" }]}>02. Resumen Económico</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.label}>Capital Inicial</Text>
                            <Text style={styles.value}>{formatCurrency(Number(loan.montoCapital))}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.label}>Tasa Pactada</Text>
                            <Text style={styles.value}>{(Number(loan.tasaMensual) * 100).toFixed(2)}%</Text>
                        </View>
                        <View style={[styles.summaryRow, styles.summaryTotal]}>
                            <Text style={[styles.label, { color: "#0f172a" }]}>Proyectado</Text>
                            <Text style={styles.totalValue}>{formatCurrency(totalPagar)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.balanceBanner}>
                    <View>
                        <Text style={styles.balanceTitle}>Estado de Cartera</Text>
                        <Text style={styles.balanceSubtitle}>Saldo Vigente ERP</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.balanceValue}>{formatCurrency(Number(loan.saldoActual))}</Text>
                        <Text style={styles.statusBadge}>SITUACIÓN: {loan.estado.replace("_", " ").toUpperCase()}</Text>
                    </View>
                </View>

                <View style={{ marginBottom: 10 }}>
                    <Text style={[styles.sectionTitle, { color: "#0f172a", marginBottom: 5 }]}>03. Cronograma de Pagos</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableCell, styles.colRef, { fontWeight: "bold", color: "#94a3b8" }]}>REF</Text>
                            <Text style={[styles.tableCell, styles.colDate, { fontWeight: "bold" }]}>VENCIMIENTO</Text>
                            <Text style={[styles.tableCell, styles.colCap, { fontWeight: "bold" }]}>CAPITAL</Text>
                            <Text style={[styles.tableCell, styles.colInt, { fontWeight: "bold" }]}>INTERÉS</Text>
                            <Text style={[styles.tableCell, styles.colTotal, { fontWeight: "bold" }]}>TOTAL</Text>
                        </View>
                        {loan.cuotas?.map((c) => (
                            <View key={c.id} style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.colRef]}>SEC-{String(c.numCuota).padStart(3, '0')}</Text>
                                <Text style={[styles.tableCell, styles.colDate]}>{new Date(c.fechaVencimiento).toLocaleDateString()}</Text>
                                <Text style={[styles.tableCell, styles.colCap]}>{formatCurrency(Number(c.valorCapital))}</Text>
                                <Text style={[styles.tableCell, styles.colInt]}>{formatCurrency(Number(c.valorInteres))}</Text>
                                <Text style={[styles.tableCell, styles.colTotal]}>{formatCurrency(Number(c.totalCuota))}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Generado Electrónicamente — Página 1 de 2 — ID: {loan.id.toUpperCase()}</Text>
                </View>
            </Page>

            {/* PAGINA 2: CLAUSULAS Y FIRMAS */}
            <Page size="A4" style={styles.page}>
                <View style={[styles.header, { borderBottomWidth: 1, borderBottomStyle: "dashed" }]}>
                   <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                        <View style={[styles.logoPlaceholder, { width: 30, height: 30 }]}><Text>CPT</Text></View>
                        <Text style={{ fontSize: 10, fontWeight: "bold", textTransform: "uppercase" }}>Anexo Contractual Mutuo Comercial</Text>
                   </View>
                   <Text style={{ fontSize: 8, color: "#94a3b8" }}>Ref: #{loan.id.slice(-8).toUpperCase()}</Text>
                </View>

                <View style={{ flexDirection: "row", gap: 30, marginBottom: 40 }}>
                    <View style={{ flex: 1, gap: 15 }}>
                        <View>
                            <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 3 }}>Claúsula 1: Objeto y Monto</Text>
                            <Text style={styles.clauseText}>LA EMPRESA entrega al MUTUARIO la suma de {formatCurrency(Number(loan.montoCapital))}, la cual el MUTUARIO declara haber recibido a entera satisfacción para libre inversión.</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 3 }}>Claúsula 2: Intereses</Text>
                            <Text style={styles.clauseText}>Las partes pactan un interés del {(Number(loan.tasaMensual) * 100).toFixed(2)}% mensual sobre saldos. El interés de mora será el máximo legal permitido.</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, gap: 15 }}>
                        <View>
                            <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 3 }}>Claúsula 4: Mérito Ejecutivo</Text>
                            <Text style={styles.clauseText}>El presente documento presta mérito ejecutivo sin necesidad de requerimiento privado ni judicial para la constitución en mora.</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 3 }}>Claúsula 5: Aceleración</Text>
                            <Text style={styles.clauseText}>EL MUTUANTE podrá declarar vencido el plazo de la obligación y exigir el pago total si el MUTUARIO incumple el pago de una sola cuota.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.signatureContainer}>
                    <View style={styles.signatureLine}>
                        <Text style={styles.signatureName}>REPRESENTANTE LEGAL COOPETRAES</Text>
                        <Text style={styles.signatureRole}>Mutuante</Text>
                    </View>
                    <View style={styles.signatureLine}>
                        <Text style={styles.signatureName}>{loan.usuario?.nombres} {loan.usuario?.apellidos}</Text>
                        <Text style={styles.signatureRole}>Mutuario (C.C. {loan.usuario?.numeroDocumento})</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Generado Electrónicamente — Página 2 de 2 — ID: {loan.id.toUpperCase()}</Text>
                </View>
            </Page>
        </Document>
    );
}
