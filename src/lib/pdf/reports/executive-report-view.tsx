import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#1e293b",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 2,
        borderBottomStyle: "solid",
        borderBottomColor: "#00b7b5",
        paddingBottom: 10,
        marginBottom: 20,
    },
    companyTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#005461",
    },
    reportTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 5,
        textTransform: "uppercase",
        color: "#0f172a",
    },
    period: {
        fontSize: 10,
        color: "#64748b",
        marginBottom: 20,
        fontStyle: "italic",
    },
    kpiGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15,
        marginBottom: 30,
    },
    kpiCard: {
        width: "47%",
        padding: 15,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#e2e8f0",
        backgroundColor: "#f8fafc",
    },
    kpiLabel: {
        fontSize: 8,
        color: "#64748b",
        textTransform: "uppercase",
        marginBottom: 5,
        fontWeight: "bold",
    },
    kpiValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#005461",
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "bold",
        backgroundColor: "#005461",
        color: "white",
        padding: 5,
        marginTop: 20,
        marginBottom: 10,
        textTransform: "uppercase",
    },
    analysisText: {
        fontSize: 10,
        lineHeight: 1.5,
        textAlign: "justify",
        color: "#334155",
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
        fontSize: 8,
        color: "#94a3b8",
    },
});

interface ExecutiveReportData {
    periodo: string;
    empresa: {
        nombre: string;
        nit: string;
    };
    kpis: {
        disponibilidadFlota: number;
        siniestralidad: number;
        cumplimientoMantenimiento: number;
        vencimientosProximos: number;
    };
    analisis: string;
}

export const ExecutiveReportPDF = ({ data }: { data: ExecutiveReportData }) => {
    return (
        <Document title={`Reporte_Ejecutivo_${data.periodo}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.companyTitle}>{data.empresa.nombre}</Text>
                        <Text>NIT: {data.empresa.nit}</Text>
                    </View>
                    <View style={{ textAlign: "right" }}>
                        <Text>SISTEMA DE GESTIÓN DE ACTIVOS</Text>
                        <Text>{format(new Date(), "PPpp", { locale: es })}</Text>
                    </View>
                </View>

                <Text style={styles.reportTitle}>Reporte Ejecutivo de Flota</Text>
                <Text style={styles.period}>Periodo: {data.periodo}</Text>

                <View style={styles.sectionTitle}>
                    <Text>Indicadores Clave de Desempeño (KPIs)</Text>
                </View>

                <View style={styles.kpiGrid}>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>Disponibilidad de Flota</Text>
                        <Text style={styles.kpiValue}>{data.kpis.disponibilidadFlota}%</Text>
                    </View>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>Tasa de Siniestralidad</Text>
                        <Text style={styles.kpiValue}>{data.kpis.siniestralidad}%</Text>
                    </View>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>Cumplimiento Mantenimiento</Text>
                        <Text style={styles.kpiValue}>{data.kpis.cumplimientoMantenimiento}%</Text>
                    </View>
                    <View style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>Vencimientos Próximos</Text>
                        <Text style={styles.kpiValue}>{data.kpis.vencimientosProximos}</Text>
                    </View>
                </View>

                <View style={styles.sectionTitle}>
                    <Text>Análisis y Recomendaciones</Text>
                </View>
                <Text style={styles.analysisText}>{data.analisis}</Text>

                <View style={styles.footer} fixed>
                    <Text>COOPETRAES - CONFIDENCIAL - GESTIÓN OPERATIVA {new Date().getFullYear()}</Text>
                    <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} style={{ marginTop: 5 }} />
                </View>
            </Page>
        </Document>
    );
};
