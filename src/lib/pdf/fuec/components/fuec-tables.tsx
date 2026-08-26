import React from "react";
import { Text, View } from "@react-pdf/renderer/lib/react-pdf.js";
import { getFuecStyles } from "../styles";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface FuecTablesProps {
    data: {
        ruta: Array<{ origen: string; destino: string }>;
        fechaInicio: Date;
        fechaFin: Date;
    };
    contrato: {
        responsableNombre?: string | null;
        responsableCedula?: string | null;
        responsableTelefono?: string | null;
        responsableDireccion?: string | null;
    };
    vehiculo: {
        placa: string;
        modelo: number | string;
        marca: string;
        clase: string;
        numeroInterno: string;
        numeroTarjetaOperacion: string;
    };
    conductores: Array<{
        nombres: string;
        apellidos: string;
        numeroDocumento: string;
        numeroLicencia?: string | null;
        vencimientoLicencia?: string | Date | null;
    }>;
}

export const FuecTables = ({
    data,
    contrato,
    vehiculo,
    conductores,
}: FuecTablesProps) => {
    const styles = getFuecStyles();

    const fmt = (date: Date | string | number | null | undefined, token: string) => {
        if (!date) return "---";
        try {
            const d = date instanceof Date ? date : new Date(date);
            return format(d, token, { locale: es }).toUpperCase();
        } catch (e) {
            return "---";
        }
    };

    return (
        <>
            <View style={styles.routeBox}>
                {(data.ruta || []).map((r, idx: number) => (
                    <View key={idx} style={styles.routeItem}>
                        <Text style={styles.label}>{idx + 1}. ORIGEN:</Text>
                        <Text style={[styles.value, { marginRight: 15 }]}>
                            {r.origen}
                        </Text>
                        <Text style={styles.label}>DESTINO:</Text>
                        <Text style={styles.value}>{r.destino}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.tableHeaderRow}>
                <View style={[styles.thCell, { flex: 2 }]}>
                    <Text>VIGENCIA DEL CONTRATO</Text>
                </View>
                <View style={styles.thCell}>
                    <Text>DIA</Text>
                </View>
                <View style={styles.thCell}>
                    <Text>MES</Text>
                </View>
                <View style={[styles.thCell, styles.noBorder]}>
                    <Text>AÑO</Text>
                </View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tdCell, { flex: 2, textAlign: "left" }]}>
                    <Text>FECHA INICIAL:</Text>
                </View>
                <View style={styles.tdCell}>
                    <Text>{fmt(data.fechaInicio, "dd")}</Text>
                </View>
                <View style={styles.tdCell}>
                    <Text>{fmt(data.fechaInicio, "MMMM")}</Text>
                </View>
                <View style={[styles.tdCell, styles.noBorder]}>
                    <Text>{fmt(data.fechaInicio, "yyyy")}</Text>
                </View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tdCell, { flex: 2, textAlign: "left" }]}>
                    <Text>FECHA VENCIMIENTO:</Text>
                </View>
                <View style={styles.tdCell}>
                    <Text>{fmt(data.fechaFin, "dd")}</Text>
                </View>
                <View style={styles.tdCell}>
                    <Text>{fmt(data.fechaFin, "MMMM")}</Text>
                </View>
                <View style={[styles.tdCell, styles.noBorder]}>
                    <Text>{fmt(data.fechaFin, "yyyy")}</Text>
                </View>
            </View>

            <View style={styles.tableHeaderRow}>
                <View style={styles.thCell}>
                    <Text>PLACA</Text>
                </View>
                <View style={styles.thCell}>
                    <Text>MODELO</Text>
                </View>
                <View style={styles.thCell}>
                    <Text>MARCA</Text>
                </View>
                <View style={[styles.thCell, styles.noBorder]}>
                    <Text>CLASE</Text>
                </View>
            </View>
            <View style={styles.tableRow}>
                <View style={styles.tdCell}>
                    <Text style={{ fontWeight: "bold" }}>
                        {String(vehiculo?.placa ?? "---")}
                    </Text>
                </View>
                <View style={styles.tdCell}>
                    <Text>{String(vehiculo?.modelo ?? "---")}</Text>
                </View>
                <View style={styles.tdCell}>
                    <Text>{String(vehiculo?.marca ?? "---")}</Text>
                </View>
                <View style={[styles.tdCell, styles.noBorder]}>
                    <Text>{String(vehiculo?.clase ?? "---")}</Text>
                </View>
            </View>
            <View style={styles.tableRow}>
                <View style={[styles.tdCell, { flex: 1, textAlign: "left" }]}>
                    <Text style={{ fontWeight: "bold" }}>NUMERO INTERNO: </Text>
                    <Text>{String(vehiculo?.numeroInterno ?? "---")}</Text>
                </View>
                <View
                    style={[
                        styles.tdCell,
                        { flex: 1, textAlign: "left" },
                        styles.noBorder,
                    ]}
                >
                    <Text style={{ fontWeight: "bold" }}>
                        TARJETA DE OPERACIÓN Nº:{" "}
                    </Text>
                    <Text>
                        {String(vehiculo?.numeroTarjetaOperacion ?? "---")}
                    </Text>
                </View>
            </View>

            <View style={styles.tableHeaderRow}>
                <View style={{ width: 28, borderRightWidth: 1, borderColor: "#000", padding: 3 }}>
                    <Text>No.</Text>
                </View>
                <View style={{ flex: 3, borderRightWidth: 1, borderColor: "#000", padding: 3 }}>
                    <Text>NOMBRES Y APELLIDOS</Text>
                </View>
                <View style={{ flex: 1, borderRightWidth: 1, borderColor: "#000", padding: 3 }}>
                    <Text>CEDULA Nº</Text>
                </View>
                <View style={{ flex: 1, borderRightWidth: 1, borderColor: "#000", padding: 3 }}>
                    <Text>LLICENCIA Nº</Text>
                </View>
                <View style={{ flex: 1, padding: 3 }}>
                    <Text>VIGENCIA</Text>
                </View>
            </View>
            {conductores.map((c, i) => (
                <View key={i} style={styles.tableRow}>
                    <View style={{ width: 28, borderRightWidth: 1, borderColor: "#000", padding: 3 }}>
                        <Text>{i + 1}</Text>
                    </View>
                    <View style={{ flex: 3, borderRightWidth: 1, borderColor: "#000", padding: 3 }}>
                        <Text>{c.nombres} {c.apellidos}</Text>
                    </View>
                    <View style={{ flex: 1, borderRightWidth: 1, borderColor: "#000", padding: 3 }}>
                        <Text>{c.numeroDocumento}</Text>
                    </View>
                    <View style={{ flex: 1, borderRightWidth: 1, borderColor: "#000", padding: 3 }}>
                        <Text>{c.numeroLicencia ?? "S.N"}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 3 }}>
                        <Text>{fmt(c.vencimientoLicencia, "dd/MM/yyyy")}</Text>
                    </View>
                </View>
            ))}

            <View style={styles.tableRow}>
                <View style={{ width: 28, borderRightWidth: 1, borderColor: "#000", padding: 3, backgroundColor: "#f5f5f5" }}>
                    <Text style={{ fontWeight: "bold" }}>RESP.</Text>
                </View>
                <View style={{ flex: 3, borderRightWidth: 1, borderColor: "#000", padding: 3 }}>
                    <Text>{String(contrato?.responsableNombre ?? "---")}</Text>
                </View>
                <View style={{ flex: 1, borderRightWidth: 1, borderColor: "#000", padding: 3 }}>
                    <Text>{String(contrato?.responsableCedula ?? "---")}</Text>
                </View>
                <View style={{ flex: 1, borderRightWidth: 1, borderColor: "#000", padding: 3 }}>
                    <Text>{String(contrato?.responsableTelefono ?? "---")}</Text>
                </View>
                <View style={{ flex: 1, padding: 3 }}>
                    <Text>{String(contrato?.responsableDireccion ?? "---")}</Text>
                </View>
            </View>
        </>
    );
};
