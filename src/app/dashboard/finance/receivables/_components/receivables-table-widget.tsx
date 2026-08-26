import React from "react";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { differenceInDays, parseISO } from "date-fns";
import { 
    Users, 
    Search,
    ArrowRightLeft,
    ChevronRight,
    User,
    AlertOctagon,
    Clock
} from "lucide-react";
import { toast } from "sonner";
import { notifyDeudoresMorosos } from "@/actions/finance/receivables.actions";
import { UnifiedReceivable } from "@/types";

export interface ReceivablesTableWidgetProps {
  filteredList: UnifiedReceivable[];
  dataLength: number;
  prestamosCount: number;
  obligacionesCount: number;
  morososCount: number;
  filter: "ALL" | "MORA" | "PRESTAMOS" | "OBLIGACIONES";
  setFilter: (val: "ALL" | "MORA" | "PRESTAMOS" | "OBLIGACIONES") => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const calculateDaysInMora = (fechaVence: Date | string) => {
    const now = new Date();
    const date = typeof fechaVence === 'string' ? parseISO(fechaVence) : new Date(fechaVence);
    const days = differenceInDays(now, date);
    return days > 0 ? days : 0;
};

export function ReceivablesTableWidget({
  filteredList,
  dataLength,
  prestamosCount,
  obligacionesCount,
  morososCount,
  filter,
  setFilter,
  searchTerm,
  setSearchTerm
}: ReceivablesTableWidgetProps) {
  return (
    <div className="lg:col-span-8 space-y-8">
        <div className="bg-white border border-primary/10 shadow-2xl flex flex-col min-h-[700px]">
            
            {/* Toolbar */}
            <div className="p-8 border-b border-primary/5 bg-slate-50/50 flex flex-col xl:flex-row justify-between xl:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-4 text-primary">
                        <ArrowRightLeft className="h-6 w-6 text-accent" />
                        <h3 className="text-[16px] font-black uppercase tracking-[0.4em]">Libro de Cartera</h3>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    {/* Filter Tabs */}
                    <div className="flex bg-slate-200/50 p-1 flex-wrap">
                        <button 
                            onClick={() => setFilter("ALL")}
                            className={cn(
                                "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === "ALL" ? "bg-white text-primary shadow-sm" : "text-slate-900 hover:text-primary"
                            )}
                        >
                            Consolidado ({dataLength})
                        </button>
                        <button 
                            onClick={() => setFilter("PRESTAMOS")}
                            className={cn(
                                "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === "PRESTAMOS" ? "bg-white text-primary shadow-sm" : "text-slate-900 hover:text-primary"
                            )}
                        >
                            Préstamos ({prestamosCount})
                        </button>
                        <button 
                            onClick={() => setFilter("OBLIGACIONES")}
                            className={cn(
                                "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === "OBLIGACIONES" ? "bg-white text-primary shadow-sm" : "text-slate-900 hover:text-primary"
                            )}
                        >
                            Obligaciones ({obligacionesCount})
                        </button>
                        <button 
                            onClick={() => setFilter("MORA")}
                            className={cn(
                                "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === "MORA" ? "bg-red-50 text-red-600 shadow-sm" : "text-slate-900 hover:text-primary"
                            )}
                        >
                            Mora Crítica ({morososCount})
                        </button>
                    </div>
                    
                    {/* Search */}
                    <div className="relative flex-1 w-full xl:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <input 
                            type="text"
                            placeholder="Buscar deudor o placa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-[11px] font-bold tracking-widest pl-10 pr-4 py-3 bg-white border border-primary/10 outline-none focus:border-accent transition-colors uppercase placeholder:normal-case"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-primary/5">
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-900 uppercase tracking-widest">Estado/Deudor</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-900 uppercase tracking-widest">Concepto</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-900 uppercase tracking-widest">Saldo Activo</th>
                            <th className="px-8 py-6 text-center text-[10px] font-black text-slate-900 uppercase tracking-widest">Cobranza</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                        {filteredList.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-10 py-32 text-center">
                                    <div className="flex flex-col items-center gap-6 opacity-20">
                                        <Users size={64} />
                                        <p className="text-[12px] font-black uppercase tracking-[0.4em]">Sin registros que mostrar</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredList.map((ob) => {
                                const diasMora = calculateDaysInMora(ob.fechaVence);
                                const isMora = diasMora > 0;

                                return (
                                    <tr key={ob.id} className={cn(
                                        "group transition-colors",
                                        isMora ? "bg-red-50/20 hover:bg-red-50/50" : "hover:bg-slate-50"
                                    )}>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 border flex items-center justify-center transition-all",
                                                    isMora ? "bg-red-100 border-red-200 text-red-600" : "bg-white border-primary/10 text-slate-900 group-hover:bg-primary group-hover:text-white"
                                                )}>
                                                    {isMora ? <AlertOctagon size={18} /> : <User size={18} />}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className={cn(
                                                        "text-[12px] font-black uppercase tracking-tight",
                                                        isMora ? "text-red-900" : "text-primary"
                                                    )}>
                                                        {ob.usuario.nombres} {ob.usuario.apellidos}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                                                        {ob.usuario.numeroDocumento} 
                                                        {ob.vehiculo?.placa && <span>• {ob.vehiculo.placa}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className={cn(
                                                    "inline-flex items-center px-2 py-1 border text-[9px] font-black uppercase tracking-widest w-fit",
                                                    ob.tipoPrincipal === "PRESTAMO" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-slate-100/50 border-primary/20 text-slate-900"
                                                )}>
                                                    {ob.tipo}
                                                </div>
                                                <div className="text-[8px] font-black text-slate-900 uppercase">REF: {ob.consecutivo}</div>
                                                {isMora ? (
                                                    <span className="text-[9px] font-black text-red-500 flex items-center gap-1 mt-1 uppercase tracking-widest">
                                                        <Clock size={10} />
                                                        {diasMora} DÍAS VENCIDA
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                                                        VENCE: {new Date(ob.fechaVence).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <div className={cn(
                                                    "text-[14px] font-extrabold font-mono tracking-tight",
                                                    isMora ? "text-red-600" : "text-primary"
                                                )}>
                                                    {formatCurrency(Number(ob.saldoPendiente))}
                                                </div>
                                                <div className="text-[9px] font-black text-slate-900 uppercase tracking-tighter">
                                                    De {formatCurrency(Number(ob.montoInicial))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center flex-col items-center gap-2">
                                                <Link href={ob.tipoPrincipal === "PRESTAMO" ? `/dashboard/finance/loans` : `/dashboard/finance/payments?obligacionId=${ob.id}`}>
                                                    <button className={cn(
                                                        "h-9 px-4 border flex items-center justify-center transition-all bg-white text-[10px] font-black tracking-widest shadow-sm uppercase w-full",
                                                        isMora 
                                                            ? "border-red-200 text-red-600 hover:bg-red-600 hover:text-white" 
                                                            : "border-primary/20 text-primary hover:bg-primary hover:text-white"
                                                    )}>
                                                        {ob.tipoPrincipal === "PRESTAMO" ? "Gestionar" : "Recaudar"}
                                                    </button>
                                                </Link>
                                                {isMora && (
                                                    <button 
                                                        onClick={() => {
                                                            toast.promise(notifyDeudoresMorosos([ob.id]), {
                                                                loading: 'Enviando notificación...',
                                                                success: 'Notificación enviada',
                                                                error: 'Error al enviar'
                                                            });
                                                        }}
                                                        className="text-[9px] font-black text-slate-900 underline uppercase hover:text-primary transition-colors"
                                                    >
                                                        Recordatorio Directo
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-8 bg-slate-50 border-t border-primary/5 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                    Mostrando {filteredList.length} de {dataLength} registros
                </span>
                <Link href="/dashboard/finance/reports" className="text-[10px] font-black text-accent hover:text-primary uppercase tracking-[0.2em] transition-all flex items-center gap-2">
                    Exportar Reporte
                    <ChevronRight size={14} />
                </Link>
            </div>
        </div>
    </div>
  );
}
