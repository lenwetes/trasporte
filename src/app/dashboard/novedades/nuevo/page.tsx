import { getUsuarios, getVehiculosList } from "@/actions";
import { NovedadForm } from "@/components/forms/novedad-form";
import Link from "next/link";
import { auth } from "@/auth";
import { Usuario } from "@prisma/client";
import { ArrowLeft, Bell, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function NuevaNovedadPage() {
    const session = await auth();
    const userRole = session?.user?.rol;
    const userId = session?.user?.id;

    const [usuariosRes, vehiculosRes] = await Promise.all([
        getUsuarios(),
        getVehiculosList(),
    ]);

    // Extracción correcta del array de conductores (corrigiendo el error usuariosList.filter)
    const usuariosList = (usuariosRes.data as any)?.data || [];
    const vehiculosList = (vehiculosRes.data as any) || [];

    let conductores = usuariosList.filter((u: any) => u.rol === "CONDUCTOR");
    const vehiculos = vehiculosList;

    // Si no es ADMIN ni SECRETARIA, restringir la lista de conductores al usuario actual si es conductor
    if (userRole !== "ADMIN" && userRole !== "SECRETARIA" && userId) {
        const currentUser = conductores.find((c: any) => c.id === userId);
        conductores = currentUser ? [currentUser] : [];
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000 p-8 lg:p-12 bg-slate-50/10 min-h-screen">
            {/* Header de Configuración Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-primary/10 p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 flex items-center justify-center border border-primary/10 bg-slate-50 text-secondary shadow-inner group-hover:scale-110 transition-transform">
                        <Bell className="h-8 w-8 text-secondary shadow-sm" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="h-1 w-6 bg-secondary/30" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary">Gestión de Riesgos PESV</span>
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-primary flex items-center gap-3 italic">
                            Reportar Novedad
                        </h1>
                        <p className="text-xs font-bold text-slate-900 mt-1 uppercase tracking-widest leading-relaxed">
                            Auditado por coordinación operativa <span className="text-accent underline font-mono">CÓDIGO:OPER_NOV</span>
                        </p>
                    </div>
                </div>

                <Link href="/dashboard/novedades">
                    <Button variant="outline" className="h-14 border-primary/10 rounded-none px-8 text-[11px] font-black uppercase tracking-[0.2em] gap-3 bg-white hover:bg-slate-50 transition-all hover:shadow-premium hover:-translate-y-0.5">
                        <ArrowLeft className="h-4 w-4 text-primary opacity-40" />
                        Historial de Novedades
                    </Button>
                </Link>
            </div>

            {/* Formulario Maestro Container */}
            <div className="max-w-6xl mx-auto bg-white border border-primary/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 lg:p-16">
                <div className="mb-12 border-b border-primary/5 pb-10 flex items-start gap-8">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-secondary" />
                            <h2 className="text-sm font-black text-primary uppercase tracking-widest">Protocolo de Registro e Incidencias</h2>
                        </div>
                        <p className="text-[13px] font-medium text-slate-900 leading-relaxed max-w-2xl">
                            Ingrese los detalles técnicos de la incidencia. El sistema asignará automáticamente una ID de seguimiento
                            y notificará a la coordinación operativa y de mantenimiento para la evaluación de seguridad bajo la normativa PESV institucional.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <NovedadForm
                        conductores={conductores}
                        vehiculos={vehiculos}
                        defaultConductorId={
                            userRole !== "ADMIN" && userRole !== "SECRETARIA"
                                ? userId
                                : undefined
                        }
                    />
                </div>
            </div>
        </div>
    );
}
