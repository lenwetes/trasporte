"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeContent() {
    return (
        <main className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center relative overflow-hidden font-sans">
            {/* Intel Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] background-grid pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12 py-20">
                
                {/* Text Content */}
                <div className="flex-1 space-y-8 max-w-2xl">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20">
                        <ShieldCheck className="h-4 w-4 text-accent" />
                        <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">
                            Plataforma SGIT Coopetraes Certificada
                        </span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black text-primary uppercase tracking-tighter leading-[0.9]">
                        Core de 
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                            Operaciones
                        </span>
                    </h1>

                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest leading-relaxed border-l-4 border-accent pl-6 py-2">
                        Infraestructura criptográfica para control de flotas, integración FUEC y aseguramiento de normativas reguladas por el Ministerio de Transporte.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/login">
                            <Button className="h-14 w-full sm:w-auto px-8 rounded-none bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] gap-3 transition-all shadow-xl hover:shadow-primary/20">
                                Iniciar Sincronización <ArrowRight className="h-5 w-5 text-accent" />
                            </Button>
                        </Link>
                        <Button variant="outline" className="h-14 w-full sm:w-auto px-8 rounded-none border-primary/20 hover:bg-primary/5 text-primary font-black uppercase tracking-widest text-[11px] transition-all">
                            DOCUMENTACIÓN TÉCNICA
                        </Button>
                    </div>
                </div>

                {/* Cyber Geometric Visual */}
                <div className="flex-1 relative hidden lg:block h-[500px]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent border border-primary/10 transform rotate-3 flex items-center justify-center">
                        <div className="absolute top-10 left-10 text-[9px] font-black uppercase tracking-[0.3em] text-primary">
                            NODO CENTRAL SGIT
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 bg-white p-6 border border-primary/10 shadow-xl transform -rotate-3 transition-transform hover:rotate-0 duration-500">
                                <Zap className="h-8 w-8 text-accent" />
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">Latencia</div>
                                    <div className="text-2xl font-black uppercase tracking-tighter text-primary font-mono">12ms</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-primary text-white p-6 border border-primary shadow-2xl transform -translate-x-12 rotate-2 transition-transform hover:rotate-0 duration-500">
                                <Database className="h-8 w-8 text-accent" />
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Red Criptográfica</div>
                                    <div className="text-2xl font-black uppercase tracking-tighter font-mono">EN LÍNEA</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
