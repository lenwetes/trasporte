import { getVehiculoById } from "@/actions";
import { VehiculoForm } from "@/components/forms/vehiculo-form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VehiculoWithRelations } from "@/types";

interface EditarVehiculoPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditarVehiculoPage({
    params,
}: EditarVehiculoPageProps) {
    const { id } = await params;
    const result = await getVehiculoById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const vehiculo = result.data as VehiculoWithRelations;

    const ownerName = vehiculo.propietarioUser
        ? `${vehiculo.propietarioUser.nombres} ${vehiculo.propietarioUser.apellidos}`
        : vehiculo.propietario ?? "";

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", padding: "0 20px" }}>
                <Link href="/dashboard/vehiculos" style={{ textDecoration: "none" }}>
                    <button
                        type="button"
                        style={{
                            padding: "8px 12px",
                            backgroundColor: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        ← Volver
                    </button>
                </Link>
                <div>
                    <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "bold", color: "#0f172a" }}>
                        Editar Vehículo{" "}
                        <span style={{ color: "#ea580c" }}>
                            {vehiculo.placa}
                        </span>
                    </h1>
                    <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                        Actualiza la información técnica y de modalidad
                    </p>
                </div>
            </div>

            <div>
                <VehiculoForm
                    ownerDisplayName={ownerName}
                    vehicleId={id}
                    initialData={{
                        placa: vehiculo.placa,
                        marca: vehiculo.marca ?? "",
                        modelo: vehiculo.modelo ?? "",
                        anho: vehiculo.anho ?? undefined,
                        color: vehiculo.color ?? "",
                        cilindraje: vehiculo.cilindraje ?? "",
                        peso: vehiculo.peso ?? "",
                        capacidadPuestos: vehiculo.capacidadPuestos ?? undefined,
                        numeroMotor: vehiculo.numeroMotor ?? "",
                        numeroChasis: vehiculo.numeroChasis ?? "",
                        lugarExpedicion: vehiculo.lugarExpedicion ?? "",
                        clase: vehiculo.clase ?? "OTRO",
                        modalidad: vehiculo.modalidad ?? undefined,
                        propietario: vehiculo.propietario ?? "",
                        propietarioId: vehiculo.propietarioId ?? undefined,
                        kilometrajeActual: vehiculo.kilometrajeActual ?? undefined,
                    }}
                />
            </div>
        </div>
    );
}
