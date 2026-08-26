/**
 * Página de gestión de Conceptos Financieros
 * Permite crear, editar y desactivar conceptos
 */

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ConceptList } from "@/components/finance/concept-list";
import { CreateConceptButton } from "@/components/finance/create-concept-button";
import { BookOpenText, Tag, Info } from "lucide-react";

export default function ConceptsPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <DashboardHeader
                title="Conceptos Financieros"
                tagline="DICCIONARIO DE RUBROS"
                subtitle="Gestión técnica de categorías para ingresos y gastos operativos"
                icon={BookOpenText}
            />

            <div className="grid gap-10 p-8 lg:p-0">
                {/* Panel de Control y Acción */}
                <div className="bg-white border border-primary/10 p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform">
                                    <Tag className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-[13px] font-black uppercase tracking-[0.3em] text-primary">
                                        Configuración Contable
                                    </h2>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1 italic">
                                        Automatización de Vínculos PUC
                                    </p>
                                </div>
                            </div>
                            <p className="text-[13px] font-medium text-slate-900 leading-relaxed max-w-2xl">
                                Los conceptos operativos permiten agilizar el registro contable
                                vinculando eventos transaccionales a cuentas maestras del Plan Único de Cuentas (PUC)
                                de manera bidireccional y auditada.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <CreateConceptButton />
                        </div>
                    </div>
                </div>

                {/* Listado Técnico */}
                <div className="bg-white border border-primary/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                    <div className="px-10 py-8 border-b border-primary/5 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <div className="h-2 w-2 bg-accent animate-pulse" />
                            <h3 className="text-[11px] font-black uppercase text-primary tracking-[0.4em]">
                                Auditoría de Rubros Activos
                            </h3>
                            <Info size={14} className="text-primary/20" />
                        </div>
                        <span className="font-mono text-[9px] font-black text-primary/20 uppercase tracking-widest">
                            Ref: DICCIONARIO CONTABLE
                        </span>
                    </div>
                    <div className="p-0">
                        <Suspense fallback={<ConceptListSkeleton />}>
                            <ConceptList />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ConceptListSkeleton() {
    return (
        <div className="divide-y divide-primary/5">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-6 p-8">
                    <Skeleton className="h-12 w-12 rounded-none bg-slate-100" />
                    <div className="space-y-3 flex-1">
                        <Skeleton className="h-5 w-1/3 rounded-none bg-slate-50" />
                        <Skeleton className="h-3 w-1/2 rounded-none bg-slate-50" />
                    </div>
                    <Skeleton className="h-10 w-24 rounded-none bg-slate-50" />
                </div>
            ))}
        </div>
    );
}
