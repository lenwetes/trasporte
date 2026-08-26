import {
    ArrowUpCircle,
    ArrowDownCircle,
    History,
    ArrowRightLeft,
    Search,
    Filter,
    FileText,
    Download,
    Eye,
    ChevronRight,
    TrendingUp,
    Calendar as CalendarIcon
} from "lucide-react";
import { serializeDecimal, formatCurrency } from "@/lib/utils";
import { DownloadReceiptButton } from "@/components/modules/finance/download-receipt-button";
import { FinanceService } from "@/services/finance.service";
import { Metadata } from "next";
import { TipoTransaccion, Prisma } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TransaccionWithRelations } from "@/types";

export const metadata: Metadata = {
    title: "Libro Auxiliar de Caja | Coopetraes",
};

export const dynamic = "force-dynamic";

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; type?: string; search?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const type = params.type as TipoTransaccion;
    const search = params.search;

    const result = await FinanceService.getTransactions({
        page,
        pageSize: 20,
        type: type || undefined,
        search,
    });

    const resultData = result.data as unknown as { data: TransaccionWithRelations[] };
    const transactionsData = result.success && resultData?.data ? resultData.data : [];

    const transactions = JSON.parse(
        JSON.stringify(serializeDecimal(transactionsData)),
    );

    return (
        <div className="min-h-screen bg-slate-50/50">
            <DashboardHeader
                title="Libro Auxiliar de Caja"
                tagline="Auditoría & Trazabilidad"
                subtitle="Registro histórico de todos los eventos contables y movimientos de fondo"
                icon={History}
                iconGradient="from-primary to-slate-600"
                actions={
                    <div className="flex gap-3">
                        <Button variant="outline" className="h-10 rounded-none border-primary/10 bg-white text-[10px] font-black uppercase tracking-widest px-6 gap-2">
                            <Download className="h-4 w-4" /> Exportar LIBRO
                        </Button>
                        <Button className="h-10 rounded-none bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 gap-2">
                            <TrendingUp className="h-4 w-4 text-accent" /> Nueva Operación
                        </Button>
                    </div>
                }
            />

            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 pb-20">
                <div className="bg-white border border-primary/10 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                    {/* Filter Bar */}
                    <div className="p-4 bg-slate-50 border-b border-primary/5 flex flex-wrap gap-4 items-center">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                            <Input 
                                placeholder="BUSCAR POR DESCRIPCIÓN, TERCERO O COMPROBANTE..." 
                                defaultValue={search || ""}
                                className="h-12 pl-12 rounded-none border-primary/10 bg-white text-xs font-bold uppercase tracking-tight"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" className="h-12 rounded-none border border-primary/5 bg-white text-[10px] font-black uppercase tracking-widest gap-2 px-6">
                                <Filter className="h-4 w-4 text-slate-900" /> Tipo
                            </Button>
                            <Button variant="ghost" className="h-12 rounded-none border border-primary/5 bg-white text-[10px] font-black uppercase tracking-widest gap-2 px-6">
                                <CalendarIcon className="h-4 w-4 text-slate-900" /> Fecha
                            </Button>
                        </div>
                    </div>

                    {/* Table / List View */}
                    <div className="flex-1">
                        {transactions.map((tx: TransaccionWithRelations) => {
                            const isIngreso = tx.tipo === "INGRESO";
                            const monto = tx.asientos?.reduce((sum: number, as: { debito: number | string | Prisma.Decimal; credito: number | string | Prisma.Decimal }) => 
                                sum + (Number(as.debito) || Number(as.credito)), 0) || 0;
                            
                            return (
                                <div 
                                    key={tx.id} 
                                    className="group grid grid-cols-1 md:grid-cols-12 gap-6 p-6 border-b border-primary/5 hover:bg-slate-50/80 transition-all items-center"
                                >
                                    <div className="md:col-span-1 flex justify-center">
                                        <div className={cn(
                                            "h-12 w-12 flex items-center justify-center border transition-transform group-hover:scale-110",
                                            isIngreso ? "bg-accent/10 border-accent/20 text-accent" : (tx.tipo === "EGRESO" ? "bg-red-50 border-red-200 text-red-600" : "bg-slate-100 border-primary/10 text-slate-900")
                                        )}>
                                            {isIngreso ? <ArrowUpCircle className="h-6 w-6" /> : 
                                             tx.tipo === "EGRESO" ? <ArrowDownCircle className="h-6 w-6" /> : <History className="h-6 w-6" />}
                                        </div>
                                    </div>

                                    <div className="md:col-span-5 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">
                                                ID: {tx.id.slice(0, 8).toUpperCase()}
                                            </span>
                                            <Badge variant="outline" className={cn(
                                                "rounded-none h-4 px-1.5 text-[8px] font-black uppercase tracking-widest border-primary/10",
                                                isIngreso ? "text-accent bg-accent/5" : "text-red-700 bg-red-50"
                                            )}>
                                                {tx.tipo}
                                            </Badge>
                                        </div>
                                        <h3 className="text-xs font-black text-primary uppercase tracking-tight group-hover:text-accent transition-colors leading-tight">
                                            {tx.descripcion}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                            <FileText className="h-3 w-3" />
                                            TERCERO: {tx.proveedor?.nombres || (tx.tercero ? `${tx.tercero.nombres} ${tx.tercero.apellidos || ""}` : "ADMINISTRACIÓN CENTRAL")}
                                        </div>
                                    </div>

                                    <div className="md:col-span-3">
                                        <div className="space-y-1 md:text-center">
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Fecha Operativa</p>
                                            <p className="text-[11px] font-black text-primary uppercase">
                                                {format(new Date(tx.fecha), "PPP", { locale: es })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="md:col-span-3 flex flex-col items-end gap-3">
                                        <div className="text-right">
                                            <p className={cn(
                                                "text-xl font-black font-mono tracking-tighter leading-none",
                                                isIngreso ? "text-accent" : "text-red-600"
                                            )}>
                                                {isIngreso ? "+" : "-"}{formatCurrency(monto)}
                                            </p>
                                            <p className="text-[9px] font-black text-primary/20 uppercase tracking-widest mt-1">Auditado v1.0</p>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="outline" size="sm" className="h-8 rounded-none border-primary/10 text-[9px] font-black uppercase tracking-widest gap-1 bg-white">
                                                <Eye className="h-3 w-3" /> Detalle
                                            </Button>
                                            <DownloadReceiptButton transaccionId={tx.id} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {transactions.length === 0 && (
                            <div className="py-40 flex flex-col items-center justify-center space-y-4">
                                <History className="h-16 w-16 text-primary/5" />
                                <div className="text-center space-y-1">
                                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">Sin Movimientos</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase max-w-xs leading-relaxed"> No se han detectado operaciones financieras registradas con los filtros actuales.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="p-6 bg-slate-50 border-t border-primary/5 flex justify-between items-center">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Mostrando registros de auditoría 1-20</p>
                        <div className="flex gap-2">
                            <Button disabled className="h-10 w-10 p-0 rounded-none border border-primary/10 bg-white text-primary">
                                1
                            </Button>
                            <Button variant="ghost" className="h-10 rounded-none border border-primary/5 bg-white text-[10px] font-black uppercase tracking-widest px-6 gap-2">
                                Siguiente <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
