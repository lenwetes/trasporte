import Link from "next/link";
import { ExportSiniestrosButton } from "@/components/export-siniestros-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import type { ConfiguracionGlobal } from "@prisma/client";
import type { SiniestroWithRelations } from "@/types";
import { Button } from "@/components/ui/button";

interface NovedadesHeaderProps {
    activeTab: string;
    siniestros: SiniestroWithRelations[];
    companyConfig: ConfiguracionGlobal | null;
}

import { ShieldAlert, Plus } from "lucide-react";

export function NovedadesHeader({
    activeTab,
    siniestros,
    companyConfig,
}: NovedadesHeaderProps) {
    return (
        <DashboardHeader
            title="Incidencias & Tránsito"
            tagline="Centro de Monitoreo"
            subtitle="Gestión unificada de novedades, multas y siniestros viales."
            icon={ShieldAlert}
            iconGradient="from-indigo-600 to-violet-800"
            
            actions={
                <div className="flex items-center gap-4">
                    {activeTab === "novedades" && (
                        <Link href="/dashboard/novedades/nuevo">
                            <Button variant="premium" className="h-11">
                                <Plus size={16} className="text-accent" />
                                Registrar Novedad
                            </Button>
                        </Link>
                    )}
                    {activeTab === "siniestros" && (
                        <div className="flex items-center gap-4">
                            <ExportSiniestrosButton
                                siniestros={siniestros}
                                companyConfig={companyConfig}
                            />
                            <Link href="/dashboard/siniestros/nuevo">
                                <Button variant="premium" className="h-11 bg-red-600 hover:bg-red-700 shadow-[0_20px_50px_rgba(220,38,38,0.2)] hover:shadow-[0_30px_60px_rgba(220,38,38,0.3)]">
                                    <Plus size={16} />
                                    Informar Siniestro
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            }
        />
    );
}
