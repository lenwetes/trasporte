import { StyleSheet } from "@react-pdf/renderer/lib/react-pdf.js";

export const getFuecStyles = () => StyleSheet.create({
    page: {
        paddingHorizontal: 30,
        paddingTop: 25,
        paddingBottom: 20,
        fontSize: 7,
        fontFamily: "Helvetica",
        color: "#000",
    },

    // ── Encabezado principal ──────────────────────────────────
    headerWrapper: {
        borderWidth: 1,
        borderColor: "#000",
    },
    topLabel: {
        fontSize: 8,
        fontWeight: "bold",
        textAlign: "center",
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: "#000",
    },
    headerGrid: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#000",
        minHeight: 55,
    },

    // Columna izquierda: logo Ministerio
    logoMinisterioCol: {
        width: "28%",
        borderRightWidth: 1,
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        padding: 6,
    },

    // Columna central: título y número FUEC
    titleCol: {
        width: "44%",
        borderRightWidth: 1,
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
    },
    mainTitle: {
        fontSize: 7,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 1.3,
    },
    fuecNumber: {
        fontSize: 14,
        fontWeight: "bold", // Cambiado de 'black' por precaución
        color: "#c0392b",
        textAlign: "center",
        marginTop: 3,
    },

    // Columna derecha: logo Coopetraes
    logoCoopetraesCol: {
        width: "28%",
        alignItems: "center",
        justifyContent: "center",
        padding: 6,
    },

    // ── Filas de datos ────────────────────────────────────────
    dataRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#000",
        padding: 3,
        minHeight: 14,
    },
    label: {
        fontWeight: "bold",
        marginRight: 4,
    },
    value: {
        flex: 1,
        textTransform: "uppercase",
    },

    // ── Tabla genérica ────────────────────────────────────────
    tableHeaderRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#000",
        backgroundColor: "#f0f0f0",
        borderTopWidth: 1,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#000",
    },
    thCell: {
        padding: 3,
        borderRightWidth: 1,
        borderColor: "#000",
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
    },
    tdCell: {
        padding: 3,
        borderRightWidth: 1,
        borderColor: "#000",
        flex: 1,
        textAlign: "center",
    },
    noBorder: { borderRightWidth: 0 },

    // ── Rutas ─────────────────────────────────────────────────
    routeBox: {
        padding: 3,
        borderBottomWidth: 1,
        borderColor: "#000",
    },
    routeItem: {
        flexDirection: "row",
        marginBottom: 1,
    },

    // ── Bloque de firma (dentro del cuadro principal) ─────────
    signatureBlock: {
        flexDirection: "row",
        borderTopWidth: 0,
        minHeight: 100,
    },
    contactCol: {
        width: "50%",
        borderRightWidth: 1,
        borderColor: "#000",
        padding: 6,
    },
    signatureCol: {
        width: "50%",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 6,
    },

    // ── Footer externo (QR + Supertransporte) ─────────────────
    externalFooter: {
        flexDirection: "row",
        marginTop: 6,
        alignItems: "flex-end",
    },
    qrCol: {
        width: "30%",
        alignItems: "center",
    },
    watermarkArea: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    superCol: {
        width: "30%",
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },

    // ── Marca de agua ─────────────────────────────────────────
    watermark: {
        position: "absolute",
        bottom: 60,
        left: "25%",
        width: "50%",
        opacity: 0.07,
    },
});
