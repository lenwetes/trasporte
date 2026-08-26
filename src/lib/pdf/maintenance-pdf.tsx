import React from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { maintenanceStyles as styles } from "./maintenance-styles";
import { formatCurrency, formatDate, formatNumber } from "../utils";

import { 
    OrdenServicio, 
    Vehiculo, 
    PlanMantenimiento, 
    ConfiguracionGlobal, 
    Usuario 
} from "@prisma/client";

interface MaintenancePDFProps {
    data: {
        orden: OrdenServicio;
        vehiculo?: Vehiculo | null;
        propietario?: Usuario | null;
        plan?: PlanMantenimiento | null;
        config?: ConfiguracionGlobal | null;
    };
}

export const MaintenancePDFDocument = ({ data }: MaintenancePDFProps) => {
    const { orden, vehiculo, propietario, plan, config } = data;

    return (
        <Document title={`OS_${orden.codigo}`}>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        {config?.logoUrl ? (
                            <Image src={config.logoUrl} style={styles.logo} />
                        ) : (
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#10b981' }}>COOPETRAES</Text>
                        )}
                    </View>
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>{config?.nombreEmpresa || "COOPETRAES S.A.S"}</Text>
                        <Text style={styles.companyDetails}>NIT: {config?.nit || "---"}</Text>
                        <Text style={styles.companyDetails}>{config?.direccion || "Calle Principal #123"}</Text>
                        <Text style={styles.companyDetails}>Tel: {config?.telefono || "---"}</Text>
                    </View>
                </View>

                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>Orden de Servicio de Mantenimiento</Text>
                    <Text style={styles.osCode}>{orden.codigo}</Text>
                </View>

                {/* Info Grid */}
                <View style={styles.grid}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Fecha de Emisión</Text>
                        <Text style={styles.value}>{formatDate(orden.fechaCreacion)}</Text>
                    </View>
                    <View style={styles.field}>
                        <Text style={styles.label}>Estado Actual</Text>
                        <Text style={styles.value}>{orden.estado}</Text>
                    </View>
                </View>

                {/* Vehículo Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información del Vehículo</Text>
                    <View style={styles.grid}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Placa</Text>
                            <Text style={styles.value}>{vehiculo?.placa || "N/A"}</Text>
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Marca / Modelo</Text>
                            <Text style={styles.value}>
                                {vehiculo?.marca || "---"} {vehiculo?.modelo || "---"}
                            </Text>
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Kilometraje Actual</Text>
                            <Text style={styles.value}>{formatNumber(vehiculo?.kilometrajeActual)} KM</Text>
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Propietario / Responsable</Text>
                            <Text style={styles.value}>
                                {propietario ? `${propietario.nombres} ${propietario.apellidos}` : "No asignado"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Plan Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Técnica Requerida (Plan)</Text>
                    <View style={styles.grid}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Frecuencia / Intervalo</Text>
                            <Text style={styles.value}>
                                {plan?.frecuencia === 'KILOMETROS' ? `${formatNumber(plan.kmIntervalo)} KM` : `${plan?.mesesIntervalo} Meses`}
                            </Text>
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Procedimiento Maestro</Text>
                            <Text style={styles.value}>{plan?.nombre || "N/A"}</Text>
                        </View>
                    </View>
                    <View style={styles.description}>
                        <Text style={styles.label}>Descripción del Servicio:</Text>
                        <Text style={styles.value}>{plan?.descripcion || "Se requiere realizar mantenimiento preventivo según manual del fabricante."}</Text>
                    </View>
                </View>

                {/* Resultados Section (Si aplica) */}
                {(orden.estado === 'COMPLETADA' || orden.estado === 'EN_REVISION') && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Resultados de la Operación</Text>
                        <View style={styles.grid}>
                            <View style={styles.field}>
                                <Text style={styles.label}>Kilometraje de Ejecución</Text>
                                <Text style={styles.value}>{formatNumber(orden.kilometrajeReportado)} KM</Text>
                            </View>
                            <View style={styles.field}>
                                <Text style={styles.label}>Costo Total Invertido</Text>
                                <Text style={styles.value}>{formatCurrency(orden.costoReportado ?? 0)}</Text>
                            </View>
                        </View>
                        {orden.observacionesConductor && (
                            <View style={styles.description}>
                                <Text style={styles.label}>Notas adicionales del servicio:</Text>
                                <Text style={styles.value}>{orden.observacionesConductor}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Signatures */}
                <View style={styles.signatureGrid}>
                    <View style={styles.signatureLine}>
                        <Text style={styles.signatureLabel}>Firma Autorizada Admin</Text>
                    </View>
                    <View style={styles.signatureLine}>
                        <Text style={styles.signatureLabel}>Firma Conductor / Propietario</Text>
                    </View>
                </View>

                {/* Legal Info */}
                <View style={{ marginTop: 40 }}>
                    <Text style={{ fontSize: 7, color: '#94a3b8', textAlign: 'center' }}>
                        Este documento es una orden de servicio oficial emitida por el sistema de gestión de flota de {config?.nombreEmpresa || 'COOPETRAES'}. 
                        El incumplimiento de los planes de mantenimiento puede afectar la operatividad del vehículo.
                    </Text>
                </View>
            </Page>
        </Document>
    );
};
