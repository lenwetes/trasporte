import Link from "next/link";
import { ConductorData } from "@/lib/types";
import { ShieldCheck } from "lucide-react";

interface LicenseCardProps {
    conductorData: ConductorData;
}

export function LicenseCard({ conductorData }: LicenseCardProps) {
    return (
        <div>
            <div></div>
            <div>
                <ShieldCheck />
            </div>

            <div>
                <div>
                    <div>
                        <p>
                            Credencial Operativa
                        </p>
                        <h2>
                            {conductorData.numeroLicencia || "N/A"}
                        </h2>
                    </div>
                    <div>
                        <p>
                            Categorías Habilitadas
                        </p>
                        <div>
                            {conductorData.licencias &&
                            conductorData.licencias.length > 0 ? (
                                conductorData.licencias.map((lic, idx) => {
                                    const daysUntilExpiry = Math.ceil(
                                        (new Date(
                                            lic.fechaVencimiento,
                                        ).getTime() -
                                            new Date().getTime()) /
                                            (1000 * 60 * 60 * 24),
                                    );
                                    let statusColor =
                                        "bg-white/5 border-white/10 hover:bg-white/10";
                                    let textColor =
                                        "text-emerald-400 group-hover/licitem:text-emerald-300";
                                    let badgeColor =
                                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                                    let alertLabel = null;

                                    if (daysUntilExpiry < 0) {
                                        statusColor =
                                            "bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10";
                                        textColor =
                                            "text-rose-500 group-hover/licitem:text-rose-400";
                                        badgeColor =
                                            "bg-rose-500/20 text-rose-500 border border-rose-500/30";
                                        alertLabel = "VENCIDO";
                                    } else if (daysUntilExpiry <= 30) {
                                        statusColor =
                                            "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10";
                                        textColor =
                                            "text-amber-500 group-hover/licitem:text-amber-400";
                                        badgeColor =
                                            "bg-amber-500/20 text-amber-500 border border-amber-500/30";
                                        alertLabel = "POR VENCER";
                                    }

                                    return (
                                        <div
                                            key={idx}>
 <div>
                                                <span>
                                                    {lic.categoria}
                                                </span>
                                                <span>
                                                    {lic.servicio}
                                                </span>
                                            </div>
                                            <p>
                                                Vence:{" "}
                                                <span>
                                                    {new Date(
                                                        lic.fechaVencimiento,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </p>
                                            {alertLabel && (
                                                <div>
                                                    <span>
                                                        ⚠ {alertLabel}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p>
                                    No se encontraron categorías registradas.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <div></div>
                        <p>
                            Su documentación está{" "}
                            <span>
                                digitalizada y verificada
                            </span>{" "}
                            para operación nacional v2.4.
                        </p>
                    </div>
                    <Link href="/dashboard/perfil">
                        <button style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 16px",
                            backgroundColor: "#10b981",
                            color: "white",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600"
                        }}>
                            Ver Perfil Completo
                            <ShieldCheck size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
