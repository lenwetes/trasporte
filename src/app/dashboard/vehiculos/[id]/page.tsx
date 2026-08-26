import { getVehiculoById, getPreoperacionalesVehiculo } from "@/actions";
import { notFound } from "next/navigation";
import { VehiculoWithRelations, PreoperacionalWithRelations } from "@/types";
import { VehicleDetailsClient } from "./_components/vehicle-details-client";

interface VehiculoDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function VehiculoDetailPage({
    params,
}: VehiculoDetailPageProps) {
    const { id } = await params;
    const result = await getVehiculoById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const vehiculo = result.data as VehiculoWithRelations;

    const preRes = await getPreoperacionalesVehiculo(id);
    const preoperacionales = preRes.success ? preRes.data : [];

    return (
        <div>
            {/* Ambient Background */}
            <div />

            <VehicleDetailsClient
                vehiculo={vehiculo}
                preoperacionales={
                    preoperacionales as PreoperacionalWithRelations[]
                }
            />
        </div>
    );
}
