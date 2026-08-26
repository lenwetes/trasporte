import React from "react";
import { Document, Page, Image, View } from "@react-pdf/renderer";
import { getFuecStyles } from "./fuec/styles";
import { FuecPDFProps } from "./fuec/types";
import { FuecHeader } from "./fuec/components/fuec-header";
import { FuecDataRows } from "./fuec/components/fuec-data-rows";
import { FuecTables } from "./fuec/components/fuec-tables";
import { FuecFooter } from "./fuec/components/fuec-footer";
import { Usuario, Vehiculo } from "@prisma/client";

export { type FuecAssets, type FuecPDFProps } from "./fuec/types";

/**
 * Extiende el tipo Vehiculo de Prisma con campos reglamentarios FUEC.
 */
type VehiculoConCamposFUEC = Vehiculo & {
    numeroInterno?: string | null;
    numeroTarjetaOperacion?: string | null;
};

export const FuecPDFDocument = ({
    data,
    qrDataUrl,
    config,
    assets,
}: FuecPDFProps) => {
    const styles = getFuecStyles();

    // Procesamiento previo de datos
    const conductores = [data.conductor1, data.conductor2, data.conductor3]
        .filter((c): c is Usuario => Boolean(c))
        .map((c) => ({
            nombres: c.nombres || "",
            apellidos: c.apellidos || "",
            numeroDocumento: c.numeroDocumento || "",
            numeroLicencia: c.numeroLicencia ?? undefined,
            vencimientoLicencia: undefined,
        }));

    const contrato = data.contrato;
    const vehiculo = data.vehiculo as VehiculoConCamposFUEC;

    return (
        <Document title={`FUEC_${String(data.consecutivo ?? "")}`}>
            <Page size="A4" style={styles.page}>
                {/* ── Marca de agua ── */}
                {assets?.logoEmpresa && (
                    <Image src={assets.logoEmpresa} style={styles.watermark} />
                )}

                {/* ══ CONTENEDOR PRINCIPAL CON BORDE ══════════ */}
                <View style={{ borderWidth: 1, borderColor: "#000" }}>
                    <FuecHeader data={data} config={config} assets={assets} />

                    <FuecDataRows
                        data={data}
                        config={config!}
                        contrato={contrato}
                    />

                    <FuecTables
                        data={{
                            ...data,
                            ruta:
                                (data.ruta as unknown as {
                                    origen: string;
                                    destino: string;
                                }[]) || [],
                        }}
                        contrato={contrato}
                        vehiculo={{
                            placa: vehiculo.placa,
                            modelo: vehiculo.modelo || "---",
                            marca: vehiculo.marca || "---",
                            clase: vehiculo.clase,
                            numeroInterno: vehiculo.numeroInterno ?? "---",
                            numeroTarjetaOperacion:
                                vehiculo.numeroTarjetaOperacion ?? "---",
                        }}
                        conductores={conductores}
                    />
                </View>

                {/* Separamos el footer externo que va fuera del recuadro principal */}
                <FuecFooter
                    config={config!}
                    assets={assets}
                    qrDataUrl={qrDataUrl}
                />
            </Page>
        </Document>
    );
};
