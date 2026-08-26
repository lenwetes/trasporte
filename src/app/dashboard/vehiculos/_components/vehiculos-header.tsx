import { Truck } from "lucide-react";

export function VehiculosHeader() {
    return (
        <div className="space-y-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Icono Maestro */}
            <div className="flex flex-col gap-1">
                <div className="h-10 w-10 flex items-center justify-center text-primary/80 mb-2">
                    <Truck className="h-8 w-8 stroke-[1.5]" />
                </div>
                
                {/* Tagline de Inteligencia */}
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-cyan-700/80">
                        Fleet Intelligence
                    </span>
                </div>

                {/* Título Principal */}
                <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 leading-none">
                    Gestión de Activos
                </h1>

                {/* Subtítulo Descriptivo */}
                <p className="text-[13px] font-bold text-cyan-800/60 uppercase tracking-widest mt-2 max-w-2xl leading-relaxed">
                    Administración estratégica de la flota vehicular y cumplimiento normativo integral
                </p>
            </div>
            
            <div className="h-px w-full bg-gradient-to-r from-cyan-500/20 via-primary/5 to-transparent" />
        </div>
    );
}
