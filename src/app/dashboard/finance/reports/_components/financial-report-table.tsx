import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { FinancialReportData } from "@/types/finance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface FinancialReportTableProps {
    report: FinancialReportData;
}

export function FinancialReportTable({ report }: FinancialReportTableProps) {
    return (
        <Card className="rounded-none border-primary/10 bg-white shadow-2xl overflow-hidden border-none">
            <div className="p-8 border-b-2 border-slate-100 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-1 bg-accent" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] leading-none">
                            Balance de Resultados <span className="text-slate-900">Consolidado</span>
                        </h3>
                    </div>
                    <p className="text-[10px] text-slate-900 font-black uppercase tracking-widest pl-5">
                        Estándar NIIF para Pymes • Auditoría Técnica de Flujos
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2 shrink-0">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">Divisa de Reporte</p>
                        <p className="text-[11px] font-black text-slate-900 uppercase">COP - Pesos Colombianos</p>
                    </div>
                </div>
            </div>

            <CardContent className="p-0">
                <Table className="border-collapse">
                    <TableHeader className="bg-slate-50 border-b-2 border-slate-200">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-12 text-[10px] font-black uppercase text-slate-900 tracking-widest py-0 px-8">Código / Cuenta Contable</TableHead>
                            <TableHead className="h-12 text-[10px] font-black uppercase text-slate-900 tracking-widest py-0 text-right px-8">Valor Causado (COP)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* INGRESOS */}
                        <AccountGroup
                            id="ING"
                            title="INGRESOS OPERACIONALES"
                            code="4"
                            total={report.ingresos.total}
                            items={report.ingresos.cuentas}
                            type="income"
                        />

                        {/* COSTOS */}
                        {report.costos.total > 0 && (
                            <AccountGroup
                                id="COS"
                                title="COSTOS DE OPERACIÓN"
                                code="6"
                                total={report.costos.total}
                                items={report.costos.cuentas}
                                type="expense"
                            />
                        )}

                        {/* RESULTADO BRUTO */}
                        <TableRow className="!bg-slate-900 !text-white border-y-4 border-white/10 hover:!bg-slate-800 transition-all">
                            <TableCell className="py-5 px-8 text-[11px] font-black uppercase tracking-widest italic !text-white">UTILIDAD BRUTA (EXCEDENTE OPERATIVO)</TableCell>
                            <TableCell className="py-5 px-8 text-right text-lg font-black italic tracking-tighter !text-white">
                                {formatCurrency(report.utilidadBruta)}
                            </TableCell>
                        </TableRow>

                        {/* GASTOS */}
                        <AccountGroup
                            id="GAS"
                            title="GASTOS ADMINISTRATIVOS"
                            code="5"
                            total={report.gastos.total}
                            items={report.gastos.cuentas}
                            type="expense"
                        />

                        {/* RESULTADO NETO */}
                        <TableRow className="!bg-primary !text-white border-t-4 border-accent hover:!bg-primary transition-all">
                            <TableCell className="py-6 px-6">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-white/70 uppercase tracking-[0.3em] mb-1">Cierre de Periodo Fiscal</span>
                                    <span className="text-sm font-black uppercase tracking-tight italic">Utilidad Neta del Ejercicio</span>
                                </div>
                            </TableCell>
                            <TableCell className="py-6 px-6 text-right">
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] font-bold text-white/70 uppercase tracking-widest mb-1">Total Consolidado</span>
                                    <span className="text-xl font-black italic text-accent">
                                        {formatCurrency(report.utilidadNeta)}
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function AccountGroup({ 
    id, 
    title, 
    code, 
    total, 
    items,
    type 
}: { 
    id: string; 
    title: string; 
    code: string; 
    total: number;
    items: Record<string, { nombre: string, valor: number }>;
    type: 'income' | 'expense';
}) {
    return (
        <>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50 border-primary/5">
                <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-primary text-white rounded-none h-6 px-2 text-[10px] font-black">{code}</Badge>
                        <span className="text-xs font-black text-primary uppercase tracking-tight">{title}</span>
                    </div>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                    <span className={cn(
                        "text-sm font-black",
                        type === 'income' ? "text-emerald-600" : "text-red-600"
                    )}>
                        {type === 'income' ? '+' : '-'}{formatCurrency(total)}
                    </span>
                </TableCell>
            </TableRow>
            {Object.entries(items).map(([accountCode, data]) => (
                <TableRow key={accountCode} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="py-3 px-8 pl-16 border-l-4 border-slate-100 group-hover:border-accent transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-900 group-hover:text-slate-900 transition-colors">{accountCode}</span>
                            <span className="text-[11px] font-black text-slate-600 uppercase group-hover:text-slate-900 transition-colors">{data.nombre}</span>
                        </div>
                    </TableCell>
                    <TableCell className="py-3 px-8 text-right text-[11px] font-black text-slate-900">
                        {formatCurrency(data.valor)}
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}
