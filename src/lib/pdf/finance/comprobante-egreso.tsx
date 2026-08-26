import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 30,
        fontFamily: "Helvetica",
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f59e0b", // amber-500
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoContainer: {
        width: 150,
    },
    companyInfo: {
        textAlign: "right",
        fontSize: 10,
        color: "#374151",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#f59e0b", // amber-500
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: "#6b7280",
    },
    receiptInfo: {
        marginTop: 20,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fffbeb", // amber-50
        padding: 10,
        borderRadius: 4,
    },
    infoColumn: {
        flexDirection: "column",
        gap: 5,
    },
    label: {
        fontSize: 10,
        color: "#6b7280",
        fontWeight: "bold",
    },
    value: {
        fontSize: 12,
        color: "#111827",
    },
    mainContent: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 4,
    },
    row: {
        flexDirection: "row",
        marginBottom: 10,
    },
    conceptRow: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
    },
    totalSection: {
        marginTop: 20,
        alignItems: "flex-end",
        paddingTop: 10,
        borderTopWidth: 2,
        borderTopColor: "#f59e0b",
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: "bold",
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#f59e0b", // amber-500
    },
    signatures: {
        marginTop: 50,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    signatureBox: {
        width: "30%",
        borderTopWidth: 1,
        borderTopColor: "#000",
        paddingTop: 5,
        alignItems: "center",
    },
    signatureText: {
        fontSize: 8,
        color: "#374151",
        textAlign: "center",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: "center",
        fontSize: 8,
        color: "#9ca3af",
    },
});

interface ComprobanteEgresoPDFProps {
    consecutivo: number;
    fecha: Date;
    pagadoA: string; // Beneficiario
    documentoIdentidad: string;
    concepto: string;
    monto: number;
    formaPago: string; // Ej: Transferencia, Cheque, Efectivo
    cuentaBancaria?: string;
    elaboradoPor: string;
    aprobadoPor: string;
}

export function ComprobanteEgresoPDF({
    consecutivo,
    fecha,
    pagadoA,
    documentoIdentidad,
    concepto,
    monto,
    formaPago,
    cuentaBancaria,
    elaboradoPor,
    aprobadoPor,
}: ComprobanteEgresoPDFProps) {
    const formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.title}>COOPETRAES</Text>
                        <Text style={styles.subtitle}>Cooperativa de Transporte</Text>
                    </View>
                    <View style={styles.companyInfo}>
                        <Text>NIT: 800.123.456-7</Text>
                        <Text>COMPROBANTE DE EGRESO</Text>
                        <Text>Documento Soporte Contable</Text>
                    </View>
                </View>

                {/* Título del documento */}
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        COMPROBANTE DE EGRESO
                    </Text>
                    <Text style={{ fontSize: 14, color: "#ef4444" }}>
                        CE-{consecutivo.toString().padStart(6, "0")}
                    </Text>
                </View>

                {/* Información General */}
                <View style={styles.receiptInfo}>
                    <View style={styles.infoColumn}>
                        <Text style={styles.label}>FECHA:</Text>
                        <Text style={styles.value}>
                            {fecha.toLocaleDateString("es-CO", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </Text>
                    </View>
                    <View style={styles.infoColumn}>
                        <Text style={styles.label}>FORMA DE PAGO:</Text>
                        <Text style={styles.value}>{formaPago}</Text>
                        {cuentaBancaria && (
                            <Text style={{ fontSize: 10, color: "#6b7280" }}>
                                Cta: {cuentaBancaria}
                            </Text>
                        )}
                    </View>
                    <View style={styles.infoColumn}>
                        <Text style={styles.label}>CIUDAD:</Text>
                        <Text style={styles.value}>Sincelejo</Text>
                    </View>
                </View>

                {/* Detalles del Beneficiario */}
                <View style={styles.mainContent}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>PAGADO A (BENEFICIARIO):</Text>
                            <Text style={styles.value}>{pagadoA}</Text>
                        </View>
                        <View style={{ width: "30%" }}>
                            <Text style={styles.label}>NIT / CC:</Text>
                            <Text style={styles.value}>{documentoIdentidad}</Text>
                        </View>
                    </View>

                    <View style={styles.conceptRow}>
                        <Text style={styles.label}>POR CONCEPTO DE:</Text>
                        <Text style={{ ...styles.value, marginTop: 5 }}>
                            {concepto}
                        </Text>
                    </View>

                    <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}> VALOR TOTAL PAGADO</Text>
                        <Text style={styles.totalAmount}>
                            {formatter.format(monto)}
                        </Text>
                    </View>
                </View>

                {/* Firmas */}
                <View style={styles.signatures}>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureText}>Elaborado</Text>
                        <Text
                            style={{
                                ...styles.signatureText,
                                fontWeight: "bold",
                                marginTop: 25,
                            }}
                        >
                            {elaboradoPor}
                        </Text>
                        <Text style={{ fontSize: 8, marginTop: 2 }}>
                            Auxiliar Contable
                        </Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureText}>Aprobado</Text>
                        <Text
                            style={{
                                ...styles.signatureText,
                                fontWeight: "bold",
                                marginTop: 25,
                            }}
                        >
                            {aprobadoPor}
                        </Text>
                        <Text style={{ fontSize: 8, marginTop: 2 }}>
                            Gerencia / Tesorería
                        </Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureText}>Recibí Conforme</Text>
                        <Text
                            style={{
                                ...styles.signatureText,
                                fontWeight: "bold",
                                marginTop: 25,
                            }}
                        >
                            Firma y C.C.
                        </Text>
                        <Text style={{ fontSize: 8, marginTop: 2 }}>
                            Beneficiario
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={{ position: 'absolute', bottom: 30, left: 30, right: 30 }}>
                    <Text style={styles.footer}>
                        Generado por el Sistema de Gestión Coopetraes - {new Date().toLocaleString()}
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
