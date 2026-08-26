"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ResolucionDialog } from "../resolucion-dialog";
import { ContratoDialog } from "../contrato-dialog";
import { Pencil, Trash2, ShieldCheck, FileText, Loader2, Building2 } from "lucide-react";
import { deleteContrato, deleteResolucion } from "@/actions/fuec";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ResolucionFUEC, ContratoEmpresa } from "@prisma/client";

interface FuecConfigClientProps {
    resoluciones: ResolucionFUEC[];
    contratos: ContratoEmpresa[];
}

export function FuecConfigClient({ resoluciones, contratos }: FuecConfigClientProps) {
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{id: string, type: 'contrato' | 'resolucion'} | null>(null);

    const handleDelete = async () => {
        if (!confirmDelete) return;
        setIsDeletingId(confirmDelete.id);
        
        if (confirmDelete.type === "contrato") {
            const res = await deleteContrato(confirmDelete.id);
            if (res.success) toast.success("Contrato eliminado");
            else toast.error(res.error || "Error al eliminar");
        } else if (confirmDelete.type === "resolucion") {
            const res = await deleteResolucion(confirmDelete.id);
            if (res.success) toast.success("Resolución eliminada");
            else toast.error(res.error || "Error al eliminar");
        }
        
        setIsDeletingId(null);
        setConfirmDelete(null);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Dialog open={!!confirmDelete} onOpenChange={(open: boolean) => !open && setConfirmDelete(null)}>
                <DialogContent className="rounded-none border-none shadow-2xl p-0 overflow-hidden max-w-md">
                    <div className="bg-red-600 p-6 text-white h-24 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45" />
                        <DialogHeader className="relative z-10">
                            <DialogTitle className="font-black uppercase tracking-widest text-xl m-0 text-white">¿Confirmar Eliminación?</DialogTitle>
                        </DialogHeader>
                    </div>
                    <div className="p-6 bg-white space-y-6">
                        <DialogDescription className="text-primary/70 font-bold uppercase tracking-widest text-xs">
                            Esta acción deshabilitará el registro y no podrá ser utilizado para futuras emisiones FUEC.
                        </DialogDescription>
                        <DialogFooter className="flex sm:justify-end gap-2">
                            <Button variant="outline" onClick={() => setConfirmDelete(null)} className="rounded-none font-bold uppercase tracking-widest text-xs h-12 border-primary/20 hover:bg-primary/5">Cancelar</Button>
                            <Button onClick={handleDelete} className="rounded-none bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs h-12 shadow-xl hover:shadow-red-600/20">
                                {isDeletingId ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />} Eliminar Definitivamente
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* RESOLUCIONES */}
            <section className="bg-white border border-primary/10 shadow-sm rounded-none overflow-hidden group">
                <div className="p-6 border-b border-primary/5 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4 group-hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-primary flex items-center justify-center text-white flex-shrink-0 shadow-lg border border-primary/20">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-widest text-primary leading-none">Resoluciones</h2>
                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mt-1">Parámetros Ministeriales</p>
                        </div>
                    </div>
                    <ResolucionDialog />
                </div>
                <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {/* ENCABEZADOS DE RESOLUCIONES */}
                    {resoluciones.length > 0 && (
                        <div className="hidden sm:grid grid-cols-[1fr_auto_80px] gap-4 px-2 pb-2 border-b border-primary/10 text-[10px] font-black uppercase tracking-widest text-slate-900">
                            <div>Resolución / Estado</div>
                            <div className="text-center">Rangos</div>
                            <div className="text-right">Acciones</div>
                        </div>
                    )}
                    
                    {resoluciones.length === 0 ? (
                        <div className="text-center py-12 text-slate-900 font-bold uppercase text-xs tracking-widest space-y-3 bg-slate-50/50 border border-dashed border-primary/10">
                            <ShieldCheck className="h-10 w-10 mx-auto opacity-20" />
                            <p>No hay resoluciones registradas</p>
                        </div>
                    ) : (
                        resoluciones.map((r) => (
                            <div key={r.id} className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto] gap-4 items-center p-5 border border-primary/10 bg-white hover:border-accent hover:shadow-lg transition-all group/item shadow-sm">
                                <div className="space-y-2 w-full text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-3">
                                        <p className="font-black text-base uppercase text-primary tracking-widest">{r.numeroResolucion}</p>
                                        <Badge variant="outline" className={`rounded-none px-2 py-0.5 text-[10px] uppercase tracking-widest font-black border-none ${r.habilitada ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                                            {r.habilitada ? "ACTIVA" : "INACTIVA"}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-[11px] font-mono text-primary/60 tracking-wider flex items-center gap-2 justify-center">
                                    <span className="bg-slate-100 px-2 py-1 rounded-sm">RANGO: <strong className="text-primary">{r.rangoDesde} - {r.rangoHasta}</strong></span>
                                    <span className="bg-accent/10 text-accent px-2 py-1 rounded-sm">ACTUAL: <strong className="font-black">{r.actual}</strong></span>
                                </div>
                                <div className="flex items-center justify-end w-full sm:w-auto gap-1 bg-slate-50 border border-primary/10 p-1">
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 text-primary/50 hover:text-red-500 hover:bg-red-50 rounded-none transition-colors"
                                        onClick={() => setConfirmDelete({ id: r.id, type: 'resolucion' })}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* CONTRATOS */}
            <section className="bg-white border border-primary/10 shadow-sm rounded-none overflow-hidden group">
                <div className="p-6 border-b border-primary/5 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4 group-hover:bg-accent/5 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-accent flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-accent/20 border border-accent/20">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-widest text-primary leading-none">Contratos Activos</h2>
                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mt-1">Convenios Empresariales FUEC</p>
                        </div>
                    </div>
                    <ContratoDialog trigger={
                        <Button className="h-12 px-6 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-[11px] rounded-none shadow-xl shadow-accent/20 transition-all active:scale-[0.98]">
                            + NUEVO CONTRATO
                        </Button>
                    } />
                </div>
                <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {/* ENCABEZADOS DE CONTRATOS */}
                    {contratos.length > 0 && (
                        <div className="hidden sm:grid grid-cols-[1fr_80px] gap-4 px-2 pb-2 border-b border-primary/10 text-[10px] font-black uppercase tracking-widest text-slate-900">
                            <div>Contrato / Cliente</div>
                            <div className="text-right">Acciones</div>
                        </div>
                    )}
                    
                    {contratos.length === 0 ? (
                        <div className="text-center py-12 text-slate-900 font-bold uppercase text-xs tracking-widest space-y-3 bg-slate-50/50 border border-dashed border-primary/10">
                            <FileText className="h-10 w-10 mx-auto opacity-20" />
                            <p>No hay contratos registrados</p>
                        </div>
                    ) : (
                        contratos.filter((c) => c.activo).map((c) => (
                            <div key={c.id} className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] gap-4 items-center p-5 border border-primary/10 bg-white hover:border-accent hover:shadow-lg transition-all group/item shadow-sm">
                                <div className="space-y-2 w-full text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                                        <p className="font-black text-sm uppercase text-primary tracking-widest">{c.cliente}</p>
                                        {c.esInterno && (
                                            <Badge variant="outline" className="rounded-none px-2 py-0.5 text-[9px] uppercase tracking-widest font-black bg-blue-50 text-blue-600 border-none shadow-sm">INTERNO</Badge>
                                        )}
                                        <Badge variant="outline" className="rounded-none px-2 py-0.5 text-[9px] uppercase tracking-widest font-black bg-emerald-50 text-emerald-600 border-none shadow-sm">ACTIVO</Badge>
                                    </div>
                                    <p className="text-[12px] font-mono font-bold text-primary/60 tracking-wider">
                                        REF: <strong className="text-primary">{c.numeroContrato}</strong>
                                    </p>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto gap-1 transition-opacity bg-slate-50 border border-primary/10 p-1">
                                    <ContratoDialog 
                                        initialData={c} 
                                        trigger={
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary/50 hover:text-accent hover:bg-accent/10 rounded-none transition-colors">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        } 
                                    />
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 text-primary/50 hover:text-red-500 hover:bg-red-50 rounded-none transition-colors"
                                        onClick={() => setConfirmDelete({ id: c.id, type: 'contrato' })}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
