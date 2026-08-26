import React from "react";
import { Text, View } from "@react-pdf/renderer/lib/react-pdf.js";
import { getFuecStyles } from "../styles";

import {
    ConfiguracionGlobal,
    PlanillaFUEC,
    ContratoEmpresa,
} from "@prisma/client";

interface FuecDataRowsProps {
    data: PlanillaFUEC;
    config: ConfiguracionGlobal;
    contrato: ContratoEmpresa;
}

export const FuecDataRows = ({ data, config, contrato }: FuecDataRowsProps) => {
    const styles = getFuecStyles();

    return (
        <>
            <View style={styles.dataRow}>
                <Text style={styles.label}>RAZON SOCIAL:</Text>
                <Text style={styles.value}>
                    {String(
                        config.nombreEmpresa ??
                            'COOPERATIVA DE TRANSPORTE ESPECIAL DE SUCRE "COOPETRAES"',
                    )}
                </Text>
            </View>
            <View style={styles.dataRow}>
                <Text style={styles.label}>NIT:</Text>
                <Text style={styles.value}>{String(config.nit ?? "823.001.596-8")}</Text>
            </View>
            <View style={styles.dataRow}>
                <Text style={styles.label}>CONTRATO N°:</Text>
                <Text style={styles.value}>
                    {String(contrato?.numeroContrato ?? "---")}
                </Text>
            </View>
            <View style={styles.dataRow}>
                <Text style={styles.label}>CONTRATANTE:</Text>
                <Text style={styles.value}>{String(contrato?.cliente ?? "---")}</Text>
            </View>
            <View style={styles.dataRow}>
                <Text style={styles.label}>NIT/CC:</Text>
                <Text style={styles.value}>{String(contrato?.nitCliente ?? "S.N")}</Text>
            </View>
            <View style={styles.dataRow}>
                <Text style={styles.label}>OBJETO DEL CONTRATO:</Text>
                <Text style={[styles.value, { fontSize: 6 }]}>
                    {String(data.objetoViaje ?? contrato?.objeto ?? "---")}
                </Text>
            </View>
        </>
    );
};
