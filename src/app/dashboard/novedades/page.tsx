import { getNovedades } from "@/actions";
import { getSiniestros } from "@/actions/siniestros";
import { auth } from "@/auth";
import { AlertCircle, Plus, ShieldAlert, History, Activity, Search, Filter, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NovedadesTabsNav } from "./_components/novedades-tabs-nav";
import { NovedadesTabView } from "./_components/novedades-tab-view";
import { SiniestrosTabView } from "./_components/siniestros-tab-view";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default async function NovedadesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const activeTab = (params.tab as string) || "novedades";
    const tipo = (params.tipo as string) || "TODOS";
    const viewSiniestros = (params.view as string) || "activos";
    const query = (params.q as string) || "";

    const session = await auth();
    const userRole = session?.user?.rol;

    // Ejecución segura de consultas
    const [novedadesRes, siniestrosRes] = await Promise.all([
        activeTab === "novedades"
            ? getNovedades(1, 100, { tipo: tipo as any, query })
            : Promise.resolve({ data: [] }),
        activeTab === "siniestros"
            ? getSiniestros(1, 100, {
                  estado: viewSiniestros === "activos" ? "PENDIENTE" : "CERRADO",
                  query,
              })
            : Promise.resolve({ data: [] }),
    ]);

    // Serialización profunda para evitar errores de Decimal objects (Prisma)
    const dataNovedades = JSON.parse(JSON.stringify(novedadesRes.data || []));
    const dataSiniestros = JSON.parse(JSON.stringify(siniestrosRes.data || []));

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header de la Página */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white border border-primary/10 p-8 shadow-md">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 flex items-center justify-center border border-primary/10 bg-slate-50 text-red-600 shadow-inner">
                        <AlertCircle className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-primary flex items-center gap-3">
                            <ShieldAlert className="h-8 w-8 text-red-600" />
                            Eventos Operativos
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mt-1.5 flex items-center gap-2">
                            <span className="h-1 w-8 bg-red-600/30" />
                            Monitoreo de Novedades & Siniestros
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <form action="/dashboard/novedades" method="GET" className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input 
                            name="q"
                            defaultValue={query}
                            placeholder="Buscar..." 
                            className="pl-9 h-11 w-64 rounded-none border-primary/10 text-xs font-bold uppercase bg-slate-50/50"
                        />
                        <input type="hidden" name="tab" value={activeTab} />
                    </form>

                    {(userRole === "ADMIN" || userRole === "SECRETARIA") && (
                        <Link href="/dashboard/novedades/actualizacion">
                            <Button variant="outline" className="h-11 rounded-none text-[11px] font-black uppercase tracking-widest px-8 border-primary/10 hover:bg-slate-50 transition-all gap-2 group">
                                <Zap className="h-4 w-4 text-accent fill-accent animate-pulse" />
                                Actualización SIMIT
                            </Button>
                        </Link>
                    )}

                    <Link href={`/dashboard/${activeTab === "novedades" ? "novedades" : "siniestros"}/nuevo`}>
                        <Button 
                            className={cn(
                                "h-11 rounded-none text-[11px] font-black uppercase tracking-widest px-8 shadow-2xl transition-all hover:scale-105 active:scale-95",
                                activeTab === "novedades" ? "bg-primary text-white" : "bg-red-600 text-white"
                            )}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Registro
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Area de Contenido */}
            <div className="bg-white border border-primary/10 shadow-2xl min-h-[800px] flex flex-col overflow-hidden">
                <div className="border-b border-primary/5 bg-slate-50/30 p-3">
                    <NovedadesTabsNav activeTab={activeTab} />
                </div>

                <div className="flex-1 p-0 flex flex-col">
                    {activeTab === "novedades" && (
                        <div className="animate-in fade-in duration-500 h-full">
                            <NovedadesTabView
                                novedades={dataNovedades}
                                userId={session?.user?.id}
                                userRole={userRole}
                                initialDoc=""
                                initialRevDate={null}
                                query={query}
                                tipo={tipo}
                            />
                        </div>
                    )}

                    {activeTab === "siniestros" && (
                        <div className="animate-in fade-in duration-500 h-full p-8 lg:p-12">
                            <SiniestrosTabView 
                                siniestros={dataSiniestros}
                                viewSiniestros={viewSiniestros}
                                query={query}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
