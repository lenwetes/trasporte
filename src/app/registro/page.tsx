import { RegisterForm } from "@/components/forms/register-form";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileKey2 } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
                
                <Link href="/login" className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4" /> CANCELAR PROCESO
                </Link>

                <div className="w-full max-w-lg space-y-8">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="h-20 w-20 bg-primary flex items-center justify-center border border-primary/20 shadow-xl">
                            <FileKey2 className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-primary uppercase tracking-tight leading-none">
                                Proceso de Alta en Sistema
                            </h1>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] mt-3 max-w-sm mx-auto">
                                Generación de credenciales operativas. Acceso auditado y monitorizado en tiempo real.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-primary/10 p-8 md:p-12 shadow-2xl relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
                        <RegisterForm />
                    </div>

                    <div className="text-center bg-primary/5 border border-primary/10 p-4 flex gap-4 text-left">
                        <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 leading-relaxed">
                            Al enviar esta solicitud, su registro IP quedará anclado. Usted consiente los acuerdos de confidencialidad y tratamiento criptográfico de datos (Ley Estatutaria 1581 de 2012).
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Visual Panel Right */}
            <div className="hidden lg:block w-[35%] bg-primary relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 background-grid animate-pulse-slow"></div>
                <div className="absolute bottom-12 left-12 right-12 space-y-6">
                    <div className="border border-white/10 p-6 bg-black/20 backdrop-blur-sm">
                        <div className="text-accent font-mono text-[10px] uppercase tracking-widest mb-2">VECTOR DE AUTENTICIDAD ZTNA</div>
                        <p className="text-xs font-bold text-white/70 uppercase tracking-wide leading-relaxed">
                            "Validación robusta asegurada. Protegiendo la integridad transaccional de todos nuestros socios y activos de flota minuto a minuto."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
