"use client";

import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import { formatCurrency } from "@/lib/utils";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 9,
        color: "#1e293b",
        backgroundColor: "#ffffff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: "2pt solid #0f172a",
        paddingBottom: 15,
        marginBottom: 20,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    logo: {
        width: 50,
        height: 50,
        objectFit: "contain",
    },
    companyInfo: {
        flexDirection: "column",
    },
    companyName: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        color: "#0f172a",
    },
    companySub: {
        fontSize: 8,
        color: "#64748b",
        marginTop: 2,
    },
    headerRight: {
        alignItems: "flex-end",
    },
    receiptTypeBadge: {
        backgroundColor: "#0f172a",
        color: "#ffffff",
        fontSize: 9,
        padding: "4 10",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 5,
    },
    receiptNumber: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0f172a",
    },
    metaGrid: {
        flexDirection: "row",
        gap: 20,
        marginBottom: 25,
    },
    metaBox: {
        flex: 1,
        backgroundColor: "#f8fafc",
        borderLeft: "3pt solid #0f172a",
        padding: 12,
    },
    label: {
        fontSize: 7,
        fontWeight: "bold",
        color: "#64748b",
        textTransform: "uppercase",
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#0f172a",
    },
    table: {
        width: "100%",
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        fontWeight: "bold",
        padding: "8 10",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1pt solid #f1f5f9",
        padding: "8 10",
    },
    colDesc: { flex: 3 },
    colAmount: { flex: 1, textAlign: "right" },
    totalSection: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    totalBox: {
        width: "40%",
        backgroundColor: "#0f172a",
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalLabel: {
        color: "#94a3b8",
        fontSize: 10,
        fontWeight: "bold",
    },
    totalValue: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    signatureSection: {
        marginTop: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 50,
    },
    signatureLine: {
        flex: 1,
        borderTop: "1pt solid #cbd5e1",
        paddingTop: 8,
        alignItems: "center",
    },
    signatureRole: {
        fontSize: 7,
        color: "#64748b",
        textTransform: "uppercase",
        fontWeight: "bold",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        borderTop: "1pt solid #f1f5f9",
        paddingTop: 10,
    },
    footerText: {
        fontSize: 7,
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: 1,
    }
});

import { ReceiptOptions, ReceiptItem } from "../finance-pdf";

interface FinanceReceiptPDFProps {
    options: ReceiptOptions;
}

export function FinanceReceiptPDFView({ options }: FinanceReceiptPDFProps) {
    const isEgreso = options.title?.toUpperCase().includes("EGRESO");
    const primaryColor = options.config?.colorPrimario || "#0f172a";
    const receiptTitle = options.title || "RECIBO DE CAJA";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: primaryColor }]}>
                    <View style={styles.logoContainer}>
                        {options.config?.logoUrl ? (
                            <Image src={options.config.logoUrl} style={styles.logo} />
                        ) : (
                            <View style={[styles.logo, { backgroundColor: primaryColor }]} />
                        )}
                        <View style={styles.companyInfo}>
                            <Text style={styles.companyName}>{options.config?.nombreEmpresa || "COOPETRAES"}</Text>
                            <Text style={styles.companySub}>NIT: {options.config?.nit || "823.003.742-5"}</Text>
                            <Text style={styles.companySub}>{options.config?.direccion || "Sede Principal"}</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <View style={[styles.receiptTypeBadge, { backgroundColor: primaryColor }]}>
                            <Text>{receiptTitle}</Text>
                        </View>
                        <Text style={styles.receiptNumber}>No. {options.numero}</Text>
                        <Text style={[styles.companySub, { fontWeight: "bold" }]}>
                            {options.fecha.toLocaleDateString("es-CO", { day: '2-digit', month: 'long', year: 'numeric' })}
                        </Text>
                    </View>
                </View>

                {/* Metadata */}
                <View style={styles.metaGrid}>
                    <View style={[styles.metaBox, { borderLeftColor: primaryColor }]}>
                        <Text style={styles.label}>{isEgreso ? "Pagado a (Beneficiario):" : "Recibido de (Pagador):"}</Text>
                        <Text style={styles.value}>{options.payer.nombre.toUpperCase()}</Text>
                        <Text style={[styles.label, { marginTop: 8 }]}>Identificación / NIT:</Text>
                        <Text style={styles.value}>{options.payer.documento}</Text>
                    </View>
                    <View style={[styles.metaBox, { borderLeftColor: primaryColor }]}>
                        <Text style={styles.label}>Medio de Pago:</Text>
                        <Text style={styles.value}>{options.metodoPago}</Text>
                        <Text style={[styles.label, { marginTop: 8 }]}>Estado Documento:</Text>
                        <Text style={[styles.value, { color: "#10b981" }]}>VALOR ASENTADO</Text>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={[styles.tableHeader, { backgroundColor: primaryColor }]}>
                        <Text style={[styles.colDesc, { fontSize: 8 }]}>DESCRIPCIÓN DEL CONCEPTO</Text>
                        <Text style={[styles.colAmount, { fontSize: 8 }]}>VALOR</Text>
                    </View>
                    {options.items.map((item: ReceiptItem, index: number) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.colDesc}>{item.description}</Text>
                            <Text style={[styles.colAmount, { fontWeight: "bold" }]}>{formatCurrency(item.amount)}</Text>
                        </View>
                    ))}
                </View>

                {/* Total */}
                <View style={styles.totalSection}>
                    <View style={[styles.totalBox, { backgroundColor: primaryColor }]}>
                        <Text style={styles.totalLabel}>TOTAL:</Text>
                        <Text style={styles.totalValue}>{formatCurrency(options.total)}</Text>
                    </View>
                </View>

                {/* Signatures */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureLine}>
                        <Text style={{ fontSize: 10, fontWeight: "bold", marginBottom: 2 }}>{options.elaboradoPor.toUpperCase()}</Text>
                        <Text style={styles.signatureRole}>Elaborado Por / Tesorería</Text>
                    </View>
                    <View style={styles.signatureLine}>
                        <View style={{ height: 12 }} />
                        <Text style={styles.signatureRole}>{isEgreso ? "Firma Beneficiario / C.C" : "Firma Pagador / C.C"}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Este documento es un comprobante oficial de contabilidad emitido por COOPETRAES ERP.
                    </Text>
                    <Text style={[styles.footerText, { marginTop: 4, fontSize: 6 }]}>
                        ID Digital: {Math.random().toString(36).substring(7).toUpperCase()} — Fecha de Impresión: {new Date().toLocaleString()}
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
