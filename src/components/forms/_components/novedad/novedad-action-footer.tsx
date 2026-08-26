import * as React from "react";
import { 
    ClipboardCheck, 
    Save, 
    AlertTriangle, 
    Activity, 
    ShieldCheck, 
    Wrench 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NovedadActionFooterProps {
    isSubmitting: boolean;
}

export function NovedadActionFooter({ isSubmitting }: NovedadActionFooterProps) {
    return (
        <div className="space-y-12 pb-20">
            {/* ACCIÓN FINAL */}
            <div className="bg-slate-900 p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 -skew-x-12 translate-x-3/4" />
                <div className="flex-1 space-y-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 flex items-center justify-center bg-secondary text-primary">
                            <ClipboardCheck className="h-4 w-4" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary">Validación PESV Firmada</span>
                    </div>
                    <p className="text-[11px] font-bold text-white uppercase leading-relaxed tracking-wider max-w-xl italic">
                        EL SISTEMA COOPETRAES AUDITA CADA REGISTRO DE MANERA INMEDIATA. LOS DATOS SUMINISTRADOS SON VINCULANTES OPERATIVA Y LEGALMENTE SEGÚN PROTOCOLOS DE SEGURIDAD VIAL.
                    </p>
                </div>
                <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                        "h-20 w-full lg:w-96 text-[12px] font-black uppercase tracking-[0.25em] bg-white text-slate-900 hover:bg-slate-100 transition-all relative overflow-hidden group shadow-2xl radius-0 border-none"
                    )}
                >
                    <div className="absolute top-0 right-[-100%] w-full h-full bg-white/10 group-hover:right-0 transition-all duration-500 -skew-x-12" />
                    {isSubmitting ? (
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="h-5 w-5 border-2 border-primary border-t-transparent animate-spin" />
                            <span>PROCESANDO ACTIVACIÓN...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6 relative z-10">
                            <Save size={20} className="group-hover:rotate-12 transition-transform" />
                            <span>REGISTRAR PROCEDIMIENTO</span>
                        </div>
                    )}
                </Button>
            </div>
            
            <div className="flex justify-center gap-8 py-4 opacity-10">
                <AlertTriangle className="h-6 w-6" />
                <Activity className="h-6 w-6" />
                <ShieldCheck className="h-6 w-6" />
                <Wrench className="h-6 w-6" />
            </div>
        </div>
    );
}
