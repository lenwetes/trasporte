/**
 * Lista de conceptos financieros con filtros y acciones - Premium Solid Sharp
 */

"use client";

import { useEffect, useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    Edit,
    Trash2,
    Search,
    Tag,
} from "lucide-react";
import { 
    getAllConceptsAction, 
    deactivateConceptAction 
} from "@/actions/finance/concepts.actions";
import { ConceptoDialog } from "@/components/modules/finance/concepto-dialog";
import type { TipoTransaccion } from "@prisma/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ConceptoConCuenta {
    id: string;
    nombre: string;
    tipo: TipoTransaccion;
    requiereTercero: boolean;
    valorPorDefecto: number | null;
    activo: boolean;
    cuenta: {
        id: string;
        codigo: string;
        nombre: string;
    };
}

export function ConceptList() {
    const [concepts, setConcepts] = useState<ConceptoConCuenta[]>([]);
    const [filteredConcepts, setFilteredConcepts] = useState<ConceptoConCuenta[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [tipoFilter, setTipoFilter] = useState<string>("all");
    const [editingConcept, setEditingConcept] = useState<ConceptoConCuenta | null>(null);

    useEffect(() => {
        loadConcepts();
    }, []);

    useEffect(() => {
        filterConcepts();
    }, [concepts, searchQuery, tipoFilter]);

    async function loadConcepts() {
        try {
            setLoading(true);
            const result = await getAllConceptsAction({});

            if (result.success && result.data) {
                setConcepts(result.data as ConceptoConCuenta[]);
            } else {
                toast.error(result.error || "Falla en sincronización de rubros");
            }
        } catch (error) {
            toast.error("Error crítico de vinculación contable");
        } finally {
            setLoading(false);
        }
    }

    function filterConcepts() {
        let filtered = [...concepts];

        if (searchQuery) {
            filtered = filtered.filter(
                (c) =>
                    c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.cuenta.codigo.includes(searchQuery) ||
                    c.cuenta.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        if (tipoFilter !== "all") {
            filtered = filtered.filter((c) => c.tipo === tipoFilter);
        }

        setFilteredConcepts(filtered);
    }

    async function handleDeactivate(id: string, nombre: string) {
        const confirmResult = await new Promise((resolve) => {
            const confirmed = window.confirm(`¿Desea dar de baja el concepto "${nombre}"? Esta acción auditará su usuario.`);
            resolve(confirmed);
        });

        if (!confirmResult) return;

        const toastId = toast.loading("Procesando baja de rubro...");
        const result = await deactivateConceptAction({ id });

        if (result.success) {
            toast.success("Rubro desactivado satisfactoriamente", { id: toastId });
            loadConcepts();
        } else {
            toast.error(result.error || "Error en proceso de baja", { id: toastId });
        }
    }

    const formatCurrency = (value: number | null) => {
        if (value === null) return "-";
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(value);
    };

    if (loading) {
        return (
            <div className="p-20 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="h-12 w-12 border-2 border-primary/10 border-t-accent animate-spin" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 animate-pulse">
                    Sincronizando Diccionario PUC...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Intel Bar: Filtros Premium */}
            <div className="flex flex-col md:flex-row gap-6 p-10 bg-slate-50/50 border border-primary/5">
                <div className="relative flex-1">
                    <Search 
                        size={16} 
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" 
                    />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o codificación PUC..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-16 pl-14 pr-6 bg-white border border-primary/10 rounded-none text-[11px] font-black uppercase tracking-widest focus:border-primary transition-all outline-none shadow-sm placeholder:text-primary/20"
                    />
                </div>
                <div className="relative shrink-0 md:w-72">
                    <select 
                        value={tipoFilter} 
                        onChange={(e) => setTipoFilter(e.target.value)}
                        className="w-full h-16 px-8 bg-white border border-primary/10 rounded-none text-[11px] font-black uppercase tracking-widest appearance-none focus:border-primary transition-all outline-none cursor-pointer"
                    >
                        <option value="all">Todas las Categorías</option>
                        <option value="INGRESO">Ingresos de Caja</option>
                        <option value="EGRESO">Salidas / Egresos</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary/20">
                        <Tag size={16} />
                    </div>
                </div>
            </div>

            {/* Listado de Alta Densidad */}
            <div className="border border-primary/10 overflow-x-auto bg-white shadow-xl">
                <table className="w-full border-collapse">
                    <thead className="bg-slate-900 border-b border-white/5">
                        <tr>
                            <th className="p-6 text-left text-[11px] font-black text-white uppercase tracking-[0.3em] pl-10">Concepto Operativo</th>
                            <th className="p-6 text-left text-[11px] font-black text-white uppercase tracking-[0.3em]">Naturaleza</th>
                            <th className="p-6 text-left text-[11px] font-black text-white uppercase tracking-[0.3em]">Imputación PUC</th>
                            <th className="p-6 text-left text-[11px] font-black text-white uppercase tracking-[0.3em]">Valor Base</th>
                            <th className="p-6 text-left text-[11px] font-black text-white uppercase tracking-[0.3em]">Estado</th>
                            <th className="p-6 text-right text-[11px] font-black text-white uppercase tracking-[0.3em] pr-10">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                        {filteredConcepts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <Tag size={48} strokeWidth={1} />
                                        <div className="text-[11px] font-black uppercase tracking-[0.4em]">Diccionario Vacío</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredConcepts.map((concept) => (
                                <tr key={concept.id} className="group hover:bg-slate-50/80 transition-all border-l-4 border-l-transparent hover:border-l-accent">
                                    <td className="p-8 pl-10">
                                        <div className="font-black text-primary text-[13px] uppercase tracking-tight">{concept.nombre}</div>
                                        {concept.requiereTercero && (
                                            <div className="inline-flex items-center gap-2 mt-2 px-2 py-0.5 bg-accent/5 border border-accent/20">
                                                <div className="h-1 w-1 bg-accent rounded-full animate-pulse" />
                                                <span className="text-[8px] text-accent font-black uppercase tracking-widest">Auditoría Obligatoria</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-8">
                                        <span className={cn(
                                            "px-4 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase shadow-sm",
                                            concept.tipo === "INGRESO" 
                                                ? "bg-accent text-primary" 
                                                : "bg-red-500 text-white"
                                        )}>
                                            {concept.tipo}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <div className="font-mono text-[13px] font-black text-primary tracking-tighter">{concept.cuenta.codigo}</div>
                                        <div className="text-[10px] text-slate-900 font-bold uppercase tracking-widest mt-1">{concept.cuenta.nombre}</div>
                                    </td>
                                    <td className="p-8">
                                        <div className="text-[14px] font-black text-primary font-mono tracking-tighter">
                                            {formatCurrency(concept.valorPorDefecto)}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-2 w-2",
                                                concept.activo ? "bg-accent" : "bg-slate-200"
                                            )} />
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                                {concept.activo ? "Activo" : "Suspendido"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-8 pr-10 text-right">
                                        <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                                            <button 
                                                onClick={() => setEditingConcept(concept)}
                                                className="h-10 w-10 flex items-center justify-center bg-white border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                                title="Editar Parámetros"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            {concept.activo && (
                                                <button 
                                                    onClick={() => handleDeactivate(concept.id, concept.nombre)}
                                                    className="h-10 w-10 flex items-center justify-center bg-red-50 border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Dar de Baja"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* New Modular Dialog Integration */}
            <ConceptoDialog
                open={!!editingConcept}
                setOpen={(open: boolean) => !open && setEditingConcept(null)}
                initialData={editingConcept ? {
                    ...editingConcept,
                    valorSugerido: editingConcept.valorPorDefecto
                } : null}
                onSuccess={loadConcepts}
            />
        </div>
    );
}
