import { Truck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPlaca } from "@/lib/utils";
import { DocumentAlert } from "@/lib/alerts";
import { DashboardVehicle } from "@/lib/types";

interface VehicleStatusCardProps {
    vehiculo:
        | (DashboardVehicle & {
              maintenanceAlerts?: Array<{ planNombre: string }>;
              razon: string;
          })
        | null;
}

export function VehicleStatusCard({ vehiculo }: VehicleStatusCardProps) {
    if (!vehiculo) {
        return (
            <div>
                <div>
                    <Truck />
                </div>
                <div>
                    <p>
                        No tienes vehículo asignado
                    </p>
                    <p>
                        Contacta con administración para vincular tu ficha
                        operativa.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                <Truck />
            </div>

            <div>
                <div>
                    {formatPlaca(vehiculo.placa)}
                </div>
                <Badge>
                    {vehiculo.alertLevel === "red"
                        ? "REVISIÓN URGENTE"
                        : "OPERATIVO"}
                </Badge>
            </div>

            <div>
                <div>
                    <p>
                        Clase de Vehículo
                    </p>
                    <div>
                        <p>
                            {vehiculo.marca} {vehiculo.modelo}
                        </p>
                        <p>
                            Modelo {vehiculo.anho}
                        </p>
                    </div>
                </div>
                <div>
                    <p>
                        Titular de Flota
                    </p>
                    <p>
                        {vehiculo.propietario}
                    </p>
                    <p>
                        Vinculación Activa
                    </p>
                </div>
            </div>

            <div>
                <div>
                    <p>
                        <ShieldCheck />
                        Auditoría Documental
                    </p>
                    <span>
                        Check v2.4
                    </span>
                </div>

                <div>
                    {vehiculo.alerts?.map(
                        (alert: DocumentAlert, idx: number) => (
                            <div
                                key={idx}>
 <span>
                                    {alert.tipo}
                                </span>
                                <Badge>
                                    {alert.daysUntilExpiry}D
                                </Badge>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}

