import { VinculacionForm } from "@/components/forms/vinculacion-form";
import { getVehiculoById } from "@/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VehiculoWithRelations } from "@/types";
import { Car, ChevronLeft, Calendar, UserPlus } from "lucide-react";

interface NuevaVinculacionPageProps {
    params: Promise<{ id: string }>;
}

export default async function NuevaVinculacionPage({
    params,
}: NuevaVinculacionPageProps) {
    const { id } = await params;
    const result = await getVehiculoById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const vehiculo = result.data as VehiculoWithRelations;

    return (
        <div style={{ padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {/* Header Container */}
                <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "40px" }}>
                    <Link href={`/dashboard/vehiculos/${id}`} style={{ textDecoration: "none" }}>
                        <button style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "16px",
                            backgroundColor: "white",
                            color: "#0f172a",
                            border: "1px solid #e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            transition: "all 0.2s"
                        }}>
                            <ChevronLeft size={20} />
                        </button>
                    </Link>
                    
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                            <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: "#eff6ff", color: "#3b82f6" }}>
                                <UserPlus size={16} />
                            </div>
                            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "900", color: "#0f172a" }}>
                                Vincular Conductor a {" "}
                                <span style={{ color: "#3b82f6" }}>
                                    {vehiculo.placa}
                                </span>
                            </h1>
                        </div>
                        <p style={{ margin: 0, fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                            Asigna un conductor responsable al vehículo para operaciones y cumplimiento.
                        </p>
                    </div>
                </div>

                <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "32px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                    <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "white", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                            <Car size={24} />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: "12px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>
                                Vehículo Seleccionado
                            </p>
                            <p style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                                {vehiculo.marca} - {vehiculo.placa}
                            </p>
                        </div>
                    </div>

                    <VinculacionForm vehiculoId={id} />
                </div>
            </div>
        </div>
    );
}
