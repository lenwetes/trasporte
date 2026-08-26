import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FuecConfigClient } from "@/components/modules/fuec/config/config-client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FileText, ShieldAlert, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FuecConfigPage() {
    const session = await auth();
    if (session?.user?.rol !== "ADMIN") redirect("/dashboard");

    const [rawResoluciones, rawContratos] = await Promise.all([
        prisma.resolucionFUEC.findMany({ orderBy: { creadoEn: "desc"  }}),
        prisma.contratoEmpresa.findMany({ orderBy: { creadoEn: "desc"  }}),
    ]);

    // Saneamiento profundo para evitar problemas de serialización (Decimal, Date, etc.)
    const resoluciones = JSON.parse(JSON.stringify(rawResoluciones));
    const contratos = JSON.parse(JSON.stringify(rawContratos));

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <DashboardHeader 
                title="Configuración FUEC"
                tagline="CONTROL DOCUMENTAL MINTRANSPORTE"
                subtitle="Gestión de Resoluciones Ministeriales y Contratos de Empresa"
                icon={FileText}
                actions={
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/fuec">
                            <Button variant="outline" className="h-16 rounded-none border-primary/10 text-[10px] font-black uppercase tracking-widest px-6 hover:bg-slate-50 transition-colors bg-white">
                                <ChevronLeft className="h-4 w-4 mr-2 text-slate-900" />
                                Volver al FUEC
                            </Button>
                        </Link>
                        <div className="bg-slate-50 border border-primary/10 px-6 py-4 flex flex-col items-end h-16 justify-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 mb-1">
                            ESTATUS MÓDULO
                        </p>
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="h-4 w-4 text-accent" />
                            <p className="text-xl font-black font-mono tracking-tighter text-primary">
                                Operativo
                            </p>
                        </div>
                        </div>
                    </div>
                }
            />

            <div className="px-6 md:px-10 pb-24">
                <FuecConfigClient resoluciones={resoluciones} contratos={contratos} />
            </div>
        </div>
    );
}
