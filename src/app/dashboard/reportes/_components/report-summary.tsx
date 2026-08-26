import { CheckCircle2, Clock, Activity } from "lucide-react";

export function ReportSummary() {
    return (
        <div className="mt-8 bg-slate-50 border border-primary/10 p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1 space-y-4">
                <h2 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-3">
                    <Activity className="h-5 w-5 text-accent" />
                    Telemetría y Predictibilidad
                </h2>
                <p className="text-[11px] font-bold text-muted-foreground uppercase leading-relaxed max-w-2xl tracking-[0.1em]">
                    EL MOTOR ANALÍTICO OPERACIONAL PROCESA LAS TENDENCIAS DE VENCIMIENTO REGISTRALES 
                    PARA GARANTIZAR DISPONIBILIDAD TOTAL. EXTRAIGA LA DATA EN FORMATO DE VECTORES 
                    PERIÓDICAMENTE PARA GARANTIZAR CONFORMIDAD 100%.
                </p>
                <div className="flex flex-wrap gap-6 pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest border border-primary/10 px-4 py-2 bg-white">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        CERTIFICACIÓN
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest border border-primary/10 px-4 py-2 bg-white">
                        <Clock className="h-4 w-4 text-slate-900" />
                        ALERTAS DE UMBRAL PREVENTIVO
                    </div>
                </div>
            </div>

            <div className="w-full md:w-auto bg-white border border-primary/10 p-6 space-y-4 min-w-[280px]">
                <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                        Eficiencia Reportada
                    </span>
                    <span className="text-2xl font-black text-primary font-mono tracking-tighter">98.4%</span>
                </div>
                {/* Visual Bar Indicator */}
                <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-accent w-[98.4%]"></div>
                </div>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-right">
                    *Métrica Q3 - Tolerancia 0 Falta
                </p>
            </div>
        </div>
    );
}
