import React from "react";
import { Text, View, Image } from "@react-pdf/renderer/lib/react-pdf.js";
import { getFuecStyles } from "../styles";
import { PlanillaWithIncludes, FuecAssets } from "../types";
import { ConfiguracionGlobal } from "@prisma/client";

interface FuecHeaderProps {
    data: PlanillaWithIncludes;
    config: ConfiguracionGlobal | null;
    assets?: FuecAssets;
}

export const FuecHeader = ({ data, config, assets }: FuecHeaderProps) => {
    const styles = getFuecStyles();
    
    return (
        <View style={styles.headerWrapper}>
            <Text style={styles.topLabel}>
                FICHA TECNICA DEL FORMATO UNICO DE EXTRACTO DE CONTRATO &quot;FUEC&quot;
            </Text>

            <View style={styles.headerGrid}>
                <View style={styles.logoMinisterioCol}>
                    {assets?.logoMinisterio ? (
                        <Image
                            src={assets.logoMinisterio}
                            style={{ width: 125, height: "auto" }}
                        />
                    ) : (
                        <View style={{ alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: 6,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                COLOMBIA POTENCIA DE LA VIDA
                            </Text>
                            <Text
                                style={{
                                    fontSize: 5,
                                    textAlign: "center",
                                }}
                            >
                                Ministerio de Transporte
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.titleCol}>
                    <Text style={styles.mainTitle}>
                        FORMATO UNICO DE EXTRACTO DE CONTRATO DE SERVICIO PUBLICO
                        {"\n"}
                        DE TRANSPORTE TERRESTRE AUTOMOTOR ESPECIAL
                    </Text>
                    <Text style={styles.fuecNumber}>
                        Nº {String(data.consecutivo ?? "")}
                    </Text>
                </View>

                <View style={styles.logoCoopetraesCol}>
                    {assets?.logoEmpresa ? (
                        <Image
                            src={assets.logoEmpresa}
                            style={{ width: 110, height: "auto" }}
                        />
                    ) : (
                        <Text
                            style={{
                                fontSize: 6,
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            {String(config?.nombreEmpresa ?? "COOPETRAES")}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};
