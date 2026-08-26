import { getUsuarios, getVehiculosList } from "@/actions";
import { SimitUpdateModule } from "../_components/simit-update-module";
import Link from "next/link";
import { auth } from "@/auth";
import { ArrowLeft, ShieldAlert, Zap, Globe, Lock, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SimitUpdatePage() {
    const session = await auth();
    const userRole = session?.user?.rol;

    if (userRole !== "ADMIN" && userRole !== "SECRETARIA") {
        return (
            <div className="h-[600px] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <ShieldAlert className="h-12 w-12 text-red-600 mx-auto" />
                    <h2 className="text-xl font-black uppercase tracking-widest text-primary">Acceso Restringido</h2>
                    <p className="text-xs font-bold text-slate-900 uppercase">Solo administradores pueden ejecutar auditorías externas SIMIT.</p>
                </div>
            </div>
        );
    }

    const [usuariosRes, vehiculosRes] = await Promise.all([
        getUsuarios(),
        getVehiculosList(),
    ]);

    const usuariosList = (usuariosRes.data as any)?.data || [];
    const vehiculosList = (vehiculosRes.data as any) || [];

    const conductores = usuariosList
        .filter((u: any) => u.rol === "CONDUCTOR")
        .map((c: any) => ({
            id: c.id,
            nombre: `${c.nombres} ${c.apellidos}`,
            documento: c.numeroDocumento || ""
        }));

    const vehiculos = vehiculosList.map((v: any) => ({
        id: v.id,
        placa: v.placa
    }));

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000 p-8 lg:p-12 bg-slate-50/10 min-h-screen">
            {/* Header Cyber-Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 border border-white/5 p-12 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="flex items-center gap-8 relative z-10">
                    <div className="h-20 w-20 flex items-center justify-center border border-white/10 bg-white/5 text-accent shadow-2xl backdrop-blur-xl group-hover:scale-110 transition-transform duration-700">
                        <Zap className="h-10 w-10 text-accent animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-[2px] w-10 bg-accent" />
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-accent">Auditoría SIMIT v4.2</span>
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-white flex items-center gap-4 italic leading-none">
                            Actualización de Datos
                        </h1>
                        <div className="flex items-center gap-6 mt-4">
                            <div className="flex items-center gap-2 text-[9px] font-bold text-white uppercase tracking-widest">
                                <Globe className="h-3 w-3 text-accent/40" />
                                Conexión Cifrada
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-white uppercase tracking-widest">
                                <Lock className="h-3 w-3 text-accent/40" />
                                Protocolo Seguro
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-white uppercase tracking-widest">
                                <Cpu className="h-3 w-3 text-accent/40" />
                                AI Scraper Engine
                            </div>
                        </div>
                    </div>
                </div>

                <Link href="/dashboard/novedades">
                    <Button variant="outline" className="h-14 border-white/10 rounded-none px-10 text-[11px] font-black uppercase tracking-[0.3em] gap-4 bg-transparent text-white hover:bg-white hover:text-slate-900 transition-all duration-500 overflow-hidden group relative">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-2" />
                        Panel Principal
                    </Button>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto pb-20">
                <SimitUpdateModule 
                    conductores={conductores}
                    vehiculos={vehiculos}
                />
            </div>
        </div>
    );
}
