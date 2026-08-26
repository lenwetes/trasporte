import { VehicleWizard } from "@/components/wizard/vehicle/vehicle-wizard";
import Link from "next/link";
import { ChevronLeft, ShieldPlus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NuevoVehiculoPage() {
    return (
        <div className="max-w-[1400px] mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Técnico */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-100 pb-10 gap-8">
                <div className="flex gap-8 items-start group">
                    <Link href="/dashboard/vehiculos">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-14 w-14 rounded-none border-slate-200 hover:border-slate-900 transition-all duration-300"
                        >
                            <ChevronLeft className="h-6 w-6 text-slate-900 group-hover:text-slate-900" />
                        </Button>
                    </Link>
                    
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-1.5 w-1.5 bg-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">
                                Protocolo Institucional de Flota
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">
                            REGISTRO DE <span className="text-emerald-600">UNIDAD</span>
                        </h1>
                        <p className="text-sm font-medium text-slate-900 tracking-tight max-w-md">
                            Apertura de expediente técnico certificado para la gestión integral de activos vehiculares.
                        </p>
                    </div>
                </div>

                {/* Status Monitor */}
                <div className="flex items-center gap-6 bg-slate-50 p-6 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-xl hover:border-slate-200">
                    <div className="h-12 w-12 bg-slate-900 flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <ShieldPlus className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                        <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 mb-1">
                            Estatus del Proceso
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-tighter text-slate-900">APERTURA INICIAL</span>
                            <ArrowRight className="h-3 w-3 text-slate-900" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Form Container - Solid Sharp View */}
            <main className="bg-white border border-slate-200 shadow-2xl relative overflow-hidden">
                {/* Decorative Accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rotate-45 translate-x-16 -translate-y-16" />
                <div className="absolute bottom-0 left-0 w-24 h-1 bg-emerald-500" />
                
                <div className="p-8 md:p-12">
                   <VehicleWizard />
                </div>
            </main>

            {/* Footer Metadata */}
            <footer className="mt-8 flex justify-between items-center px-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-900">
                    EXPEDIENTE DIGITAL V1.0.4 // COOPETRAES SEGURIDAD
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-900 flex gap-4">
                    <span>HASH: ACC-442-99</span>
                    <span>TS: {new Date().toLocaleDateString()}</span>
                </div>
            </footer>
        </div>
    );
}
