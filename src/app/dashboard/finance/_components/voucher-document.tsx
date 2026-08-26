import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TransaccionWithRelations } from "@/types";
import { ConfiguracionGlobal } from "@prisma/client";

// Estilos corporativos para PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#333",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: "2pt solid #10b981",
        paddingBottom: 10,
        marginBottom: 20,
    },
    logo: {
        width: 120,
    },
    companyInfo: {
        textAlign: "right",
    },
    companyName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#10b981",
    },
    titleContainer: {
        textAlign: "center",
        backgroundColor: "#f3f4f6",
        padding: 8,
        marginBottom: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    infoItem: {
        width: "50%",
        marginBottom: 8,
    },
    label: {
        fontWeight: "bold",
        color: "#6b7280",
        marginBottom: 2,
    },
    value: {
        fontSize: 11,
    },
    table: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f9fafb",
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
        paddingVertical: 5,
    },
    colAccount: { width: "20%", paddingLeft: 5 },
    colName: { width: "40%" },
    colDebito: { width: "20%", textAlign: "right", paddingRight: 5 },
    colCredito: { width: "20%", textAlign: "right", paddingRight: 5 },
    totalSection: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopColor: "#e5e7eb",
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: "bold",
        marginRight: 20,
    },
    totalValue: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#10b981",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingTop: 10,
        fontSize: 8,
        color: "#9ca3af",
    },
    signatureContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 50,
    },
    signatureLine: {
        width: "40%",
        borderTopWidth: 1,
        borderTopColor: "#333",
        textAlign: "center",
        paddingTop: 5,
    },
});

interface VoucherDocumentProps {
    transaction: TransaccionWithRelations;
    config: Partial<ConfiguracionGlobal>;
    actor: { nombres: string; apellidos: string };
}

export const VoucherDocument: React.FC<VoucherDocumentProps> = ({
    transaction,
    config,
    actor,
}) => {
    const isIngreso = transaction.tipo === "INGRESO";
    const title = isIngreso ? "Comprobante de Ingreso" : "Comprobante de Egreso";

    const totalDebitos = transaction.asientos.reduce(
        (acc, cur) => acc + Number(cur.debito),
        0
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        {config.logoUrl ? (
                            <Image src={config.logoUrl} style={styles.logo} />
                        ) : (
                            <Text style={styles.companyName}>
                                {config.nombreEmpresa || "COOPETRAES"}
                            </Text>
                        )}
                    </View>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>
                            {config.nombreEmpresa || "COOPETRAES"}
                        </Text>
                        <Text>NIT: {config.nit || "900.000.000-1"}</Text>
                        <Text>{config.direccion || "Sincelejo, Sucre"}</Text>
                        <Text>{config.telefono || "300 000 0000"}</Text>
                    </View>
                </View>

                {/* Title and ID */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={{ marginTop: 4 }}>
                        Nº: {transaction.numeroComprobante || transaction.id.slice(0, 8).toUpperCase()}
                    </Text>
                </View>

                {/* Transaction Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Fecha:</Text>
                        <Text style={styles.value}>
                            {format(new Date(transaction.fecha), "dd/MM/yyyy", {
                                locale: es,
                            })}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Tercero:</Text>
                        <Text style={styles.value}>
                            {transaction.tercero
                                ? `${transaction.tercero.nombres} ${transaction.tercero.apellidos}`
                                : transaction.proveedor
                                  ? transaction.proveedor.nombres
                                  : "N/A"}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Método de Pago:</Text>
                        <Text style={styles.value}>{transaction.metodoPago || "EFECTIVO"}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Elaborado por:</Text>
                        <Text style={styles.value}>
                            {actor.nombres} {actor.apellidos}
                        </Text>
                    </View>
                </View>

                {/* Concept */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.label}>Concepto:</Text>
                    <Text style={styles.value}>{transaction.descripcion}</Text>
                </View>

                {/* Details Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.colAccount}>Cuenta</Text>
                        <Text style={styles.colName}>Detalle</Text>
                        <Text style={styles.colDebito}>Débito</Text>
                        <Text style={styles.colCredito}>Crédito</Text>
                    </View>

                    {transaction.asientos.map((asiento, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.colAccount}>
                                {asiento.cuenta.codigo}
                            </Text>
                            <Text style={styles.colName}>
                                {asiento.cuenta.nombre}
                            </Text>
                            <Text style={styles.colDebito}>
                                {Number(asiento.debito) > 0
                                    ? `$${Number(asiento.debito).toLocaleString()}`
                                    : ""}
                            </Text>
                            <Text style={styles.colCredito}>
                                {Number(asiento.credito) > 0
                                    ? `$${Number(asiento.credito).toLocaleString()}`
                                    : ""}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totals */}
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>TOTAL:</Text>
                    <Text style={styles.totalValue}>
                        $ {totalDebitos.toLocaleString()}
                    </Text>
                </View>

                {/* Signature Area */}
                <View style={styles.signatureContainer}>
                    <View style={styles.signatureLine}>
                        <Text>Firma Beneficiario / Tercero</Text>
                        <Text style={{ fontSize: 7, marginTop: 15 }}>CC: _____________________</Text>
                    </View>
                    <View style={styles.signatureLine}>
                        <Text>Firma Recibido / Autorizado</Text>
                        <Text style={{ fontSize: 7, marginTop: 15 }}>Sello Coopetraes</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>
                        Este documento es un soporte contable interno de
                        COOPETRAES. Generado el{" "}
                        {format(new Date(), "PPpp", { locale: es })}.
                    </Text>
                </View>
            </Page>
        </Document>
    );
};
