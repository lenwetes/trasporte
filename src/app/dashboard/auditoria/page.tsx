import { getAuditLogs } from "@/actions/audit";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ShieldAlert, Database, CalendarIcon, ActivitySquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function AuditoriaPage() {
    const result = await getAuditLogs();
    const logs = (result.success && Array.isArray(result.data) ? result.data : []) as any[];

    return (
        <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "20px" }}>
            <DashboardHeader
                title="Centro de Tracking"
                tagline="Protocolo de Auditoría"
                subtitle="Monitoreo Criptográfico de Accesos y Transacciones de Bajo Nivel"
                icon={ShieldAlert}
                iconGradient="from-slate-700 to-primary"
            />

            <div className="mt-8 space-y-6">
                {/* Intel Bar: Actions */}
                <div className="bg-white border border-primary/10 flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto text-center sm:text-left">
                        <div className="space-y-1 py-1 px-4 border-l-2 border-accent">
                            <div className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Vector de Riesgo</div>
                            <div className="flex items-center gap-2">
                                <ActivitySquare className="h-4 w-4 text-accent" />
                                <span className="text-xl font-black text-primary tracking-tighter uppercase">
                                    {logs.length} EVENTOS
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-4 py-2 border border-primary/10 bg-slate-50 flex items-center gap-2">
                            <Database className="h-3 w-3" /> RETENCIÓN SEGURA IMBORRABLE
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-primary/10 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-primary/10 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                <th className="p-4 border-r border-primary/5 w-64">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-3 w-3" /> Timestamp / Nodo
                                    </div>
                                </th>
                                <th className="p-4 border-r border-primary/5 w-64">
                                    Vector de Acción
                                </th>
                                <th className="p-4">
                                    Traza de Datos Criptográficos
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-bold text-primary divide-y divide-primary/5">
                            {logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-primary/[0.02] transition-colors">
                                    <td className="p-4 border-r border-primary/5 align-top">
                                        <div className="space-y-1">
                                            <div className="text-[11px] font-black uppercase text-primary tracking-tight">
                                                {format(new Date(log.creadoEn), "MMM d, yyyy HH:mm:ss", { locale: es })}
                                            </div>
                                            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest truncate max-w-[200px]">
                                                {log.id}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 border-r border-primary/5 align-top">
                                        <Badge variant="outline" className="rounded-none border-primary/20 text-accent font-black text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-slate-50">
                                            {log.accion}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-top">
                                        <p className="text-[11px] uppercase tracking-wide leading-relaxed font-mono bg-slate-50/50 p-3 border border-primary/5 text-primary/70">
                                            {log.detalles || "NO HAY METADATOS DISPONIBLES EN EL BLOQUE"}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-12 text-center text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-slate-50">
                                        No hay eventos registrados en el sistema de trazabilidad actual.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
