import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 9,
        color: "#1e293b",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 2,
        borderBottomStyle: "solid",
        borderBottomColor: "#10b981",
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
        fontSize: 12,
        fontWeight: "bold",
        color: "#0f172a",
    },
    reportTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0f172a",
        marginTop: 10,
        textTransform: "uppercase",
    },
    reportSubtitle: {
        fontSize: 10,
        color: "#64748b",
        marginTop: 2,
        fontStyle: "italic",
    },
    metaData: {
        marginTop: 15,
        marginBottom: 20,
        fontSize: 8,
        color: "#94a3b8",
    },
    table: {
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColHeader: {
        backgroundColor: "#10b981",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: "#e2e8f0",
    },
    tableCol: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: "#e2e8f0",
    },
    tableCellHeader: {
        margin: 5,
        fontSize: 9,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    tableCell: {
        margin: 5,
        fontSize: 8,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: "#e2e8f0",
        paddingTop: 10,
        textAlign: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    footerText: {
        fontSize: 7,
        color: "#94a3b8",
    }
});

interface GenericReportPDFProps {
    title: string;
    subtitle?: string;
    columns: { header: string; dataKey: string }[];
    data: Record<string, unknown>[];
    config?: {
        nombreEmpresa?: string | null;
        nit?: string | null;
        direccion?: string | null;
        telefono?: string | null;
        email?: string | null;
        logoUrl?: string | null;
        colorPrimario?: string | null;
    } | null;
}

export const GenericReportPDF = ({
    title,
    subtitle,
    columns,
    data,
    config,
}: GenericReportPDFProps) => {
    const date = format(new Date(), "PPpp", { locale: es });
    const primaryColor = config?.colorPrimario || "#10b981";

    return (
        <Document title={title}>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: primaryColor }]}>
                    <View>
                        {config?.logoUrl ? (
                            <Image src={config.logoUrl} style={styles.logo} />
                        ) : (
                            <Text style={[styles.companyName, { color: primaryColor }]}>COOPETRAES</Text>
                        )}
                    </View>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>{config?.nombreEmpresa || "COOPETRAES"}</Text>
                        <Text>NIT: {config?.nit || "823.003.742-5"}</Text>
                        <Text>{config?.direccion || ""}</Text>
                        <Text>{config?.telefono || ""} | {config?.email || ""}</Text>
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.reportTitle}>{title}</Text>
                {subtitle && <Text style={styles.reportSubtitle}>{subtitle}</Text>}
                
                <Text style={styles.metaData}>Generado el: {date}</Text>

                {/* Table */}
                <View style={styles.table}>
                    {/* Header Row */}
                    <View style={styles.tableRow}>
                        {columns.map((col, i) => (
                            <View 
                                key={i} 
                                style={[
                                    styles.tableColHeader, 
                                    { flex: 1, backgroundColor: primaryColor }
                                ]}
                            >
                                <Text style={styles.tableCellHeader}>{col.header.toUpperCase()}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Data Rows */}
                    {data.map((row, i) => (
                        <View key={i} style={[styles.tableRow, { backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc" }]}>
                            {columns.map((col, j) => (
                                <View key={j} style={[styles.tableCol, { flex: 1 }]}>
                                    <Text style={styles.tableCell}>
                                        {String(row[col.dataKey] ?? "N/A")}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        Página {1} de {1}
                    </Text>
                    <Text style={styles.footerText}>
                        © {new Date().getFullYear()} {config?.nombreEmpresa || "COOPETRAES"} - Sistema de Gestión Operativa
                    </Text>
                    <Text 
                        style={styles.footerText} 
                        render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} 
                    />
                </View>
            </Page>
        </Document>
    );
};
