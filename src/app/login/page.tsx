"use client";

import { loginAction } from "@/actions/auth";
import { useState } from "react";
import { Loader2, ShieldCheck, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        const formData = new FormData(e.currentTarget);
        try {
            const result = await loginAction(formData);
            if (result && !result.success) {
                setError(result.error || "CREDENCIALES INVÁLIDAS");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-primary font-sans">
            {/* Intel Sidebar (Brand presence) */}
            <div className="hidden lg:flex w-[40%] bg-primary flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 background-grid animate-pulse-slow"></div>
                <div className="relative z-10 flex items-center gap-4 text-accent border-b border-primary-foreground/10 pb-6 w-max">
                    <ShieldCheck className="h-8 w-8" />
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-[0.2em] leading-none">COOPETRAES</h1>
                        <p className="text-[10px] uppercase font-bold text-primary-foreground/50 tracking-[0.3em] mt-1">SISTEMA CORE INTEGRAL</p>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <h2 className="text-5xl font-black text-white leading-tight">
                        OPERACIONES<br/>
                        <span className="text-accent">SIN FRICCIÓN.</span>
                    </h2>
                    <p className="text-xs font-bold text-primary-foreground/60 uppercase tracking-widest max-w-sm leading-relaxed border-l-2 border-accent pl-4">
                        Motor criptográfico de gestión de flotas, control operativo y auditoría unificada.
                    </p>
                </div>
                
                <div className="relative z-10 text-[9px] font-black uppercase text-primary-foreground/30 tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} COOPETRAES PLATAFORMA CORE. ACCESO CONFIDENCIAL.
                </div>
            </div>

            {/* Login Form Context */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 relative">
                {/* Mobile Header overlay */}
                <div className="absolute top-8 left-8 lg:hidden flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <span className="text-sm font-black uppercase tracking-[0.2em]">COOPETRAES CORE</span>
                </div>

                <div className="w-full max-w-sm bg-white border border-primary/10 p-10 shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
                    
                    <div className="mb-10 text-center">
                        <div className="inline-flex h-16 w-16 bg-slate-50 border border-primary/5 items-center justify-center mb-6">
                            <Lock className="h-6 w-6 text-slate-900" />
                        </div>
                        <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Acceso Operativo</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">
                            Validación de Credenciales
                        </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Terminal de Usuario</label>
                            <Input 
                                name="email" 
                                type="email" 
                                required 
                                className="h-14 rounded-none border-primary/20 bg-slate-50 px-4 text-xs font-bold text-primary focus-visible:ring-0 focus-visible:border-accent uppercase"
                                placeholder="USUARIO@COOPETRAES.COM"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">LLave Criptográfica</label>
                            <Input 
                                name="password" 
                                type="password" 
                                required 
                                className="h-14 rounded-none border-primary/20 bg-slate-50 px-4 text-xs font-bold text-primary focus-visible:ring-0 focus-visible:border-accent"
                                placeholder="••••••••••••"
                            />
                        </div>
                        
                        {error && (
                            <div className="p-4 border border-red-500/20 bg-red-50/50 text-center">
                                <span className="text-[10px] font-black uppercase text-red-600 tracking-widest">{error}</span>
                            </div>
                        )}
                        
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full h-14 rounded-none bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] gap-3 transition-all"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                            ) : (
                                <>
                                    Sincronizar <ArrowRight className="h-5 w-5 text-accent" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center border-t border-primary/5 pt-6 text-[9px] font-black uppercase tracking-widest text-primary">
                        SISTEMA RESTRINGIDO A PERSONAL AUTORIZADO
                    </div>
                </div>
            </div>
        </div>
    );
}
