import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CVData } from "../cv-types";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 9,
        color: "#334155",
        backgroundColor: "#FFFFFF",
    },
    header: {
        marginBottom: 20,
    },
    headerTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    logoAndBrand: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    logo: {
        width: 65,
        height: 55,
        objectFit: "contain",
    },
    brandInfo: {
        justifyContent: "center",
    },
    companyName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#005461",
        letterSpacing: 0.5,
    },
    companySubtitle: {
        fontSize: 7,
        color: "#000000",
        fontWeight: "bold",
        marginTop: 2,
        textTransform: "uppercase",
    },
    folioBox: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        padding: 4,
        paddingHorizontal: 8,
        minWidth: 120,
    },
    folioText: {
        fontSize: 8,
        color: "#64748b",
        fontWeight: "bold",
    },
    systemRow: {
        marginTop: 10,
    },
    systemBox: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        padding: 4,
        paddingHorizontal: 10,
        alignSelf: "flex-start",
        marginBottom: 4,
    },
    systemText: {
        fontSize: 9,
        color: "#64748b",
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    headerLine: {
        borderBottomWidth: 3,
        borderBottomColor: "#005461",
        width: "100%",
    },
    titleSection: {
        marginBottom: 25,
        textAlign: "center",
        marginTop: 10,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: "black",
        color: "#0f172a",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    subTitle: {
        fontSize: 10,
        color: "#00b7b5",
        fontWeight: "bold",
        marginTop: 4,
        textTransform: "uppercase",
        letterSpacing: 2,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        backgroundColor: "#f8fafc",
        borderLeftWidth: 4,
        borderLeftStyle: "solid",
        borderLeftColor: "#005461",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#0f172a",
        textTransform: "uppercase",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15,
    },
    gridItem: {
        width: "30%",
        marginBottom: 10,
    },
    label: {
        fontSize: 7,
        color: "#64748b",
        textTransform: "uppercase",
        marginBottom: 2,
    },
    value: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#1e293b",
    },
    profileRow: {
        flexDirection: "row",
        gap: 30,
        marginBottom: 30,
    },
    photoContainer: {
        width: 120,
        height: 150,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#e2e8f0",
        backgroundColor: "#f1f5f9",
        justifyContent: "center",
        alignItems: "center",
    },
    photoPlaceholder: {
        fontSize: 8,
        color: "#94a3b8",
        textAlign: "center",
    },
    personalDetails: {
        flex: 1,
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "#f1f5f9",
        paddingVertical: 5,
    },
    experienceItem: {
        marginBottom: 15,
        paddingLeft: 10,
        borderLeftWidth: 1,
        borderLeftStyle: "solid",
        borderLeftColor: "#e2e8f0",
    },
    experienceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 3,
    },
    cargo: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#0f172a",
    },
    empresa: {
        fontSize: 9,
        color: "#005461",
        fontWeight: "bold",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: "#f1f5f9",
        textAlign: "center",
    },
    footerText: {
        fontSize: 7,
        color: "#94a3b8",
    },
    // Nuevos estilos para documentos adjuntos
    attachmentPage: {
        padding: 30,
        backgroundColor: "#f8fafc",
    },
    attachmentContainer: {
        flex: 1,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#cbd5e1",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },
    attachmentHeader: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingBottom: 10,
    },
    attachmentTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#0f172a",
        textTransform: "uppercase",
    },
    attachmentSub: {
        fontSize: 8,
        color: "#64748b",
        marginTop: 2,
    },
    attachmentImage: {
        width: "100%",
        height: "auto",
        maxHeight: "90%",
        objectFit: "contain",
    },
});

