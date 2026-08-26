import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPlaca } from "@/lib/utils";
import { ConductorData } from "@/lib/types";
import { Truck } from "lucide-react";

interface DashboardHeaderProps {
    conductorData: ConductorData;
    vehiculoPlaca?: string | null;
}

export function DashboardHeader({
    conductorData,
    vehiculoPlaca,
}: DashboardHeaderProps) {
    return (
        <div>
            <div></div>
            <div></div>

            <div>
                <div>
                    {conductorData.fotoPerfil ? (
                        <Image
                            src={`/api/files/${conductorData.fotoPerfil.nombreUnico}`}
                            alt={conductorData.nombres}
                            fill
                            
                            unoptimized
                        />
                    ) : (
                        <span>
                            {conductorData.nombres[0]}
                            {conductorData.apellidos[0]}
                        </span>
                    )}
                </div>
                <div>
                    <p>
                        Centro de Operaciones
                    </p>
                    <h1>
                        {conductorData.nombres} {conductorData.apellidos}
                    </h1>
                    <div>
                        <Badge>
                            Estatus: Activo
                        </Badge>
                        <div></div>
                        <span>
                            {vehiculoPlaca ? (
                                <>
                                    <Truck />
                                    <span>
                                        Placa: {formatPlaca(vehiculoPlaca)}
                                    </span>
                                </>
                            ) : (
                                "Sin vehículo asignado"
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
