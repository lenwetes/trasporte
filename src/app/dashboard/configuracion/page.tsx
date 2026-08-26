import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getConfiguracionGlobal, getReglasAlerta } from "@/actions";

import { ReglaAlerta, ConfiguracionGlobal as DBConfig } from "@prisma/client";
import { ConfiguracionGlobal as SchemaConfig } from "@/lib/validations";

import { ConfiguracionClient } from "./_components/configuracion-client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Settings } from "lucide-react";

export default async function ConfiguracionPage() {
    const session = await auth();

    // Solo permitir acceso a administradores
    if (session?.user?.rol !== "ADMIN") {
        redirect("/dashboard");
    }

    const { data } = await getConfiguracionGlobal();
    const config = data as DBConfig | null;
    const reglasResult = await getReglasAlerta();
    const reglas = reglasResult.success
        ? (reglasResult.data as ReglaAlerta[]) || []
        : [];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <DashboardHeader
                title="Panel de Control Maestro"
                tagline="CENTRO DE CONFIGURACIÓN Y SEGURIDAD"
                subtitle="Administración de parámetros globales, conectividad y mantenimiento profundo del ecosistema."
                icon={Settings}
            />

            <div className="px-6 md:px-10 pb-24">
                <ConfiguracionClient config={config} reglas={reglas} />
            </div>
        </div>
    );
}
