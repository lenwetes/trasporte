import React from "react";
import { Text, View, Image } from "@react-pdf/renderer/lib/react-pdf.js";
import { getFuecStyles } from "../styles";
import { FuecAssets } from "../types";
import { ConfiguracionGlobal } from "@prisma/client";

interface FuecFooterProps {
    config: ConfiguracionGlobal;
    assets?: FuecAssets;
    qrDataUrl?: string;
}

export const FuecFooter = ({ config, assets, qrDataUrl }: FuecFooterProps) => {
    const styles = getFuecStyles();

    return (
        <>
            <View
                style={[
                    styles.signatureBlock,
                    { borderTopWidth: 1, borderColor: "#000" },
                ]}
            >
                <View style={styles.contactCol}>
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 6,
                            marginBottom: 2,
                        }}
                    >
                        {String(
                            config.direccion ?? "Calle Principal #45-20, Sincelejo",
                        )}
                    </Text>
                    <Text style={{ fontSize: 6 }}>
                        Teléfono: {String(config.telefono ?? "6052820000")}
                    </Text>
                    <Text style={{ fontSize: 6 }}>
                        E-mail: {String(config.email ?? "gerencia@coopetraes.com")}
                    </Text>
                    <Text
                        style={{
                            marginTop: 3,
                            fontWeight: "bold",
                            fontSize: 6,
                        }}
                    >
                        Sincelejo (Sucre)
                    </Text>
                </View>

                <View style={styles.signatureCol}>
                    <View
                        style={{
                            alignItems: "center",
                            position: "relative",
                            width: "100%",
                            minHeight: 85,
                        }}
                    >
                        {assets?.firmaGerente && (
                            <Image
                                src={assets.firmaGerente}
                                style={{
                                    width: 150,
                                    height: 85,
                                    objectFit: "contain",
                                }}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            width: "75%",
                            borderBottomWidth: 1,
                            borderColor: "#000",
                            marginBottom: 2,
                        }}
                    />
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 7,
                            textAlign: "center",
                        }}
                    >
                        {String(config.nombrePresidente ?? "REPRESENTANTE LEGAL")}
                    </Text>
                    <Text style={{ fontSize: 6, textAlign: "center" }}>
                        GERENTE
                    </Text>
                </View>
            </View>

            <View style={styles.externalFooter}>
                <View style={styles.qrCol}>
                    {qrDataUrl && (
                        <Image
                            src={qrDataUrl}
                            style={{ width: 60, height: 60 }}
                        />
                    )}
                    <Text
                        style={{
                            fontSize: 5,
                            marginTop: 2,
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        VALIDACIÓN DIGITAL
                    </Text>
                </View>

                <View style={styles.watermarkArea} />

                <View style={styles.superCol}>
                    {assets?.logoSuper ? (
                        <Image
                            src={assets.logoSuper}
                            style={{ width: 110, height: "auto" }}
                        />
                    ) : (
                        <View style={{ alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: 4,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                VIGILADO
                            </Text>
                            <Text
                                style={{
                                    fontSize: 4,
                                    textAlign: "center",
                                }}
                            >
                                Supertransporte
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </>
    );
};
