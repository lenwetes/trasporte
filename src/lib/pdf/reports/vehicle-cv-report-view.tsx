import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { VehiculoWithRelations } from "@/types";

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
        borderBottomColor: "#005461",
        paddingBottom: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#005461",
        textTransform: "uppercase",
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: "bold",
        backgroundColor: "#f1f5f9",
        padding: 5,
        marginBottom: 8,
        textTransform: "uppercase",
        borderLeftWidth: 3,
        borderLeftStyle: "solid",
        borderLeftColor: "#005461",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    field: {
        width: "30%",
        marginBottom: 5,
    },
    label: {
        fontSize: 7,
        color: "#64748b",
        textTransform: "uppercase",
    },
    value: {
        fontSize: 9,
        fontWeight: "bold",
    },
    table: {
        width: "100%",
        marginTop: 5,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f8fafc",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "#e2e8f0",
        padding: 4,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "#f1f5f9",
        padding: 4,
    },
    tableCol: {
        flex: 1,
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
        fontSize: 7,
        color: "#94a3b8",
    },
});

export const VehicleCVReportPDF = ({ vehiculo }: { vehiculo: VehiculoWithRelations }) => {
    return (
        <Document title={`Hoja_Vida_${vehiculo.placa}`}>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Hoja de Vida de Vehículo</Text>
                        <Text>PLACA: {vehiculo.placa}</Text>
                    </View>
                    <View style={{ textAlign: "right" }}>
                        <Text>SISTEMA COOPETRAES</Text>
                        <Text>Fecha: {format(new Date(), "PP", { locale: es })}</Text>
                    </View>
                </View>

                {/* Technical Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Información Técnica</Text>
                    <View style={styles.grid}>
                        <View style={styles.field}><Text style={styles.label}>Marca</Text><Text style={styles.value}>{vehiculo.marca || "-"}</Text></View>
                        <View style={styles.field}><Text style={styles.label}>Modelo</Text><Text style={styles.value}>{vehiculo.modelo || "-"}</Text></View>
                        <View style={styles.field}><Text style={styles.label}>Año</Text><Text style={styles.value}>{vehiculo.anho || "-"}</Text></View>
                        <View style={styles.field}><Text style={styles.label}>Cilindraje</Text><Text style={styles.value}>{vehiculo.cilindraje || "-"}</Text></View>
                        <View style={styles.field}><Text style={styles.label}>Clase</Text><Text style={styles.value}>{vehiculo.clase || "-"}</Text></View>
                        <View style={styles.field}><Text style={styles.label}>Capacidad</Text><Text style={styles.value}>{vehiculo.capacidadPuestos} PAX</Text></View>
                        <View style={styles.field}><Text style={styles.label}>Motor</Text><Text style={styles.value}>{vehiculo.numeroMotor || "-"}</Text></View>
                        <View style={styles.field}><Text style={styles.label}>Chasis</Text><Text style={styles.value}>{vehiculo.numeroChasis || "-"}</Text></View>
                        <View style={styles.field}><Text style={styles.label}>Odómetro</Text><Text style={styles.value}>{vehiculo.kilometrajeActual?.toLocaleString()} KM</Text></View>
                    </View>
                </View>

                {/* Documentation */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Estado de Documentación</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableCol, { flex: 2 }]}>Documento</Text>
                            <Text style={styles.tableCol}>Vencimiento</Text>
                            <Text style={styles.tableCol}>Estado</Text>
                        </View>
                        {vehiculo.documentos.map((doc, idx) => (
                            <View key={idx} style={styles.tableRow}>
                                <Text style={[styles.tableCol, { flex: 2, fontWeight: "bold" }]}>{doc.tipo}</Text>
                                <Text style={styles.tableCol}>{format(new Date(doc.fechaVencimiento), "dd/MM/yyyy")}</Text>
                                <Text style={styles.tableCol}>{doc.estadoAlerta}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Recent Maintenance */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Últimos Mantenimientos</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableCol}>Fecha</Text>
                            <Text style={[styles.tableCol, { flex: 2 }]}>Servicio</Text>
                            <Text style={styles.tableCol}>KM</Text>
                            <Text style={styles.tableCol}>Costo</Text>
                        </View>
                        {vehiculo.mantenimientos.slice(0, 5).map((m, idx) => (
                            <View key={idx} style={styles.tableRow}>
                                <Text style={styles.tableCol}>{format(new Date(m.fecha), "dd/MM/yyyy")}</Text>
                                <Text style={[styles.tableCol, { flex: 2 }]}>{m.plan.nombre}</Text>
                                <Text style={styles.tableCol}>{m.kilometraje?.toLocaleString()}</Text>
                                <Text style={styles.tableCol}>${m.costo?.toLocaleString()}</Text>
                            </View>
                        ))}
                        {vehiculo.mantenimientos.length === 0 && <Text style={{ padding: 5, fontStyle: "italic", color: "#94a3b8" }}>No se registran intervenciones.</Text>}
                    </View>
                </View>

                <View style={styles.footer} fixed>
                    <Text>COOPETRAES - GESTIÓN DE FLOTA Y TRANSPORTE - DOCUMENTO INTERNO CONTROLADO</Text>
                    <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
                </View>
            </Page>
        </Document>
    );
};
