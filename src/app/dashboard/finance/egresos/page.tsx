import { getTransactionsAction, getExpenseSummaryAction } from "@/actions/finance";
import { ExpenseForm } from "./expense-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
    ArrowDownCircle,
    AlertCircle,
    FileText,
    WalletCards,
    Receipt,
    TrendingDown,
    Calendar,
    ChevronRight,
    ArrowUpRight,
} from "lucide-react";
import { Prisma } from "@prisma/client";
import { cn } from "@/lib/utils";

type ExpenseTransaction = Prisma.TransaccionGetPayload<{
    include: { asientos: { include: { cuenta: true } } };
}>;

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
    // Parallel data fetching
    const [expensesResult, summaryResult] = await Promise.all([
        getTransactionsAction({ page: 1, limit: 12, type: "EGRESO" }),
        getExpenseSummaryAction(),
    ]);

    type PaginatedExpenses = { data: ExpenseTransaction[] };
    const expensesData =
        expensesResult.success &&
        expensesResult.data &&
        typeof expensesResult.data === "object" &&
        "data" in expensesResult.data
            ? (expensesResult.data as PaginatedExpenses).data
            : Array.isArray(expensesResult.data)
              ? (expensesResult.data as ExpenseTransaction[])
              : [];

    const expenses = expensesData;

    type SummaryType = {
        breakdown: Record<string, number>;
        total: number;
        period?: { start: Date; end: Date };
    };

    const summary = (
        summaryResult.success && summaryResult.data
            ? summaryResult.data
            : { breakdown: {}, total: 0 }
    ) as SummaryType;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <DashboardHeader
                title="Control de Salidas"
                tagline="SISTEMA INTEGRADO"
                subtitle="Registro institucional y auditoría de egresos operativos"
                icon={WalletCards}
                actions={
                    <div className="bg-slate-900 border-l-4 border-l-accent p-6 relative overflow-hidden group max-w-xl">
                        <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:scale-110 transition-all text-white pointer-events-none">
                            <AlertCircle size={48} />
                        </div>
                        <div className="flex gap-4 items-center relative z-10">
                            <div className="p-2 bg-accent/10 border border-accent/20 text-accent group-hover:bg-accent group-hover:text-primary transition-all shrink-0">
                                <AlertCircle size={14} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">
                                    Protocolo de Legalización
                                </h4>
                                <p className="text-[11px] text-slate-400 font-medium leading-tight">
                                    Es <span className="text-white font-bold italic underline decoration-accent/50">obligatorio</span> adjuntar soporte digital para conciliación inmediata.
                                </p>
                            </div>
                        </div>
                    </div>
                }
            />

            <div className="flex flex-col gap-12">
                {/* Registro Horizontal de Salida */}
                <div className="w-full">
                    <div className="bg-white border border-primary/20 shadow-[0_32px_64px_-16px_rgba(0,84,97,0.1)] overflow-hidden">
                        <div className="p-8 border-b-2 border-primary/5 bg-slate-50 flex items-center justify-between">
                            <h3 className="text-[11px] font-black uppercase text-primary tracking-[0.4em]">
                                Nuevo Registro de Salida
                            </h3>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white border border-primary/10">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Enlace Seguro Activo</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <ExpenseForm />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-12 space-y-12">
                    {/* Tarjetas de Inteligencia Financiera */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-primary/10 p-8 shadow-xl relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-125 transition-transform text-primary grayscale">
                                <TrendingDown size={120} />
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                                    <TrendingDown size={20} />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black uppercase text-primary tracking-[0.3em]">Total Ejecutado</span>
                                    <h3 className="text-[14px] font-black text-primary uppercase tracking-tighter">Pasivos Mensuales</h3>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-4xl font-black text-primary tracking-tighter font-mono">
                                    {formatCurrency(summary.total)}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 bg-accent animate-pulse" />
                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Corte: {new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-primary/10 p-8 shadow-xl relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-125 transition-transform text-primary grayscale">
                                <Receipt size={120} />
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                                    <Receipt size={20} />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black uppercase text-primary tracking-[0.3em]">Concentración</span>
                                    <h3 className="text-[14px] font-black text-primary uppercase tracking-tighter">Presupuesto Activo</h3>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-xl font-black text-primary truncate pr-16 uppercase tracking-tighter h-10 flex items-center">
                                    {Object.entries(summary.breakdown).sort(
                                        ([, a], [, b]) => (b as number) - (a as number)
                                    )[0]?.[0] || "No registra"}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 bg-primary/20" />
                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Mayor incidencia transaccional</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bitácora Técnica de Movimientos */}
                    <div className="bg-white border border-primary/10 shadow-2xl">
                        <div className="px-10 py-8 border-b border-primary/5 flex items-center justify-between bg-slate-50/50">
                            <div className="space-y-1">
                                <h3 className="text-[13px] font-black text-primary uppercase tracking-[0.3em]">
                                    Bitácora de Salidas
                                </h3>
                                <p className="text-[10px] text-slate-900 font-bold uppercase tracking-widest italic">
                                    Sincronización en tiempo real con tesorería
                                </p>
                            </div>
                            <div className="px-4 py-2 bg-white border border-primary/10 text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-3">
                                <Calendar size={14} className="text-accent" />
                                <span>Registro de Operaciones</span>
                            </div>
                        </div>

                        <div className="divide-y divide-primary/5">
                            {expenses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 px-10 text-center space-y-6">
                                    <div className="w-20 h-20 bg-slate-50 flex items-center justify-center border border-primary/5 opacity-30">
                                        <WalletCards size={40} className="text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">
                                            Sin registros auditados
                                        </p>
                                        <p className="text-[10px] text-primary font-bold tracking-widest leading-loose max-w-sm mx-auto uppercase">
                                            Todos los egresos han sido conciliados satisfactoriamente con la cuenta maestra.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                expenses.map((tx: ExpenseTransaction) => (
                                    <div
                                        key={tx.id}
                                        className="group flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-slate-50/50 transition-all gap-10 border-l-4 border-l-transparent hover:border-l-red-500"
                                    >
                                        <div className="flex items-start gap-6 flex-1 min-w-0">
                                            <div className="p-4 bg-white border border-primary/10 text-red-500 shrink-0 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                                                <TrendingDown size={22} />
                                            </div>
                                            <div className="space-y-3 flex-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-[13px] font-black text-primary uppercase tracking-tight truncate max-w-md">
                                                        {tx.descripcion}
                                                    </h4>
                                                    <ChevronRight size={14} className="text-primary/10 group-hover:text-red-400 transition-colors shrink-0" />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100/50 border border-primary/5 text-slate-900">
                                                        <Calendar size={12} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                                            {new Date(tx.fecha).toLocaleDateString("es-CO", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 bg-primary/20 group-hover:bg-red-500 transition-colors" />
                                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate max-w-[240px]">
                                                            {tx.asientos.find((a) => Number(a.debito) > 0)?.cuenta.nombre || "Sin Vincular"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 pt-6 md:pt-0">
                                            <div className="text-right space-y-1">
                                                <div className="text-2xl font-black text-red-600 tracking-tighter flex items-center justify-end gap-1 font-mono">
                                                    <span className="text-sm">-</span>
                                                    {formatCurrency(
                                                        tx.asientos.reduce((sum, a) => sum + Number(a.debito), 0)
                                                    )}
                                                </div>
                                                <span className="text-[9px] font-black text-primary/20 uppercase tracking-[0.3em]">Carga Financiera Total</span>
                                            </div>
                                            
                                            {tx.soporteUrl && (
                                                <a
                                                    href={tx.soporteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="h-12 w-12 flex items-center justify-center bg-white border border-primary/10 text-slate-900 hover:bg-accent hover:text-primary hover:border-accent transition-all shadow-sm hover:shadow-xl"
                                                    title="Auditar Soporte Digital"
                                                >
                                                    <ArrowUpRight size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {expenses.length > 0 && (
                            <div className="p-10 bg-slate-50/30 border-t border-primary/5">
                                <button className="h-14 w-full flex items-center justify-center gap-4 bg-white border border-primary/10 text-[11px] font-black uppercase text-primary/60 hover:text-primary hover:bg-slate-50 tracking-[0.3em] transition-all group">
                                    Acceder al Historial Maestro de Auditoría
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
