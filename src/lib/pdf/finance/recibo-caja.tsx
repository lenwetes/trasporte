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
        borderBottomColor: "#10b981", // green-500
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
        color: "#374151", // gray-700
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#10b981",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: "#6b7280", // gray-500
    },
    receiptInfo: {
        marginTop: 20,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#f3f4f6", // gray-100
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
        color: "#111827", // gray-900
    },
    mainContent: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#e5e7eb", // gray-200
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
        borderTopColor: "#10b981",
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: "bold",
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#10b981",
    },
    signatures: {
        marginTop: 50,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    signatureBox: {
        width: "45%",
        borderTopWidth: 1,
        borderTopColor: "#000",
        paddingTop: 5,
        alignItems: "center",
    },
    signatureText: {
        fontSize: 10,
        color: "#374151",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: "center",
        fontSize: 8,
        color: "#9ca3af", // gray-400
    },
});

interface ReciboCajaPDFProps {
    consecutivo: number;
    fecha: Date;
    recibidoDe: string;
    documentoIdentidad: string;
    concepto: string;
    monto: number;
    metodoPago: string;
    elaboradoPor: string;
}

export function ReciboCajaPDF({
    consecutivo,
    fecha,
    recibidoDe,
    documentoIdentidad,
    concepto,
    monto,
    metodoPago,
    elaboradoPor,
}: ReciboCajaPDFProps) {
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
                        <Text>Calle 20 # 20-20, Sincelejo</Text>
                        <Text>Tel: (605) 282-0000</Text>
                        <Text>info@coopetraes.com</Text>
                    </View>
                </View>

                {/* Título del documento */}
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        RECIBO DE CAJA
                    </Text>
                    <Text style={{ fontSize: 14, color: "#ef4444" }}>
                        N° {consecutivo.toString().padStart(6, "0")}
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
                        <Text style={styles.label}>CIUDAD:</Text>
                        <Text style={styles.value}>Sincelejo, Sucre</Text>
                    </View>
                    <View style={styles.infoColumn}>
                        <Text style={styles.label}>MÉTODO PAGO:</Text>
                        <Text style={styles.value}>{metodoPago}</Text>
                    </View>
                </View>

                {/* Detalles de quien paga */}
                <View style={styles.mainContent}>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>RECIBIDO DE:</Text>
                            <Text style={styles.value}>{recibidoDe}</Text>
                        </View>
                        <View style={{ width: "30%" }}>
                            <Text style={styles.label}>IDENTIFICACIÓN:</Text>
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
                        <Text style={styles.totalLabel}>
                            VALOR TOTAL RECIBIDO
                        </Text>
                        <Text style={styles.totalAmount}>
                            {formatter.format(monto)}
                        </Text>
                    </View>
                </View>

                {/* Firmas */}
                <View style={styles.signatures}>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureText}>Firma y Sello</Text>
                        <Text
                            style={{
                                ...styles.signatureText,
                                fontWeight: "bold",
                                marginTop: 30,
                            }}
                        >
                            TESORERÍA / CAJA
                        </Text>
                        <Text style={{ fontSize: 8, marginTop: 2 }}>
                            Elaborado por: {elaboradoPor}
                        </Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text style={styles.signatureText}>Firma</Text>
                        <Text
                            style={{
                                ...styles.signatureText,
                                fontWeight: "bold",
                                marginTop: 30,
                            }}
                        >
                            L.C. {documentoIdentidad}
                        </Text>
                        <Text style={{ fontSize: 8, marginTop: 2 }}>
                            Entregado por
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Generado automáticamente por el Sistema de Gestión Coopetraes -{" "}
                    {new Date().toLocaleString()}
                </Text>
            </Page>
        </Document>
    );
}
