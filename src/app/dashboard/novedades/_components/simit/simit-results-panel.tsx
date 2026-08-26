import * as React from "react";
import { 
    Search, 
    WifiOff, 
    Database, 
    ShieldCheck, 
    Loader2, 
    AlertTriangle, 
    Activity 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SimitResult } from "../simit-update-module.types";

interface SimitResultsPanelProps {
    isLoading: boolean;
    isServerDown: boolean;
    result: SimitResult | null;
    handleCheck: () => Promise<void>;
}

export function SimitResultsPanel({
    isLoading,
    isServerDown,
    result,
    handleCheck
}: SimitResultsPanelProps) {
    return (
        <Card className="xl:col-span-7 p-8 border-primary/10 rounded-none shadow-2xl bg-slate-900 text-white min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
            
            {isLoading ? (
                <div className="text-center space-y-6 relative z-10">
                    <div className="relative">
                        <div className="h-24 w-24 border-b-2 border-accent rounded-full animate-spin mx-auto" />
                        <Search className="h-8 w-8 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-black uppercase tracking-widest text-accent animate-pulse">Consultando Microservicios...</p>
                        <p className="text-[10px] font-bold text-white uppercase">Federación Colombiana de Municipios</p>
                    </div>
                </div>
            ) : isServerDown ? (
                <div className="text-center space-y-8 animate-in zoom-in-90 duration-500 relative z-10 max-w-md">
                    <div className="h-24 w-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_-12px_rgba(239,68,68,0.5)]">
                        <WifiOff className="h-10 w-10 text-red-500" />
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-2xl font-black uppercase italic text-red-500 tracking-tighter">Portal Fuera de Servicio</h4>
                        <div className="space-y-2">
                            <p className="text-[11px] font-bold text-white/60 uppercase leading-relaxed tracking-wider">
                                Los servidores oficiales de SIMIT (FCM) no están respondiendo a las solicitudes externas en este momento.
                            </p>
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-none">
                                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Database className="h-3 w-3" /> Causa: Mantenimiento o Caída de Infraestructura
                                </p>
                            </div>
                        </div>
                        <Button 
                            onClick={handleCheck}
                            variant="outline" 
                            className="h-10 border-white/10 text-white rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                            Reintentar Ahora
                        </Button>
                    </div>
                </div>
            ) : result ? (
                <div className="w-full h-full animate-in zoom-in-95 duration-500 relative z-10">
                    <div className="flex items-center gap-6 mb-10 border-b border-white/10 pb-8">
                        {result.estadoCuenta === 'PAZ_Y_SALVO' ? (
                            <div className="h-20 w-20 bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                <ShieldCheck className="h-10 w-10 text-emerald-400" />
                            </div>
                        ) : result.estadoCuenta === 'PROCESANDO_EN_SEGUNDO_PLANO' ? (
                            <div className="h-20 w-20 bg-accent/20 flex items-center justify-center border border-accent/30">
                                <Loader2 className="h-10 w-10 text-accent animate-spin" />
                            </div>
                        ) : (
                            <div className="h-20 w-20 bg-red-500/20 flex items-center justify-center border border-red-500/30">
                                <AlertTriangle className="h-10 w-10 text-red-500" />
                            </div>
                        )}
                        <div>
                            <h4 className={cn(
                                "text-3xl font-black uppercase italic tracking-tighter",
                                result.estadoCuenta === 'PAZ_Y_SALVO' ? "text-emerald-400" : 
                                result.estadoCuenta === 'PROCESANDO_EN_SEGUNDO_PLANO' ? "text-accent" : "text-red-500"
                            )}>
                                {result.estadoCuenta.replace(/_/g, ' ')}
                            </h4>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mt-1">
                                {result.estadoCuenta === 'PROCESANDO_EN_SEGUNDO_PLANO' 
                                    ? "La tarea ha sido delegada al trabajador de fondo" 
                                    : "Estado de cuenta verificado"}
                            </p>
                        </div>
                    </div>

                    {result.estadoCuenta === 'PROCESANDO_EN_SEGUNDO_PLANO' ? (
                        <div className="p-6 bg-accent/10 border border-accent/20 space-y-4">
                            <p className="text-xs font-black text-accent uppercase">Tarea en curso (BullMQ)</p>
                            <p className="text-[10px] font-medium text-white/70 leading-relaxed">
                                {result.mensaje || "Estamos consultando el portal oficial del SIMIT. Esto puede tomar de 30 a 60 segundos dependiendo de la disponibilidad del servidor gubernamental."}
                            </p>
                            <div className="flex items-center gap-2 text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-2">
                                <Activity className="h-3 w-3 animate-pulse" /> Estado: Procesando con Scraper Playwright
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 border border-white/5 space-y-2">
                                <p className="text-[10px] font-black text-white uppercase">Monto Adeudado</p>
                                <p className="text-2xl font-black font-mono text-accent">
                                    ${Number(result.valorTotal || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white/5 p-6 border border-white/5 space-y-2">
                                <p className="text-[10px] font-black text-white uppercase">Comparendos</p>
                                <p className="text-2xl font-black font-mono text-white">
                                    {result.numeroComparendos} <span className="text-[10px] opacity-20">UNIDADES</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {result.estadoCuenta !== 'PAZ_Y_SALVO' && result.estadoCuenta !== 'PROCESANDO_EN_SEGUNDO_PLANO' && (
                        <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/30 flex items-start gap-4">
                            <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-1" />
                            <div>
                                <p className="text-xs font-black text-orange-400 uppercase">Acción Automática Ejecutada</p>
                                <p className="text-[10px] font-medium text-white/60 leading-relaxed mt-1">
                                    Se ha generado una nueva <span className="text-white font-bold underline">Novedad Operativa</span> en el sistema PPSV para seguimiento administrativo inmediato.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center space-y-4 opacity-30 group relative z-10">
                    <div className="h-32 w-32 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center mx-auto transition-all group-hover:scale-110">
                        <Activity className="h-12 w-12" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em]">Esperando Selección</p>
                </div>
            )}
        </Card>
    );
}
