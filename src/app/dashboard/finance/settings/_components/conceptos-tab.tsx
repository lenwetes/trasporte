"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Plus, 
    Pencil, 
    ArrowRightLeft, 
    LayoutDashboard,
    Archive
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Concepto } from "@/components/modules/finance/concepto-dialog";

interface ConceptosTabProps {
    conceptos: Concepto[];
    handleEditConcept: (concept: Concepto) => void;
    handleNewConcept: () => void;
}

export function ConceptosTab({
    conceptos,
    handleEditConcept,
    handleNewConcept,
}: ConceptosTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <DashboardHeader 
                title="Mapeo de Conceptos"
                tagline="Sincronización Contable"
                subtitle="Configure la contrapartida contable operativa y los parámetros de vinculación al Libro Mayor (P.U.C)."
                icon={ArrowRightLeft}
                actions={
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Button 
                            onClick={handleNewConcept}
                            className="rounded-none bg-primary text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl hover:-translate-y-1 transition-all h-12 px-8"
                        >
                            <Plus className="h-4 w-4" />
                            Vincular Nuevo Concepto
                        </Button>
                        <Button variant="outline" className="rounded-none border-primary text-primary font-black uppercase text-[10px] tracking-widest italic flex items-center justify-center gap-2 h-12 px-8">
                            <LayoutDashboard className="h-4 w-4" />
                            Auditar Mapeos
                        </Button>
                    </div>
                }
            />

            <Card className="rounded-none border-none shadow-2xl shadow-primary/5 ring-1 ring-slate-200 overflow-hidden">
                 <CardContent className="p-0">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 italic">
                                    <th className="px-8 py-5 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-900">Estado</th>
                                    <th className="px-8 py-5 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-900">Descriptor del Concepto</th>
                                    <th className="px-8 py-5 text-left text-[9px] font-black uppercase tracking-[0.4em] text-slate-900">Asiento Contable (P.U.C)</th>
                                    <th className="px-8 py-5 text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-900">Código Auxiliar</th>
                                    <th className="px-8 py-5 text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-900">Gestión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 italic">
                                {conceptos.map((c) => (
                                    <tr key={c.id} className="hover:bg-primary/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className={cn(
                                                "h-2 w-2 rounded-none shadow-sm",
                                                c.activo ? "bg-emerald-500" : "bg-slate-300"
                                            )}></div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[12px] font-black text-primary uppercase tracking-tight">{c.nombre}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-bold uppercase text-primary/50 tracking-wider font-mono italic">{c.cuenta?.nombre ?? "SIN VINCULAR"}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <Badge className="bg-slate-100 text-primary border-none rounded-none px-3 py-1 font-black text-[10px] tracking-[0.3em]">{c.cuenta?.codigo ?? "—"}</Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleEditConcept(c)}
                                                    className="h-9 w-9 border border-primary/5 rounded-none bg-white shadow-sm hover:bg-primary hover:text-white transition-all hover:shadow-xl hover:-translate-y-1"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {conceptos.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center space-y-4">
                                            <div className="flex flex-col items-center justify-center opacity-30 italic">
                                                <Archive className="h-12 w-12 mb-4" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">No hay conceptos maestros definidos</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                 </CardContent>
            </Card>
        </div>
    );
}
