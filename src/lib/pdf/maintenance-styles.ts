import { StyleSheet } from "@react-pdf/renderer";

export const maintenanceStyles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
        color: "#1e293b",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: "#10b981",
        paddingBottom: 15,
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
        color: "#1e293b",
    },
    companyDetails: {
        fontSize: 8,
        color: "#64748b",
        marginTop: 2,
    },
    titleSection: {
        marginBottom: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    osCode: {
        fontSize: 12,
        color: "#10b981",
        marginTop: 5,
        fontWeight: "bold",
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: "bold",
        backgroundColor: "#f8fafc",
        padding: 6,
        borderLeftWidth: 3,
        borderLeftColor: "#10b981",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    field: {
        width: "48%",
        marginBottom: 8,
    },
    label: {
        fontSize: 8,
        color: "#64748b",
        textTransform: "uppercase",
        marginBottom: 2,
        fontWeight: "bold",
    },
    value: {
        fontSize: 10,
        color: "#1e293b",
        fontWeight: "medium",
    },
    description: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#f1f5f9",
        borderRadius: 4,
        fontSize: 9,
        lineHeight: 1.4,
    },
    footer: {
        position: "absolute",
        bottom: 40,
        left: 40,
        right: 40,
    },
    signatureGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 60,
    },
    signatureLine: {
        width: "40%",
        borderTopWidth: 1,
        borderTopColor: "#94a3b8",
        paddingTop: 5,
        alignItems: "center",
    },
    signatureLabel: {
        fontSize: 8,
        color: "#64748b",
        textTransform: "uppercase",
    },
});
