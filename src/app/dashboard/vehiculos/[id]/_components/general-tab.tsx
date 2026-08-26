"use client";

import { VehiculoWithRelations, PreoperacionalWithRelations } from "@/types";
import { OperabilityControlPanel } from "./operability-control-panel";
import { VehicleInfoCard } from "./vehicle-info-card";

interface GeneralTabProps {
    vehiculo: VehiculoWithRelations;
    preoperacionales: PreoperacionalWithRelations[];
}

export function GeneralTab({ vehiculo, preoperacionales }: GeneralTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
            <div className="lg:col-span-9 animate-in slide-in-from-left-4 duration-700">
                <OperabilityControlPanel
                    vehiculoId={vehiculo.id}
                    placa={vehiculo.placa}
                    estadoActual={
                        vehiculo.estadoOperativo as
                            | "OPERATIVO"
                            | "NO_OPERATIVO"
                            | "BLOQUEADO_ADMIN"
                            | "OPERATIVO_CON_ALERTAS"
                            | "EVALUANDO"
                            | "OPERATIVO_OVERRIDE"
                    }
                    bloqueadoManualmente={vehiculo.bloqueadoManualmente}
                    razonBloqueo={vehiculo.razonBloqueo}
                    overrideActivo={vehiculo.overrideActivo}
                    justificacionOverride={vehiculo.justificacionOverride}
                    preoperacionales={preoperacionales}
                />
            </div>
            <div className="lg:col-span-3 animate-in slide-in-from-right-4 duration-700 h-full">
                <VehicleInfoCard vehiculo={vehiculo} />
            </div>
        </div>
    );
}