export const CVReportPDF = ({ data }: { data: CVData }) => {
    const { usuario, hojaVida, licencias, certificados, experienciasLaborales, referenciasPersonales, config } = data;
    const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });

    // Helper para obtener la URL completa del archivo
    const getFileUrl = (nombreUnico: string) => {
        // En un entorno real, esto debería ser la URL absoluta del servidor
        return `/api/files/download/${nombreUnico}`;
    };

    return (
        <Document title={`CV_${usuario.nombres}_${usuario.apellidos}`}>
            {/* PAGINA PRINCIPAL: RESUMEN EJECUTIVO */}
            <Page size="A4" style={styles.page}>
                {/* Header Institucional Refinado (Match Screenshot Exactly) */}
                <View style={styles.header}>
                    <View style={styles.headerTopRow}>
                        <View style={styles.logoAndBrand}>
                            <Image 
                                src={config?.logoUrl || "/images/fuec/logo-coopetraes.png"} 
                                style={styles.logo} 
                            />
                            <View style={styles.brandInfo}>
                                <Text style={styles.companyName}>{config?.nombreEmpresa || "COOPETRAES"}</Text>
                                <Text style={styles.companySubtitle}>COOPERATIVA DE TRANSPORTE ESPECIAL DE SUCRE</Text>
                            </View>
                        </View>

                        <View style={styles.folioBox}>
                            <Text style={styles.folioText}>FOLIO: CV-{usuario.numeroDocumento}</Text>
                            <Text style={[styles.folioText, { fontWeight: "normal" }]}>{today}</Text>
                        </View>
                    </View>

                    <View style={styles.systemRow}>
                        <View style={styles.systemBox}>
                            <Text style={styles.systemText}>SISTEMA DE GESTIÓN OPERATIVA - PESV 2024</Text>
                        </View>
                        <View style={styles.headerLine} />
                    </View>
                </View>

                {/* Título Principal */}
                <View style={styles.titleSection}>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: "#0f172a", alignSelf: "center", paddingBottom: 2, marginBottom: 4 }}>
                        <Text style={styles.mainTitle}>HOJA DE VIDA CORPORATIVA</Text>
                    </View>
                    <Text style={styles.subTitle}>TALENTO OPERATIVO CERTIFICADO</Text>
                </View>

                {/* Perfil Inicial */}
                <View style={styles.profileRow}>
                    <View style={styles.photoContainer}>
                        {usuario.fotoPerfil ? (
                            <Image src={getFileUrl(usuario.fotoPerfil.nombreUnico)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <Text style={styles.photoPlaceholder}>FOTO 3X4</Text>
                        )}
                    </View>
                    <View style={styles.personalDetails}>
                        <View style={[styles.row, { backgroundColor: "#f8fafc", padding: 8, borderRadius: 4 }]}>
                            <View>
                                <Text style={styles.label}>Nombres Completos</Text>
                                <Text style={[styles.value, { fontSize: 11 }]}>{usuario.nombres} {usuario.apellidos}</Text>
                            </View>
                            <View style={{ textAlign: "right" }}>
                                <Text style={styles.label}>N° Documento</Text>
                                <Text style={styles.value}>{usuario.numeroDocumento}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.label}>Correo Electrónico</Text>
                                <Text style={styles.value}>{usuario.email || "NO REGISTRA"}</Text>
                            </View>
                            <View style={{ textAlign: "right" }}>
                                <Text style={styles.label}>Teléfono</Text>
                                <Text style={styles.value}>{usuario.telefono || "NO REGISTRA"}</Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View>
                                <Text style={styles.label}>Dirección</Text>
                                <Text style={styles.value}>{usuario.direccion || "N/A"} - {usuario.municipio || ""}</Text>
                            </View>
                            <View style={{ textAlign: "right" }}>
                                <Text style={styles.label}>Estado Civil</Text>
                                <Text style={styles.value}>{usuario.estadoCivil || "N/A"}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Información de Seguridad Social */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>SEGURIDAD SOCIAL Y SALUD</Text>
                    </View>
                    <View style={styles.grid}>
                        <View style={[styles.gridItem, { borderWidth: 1, borderColor: "#e2e8f0", padding: 6, borderRadius: 4 }]}>
                            <Text style={styles.label}>EPS</Text>
                            <Text style={styles.value}>{hojaVida?.eps || "N/A"}</Text>
                            <View style={{ marginTop: 8 }}>
                                <Text style={styles.label}>RH</Text>
                                <Text style={[styles.value, { color: "#e11d48" }]}>{hojaVida?.rh || "S.D"}</Text>
                            </View>
                        </View>
                        <View style={[styles.gridItem, { borderWidth: 1, borderColor: "#e2e8f0", padding: 6, borderRadius: 4 }]}>
                            <Text style={styles.label}>ARL</Text>
                            <Text style={styles.value}>{hojaVida?.arl || "N/A"}</Text>
                            <View style={{ marginTop: 8 }}>
                                <Text style={styles.label}>CTO. EMERGENCIA</Text>
                                <Text style={[styles.value, { fontSize: 7 }]}>{hojaVida?.contactoEmergenciaNombre || "N/A"}</Text>
                            </View>
                        </View>
                        <View style={[styles.gridItem, { borderWidth: 1, borderColor: "#e2e8f0", padding: 6, borderRadius: 4 }]}>
                            <Text style={styles.label}>FONDO PENSIÓN</Text>
                            <Text style={styles.value}>{hojaVida?.fondoPensiones || "N/A"}</Text>
                            <View style={{ marginTop: 8 }}>
                                <Text style={styles.label}>TEL. EMERGENCIA</Text>
                                <Text style={styles.value}>{hojaVida?.contactoEmergenciaTelefono || "N/A"}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Licencias de Conducción */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>PERFIL DE CONDUCCIÓN (RUNT)</Text>
                    </View>
                    {licencias && licencias.length > 0 ? (
                        <View style={styles.grid}>
                            {licencias.map((lic, i) => (
                                <View key={i} style={[styles.gridItem, { width: "45%", borderWidth: 1, borderColor: "#e2e8f0", padding: 6, borderRadius: 4 }]}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                                        <Text style={styles.label}>Categoría {lic.categoria}</Text>
                                        <Text style={[styles.label, { color: "#00b7b5" }]}>ACTIVA</Text>
                                    </View>
                                    <Text style={[styles.value, { fontSize: 8 }]}>{lic.servicio}</Text>
                                    <Text style={{ fontSize: 6, color: "#94a3b8", marginTop: 4 }}>
                                        VENCE: {format(new Date(lic.fechaVencimiento), "PP", { locale: es })}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ fontSize: 8, fontStyle: "italic", color: "#94a3b8" }}>No registra licencias vinculadas.</Text>
                    )}
                </View>

                {/* Experiencia Laboral */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>EXPERIENCIA LABORAL RECIENTE</Text>
                    </View>
                    {experienciasLaborales && experienciasLaborales.length > 0 ? (
                        experienciasLaborales.slice(0, 3).map((exp, i) => (
                            <View key={i} style={styles.experienceItem}>
                                <View style={styles.experienceHeader}>
                                    <Text style={styles.cargo}>{exp.cargo}</Text>
                                    <Text style={styles.value}>{exp.tiempoLaborado || ""}</Text>
                                </View>
                                <Text style={styles.empresa}>{exp.empresa}</Text>
                                <Text style={{ fontSize: 8, color: "#64748b", marginTop: 2 }}>
                                    Ref: {exp.jefeInmediato || "N/A"} - Tel: {exp.telefonoJefe || "N/A"}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={{ fontSize: 8, fontStyle: "italic", color: "#94a3b8" }}>No se ha cargado historial laboral.</Text>
                    )}
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                         {config?.nombreEmpresa || "COOPETRAES"} - Gestión de Talento Humano
                    </Text>
                    <Text style={[styles.footerText, { marginTop: 4, fontWeight: "bold" }]}>
                        Documento generado automáticamente. La información contenida está sujeta a verificación física contra soportes originales.
                    </Text>
                    <Text 
                        style={[styles.footerText, { marginTop: 4 }]} 
                        render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} 
                    />
                </View>
            </Page>

            {/* INTEGRACIÓN DE DOCUMENTOS ADJUNTOS (ANEXOS) */}
            
            {/* 1. Documento de Identidad */}
            {usuario.documentoIdentidad && (
                <Page size="A4" style={styles.attachmentPage}>
                    <View style={styles.attachmentHeader}>
                        <Text style={styles.attachmentTitle}>Soporte: Documento de Identidad</Text>
                        <Text style={styles.attachmentSub}>FOLIO ASOCIADO: {usuario.numeroDocumento}</Text>
                    </View>
                    <View style={styles.attachmentContainer}>
                        <Image src={getFileUrl(usuario.documentoIdentidad.nombreUnico)} style={styles.attachmentImage} />
                    </View>
                </Page>
            )}

            {/* 2. Licencias de Conducción */}
            {licencias?.filter(l => l.archivo).map((lic, idx) => (
                <Page key={`lic-${idx}`} size="A4" style={styles.attachmentPage}>
                    <View style={styles.attachmentHeader}>
                        <Text style={styles.attachmentTitle}>Soporte: Licencia de Conducción - Cat. {lic.categoria}</Text>
                        <Text style={styles.attachmentSub}>FECHA VENCIMIENTO: {format(new Date(lic.fechaVencimiento), "PP", { locale: es })}</Text>
                    </View>
                    <View style={styles.attachmentContainer}>
                        <Image src={getFileUrl(lic.archivo!.nombreUnico)} style={styles.attachmentImage} />
                    </View>
                </Page>
            ))}

            {/* 3. Certificados y Otros */}
            {certificados?.filter(c => c.archivo).map((cert, idx) => (
                <Page key={`cert-${idx}`} size="A4" style={styles.attachmentPage}>
                    <View style={styles.attachmentHeader}>
                        <Text style={styles.attachmentTitle}>Soporte: {cert.nombre}</Text>
                        <Text style={styles.attachmentSub}>INSTITUCIÓN: {cert.institucion || "N/A"}</Text>
                    </View>
                    <View style={styles.attachmentContainer}>
                        <Image src={getFileUrl(cert.archivo!.nombreUnico)} style={styles.attachmentImage} />
                    </View>
                </Page>
            ))}

            {/* 4. Soportes de Experiencia */}
            {experienciasLaborales?.filter(e => e.archivo).map((exp, idx) => (
                <Page key={`exp-${idx}`} size="A4" style={styles.attachmentPage}>
                    <View style={styles.attachmentHeader}>
                        <Text style={styles.attachmentTitle}>Soporte: Certificación Laboral - {exp.empresa}</Text>
                        <Text style={styles.attachmentSub}>CARGO: {exp.cargo}</Text>
                    </View>
                    <View style={styles.attachmentContainer}>
                        <Image src={getFileUrl(exp.archivo!.nombreUnico)} style={styles.attachmentImage} />
                    </View>
                </Page>
            ))}

        </Document>
    );
};
