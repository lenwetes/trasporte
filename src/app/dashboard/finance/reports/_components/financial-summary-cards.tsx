import { formatCurrency } from "@/lib/utils";
import { FinancialReportData } from "@/types/finance";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Wallet, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialSummaryCardsProps {
    report: FinancialReportData;
}

export function FinancialSummaryCards({ report }: FinancialSummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Facturación Bruta */}
            <SummaryCard
                title="Facturación Bruta"
                subtitle="INGRESOS OPERACIONALES (4)"
                value={report.ingresos.total}
                icon={DollarSign}
                type="income"
                badge="REAL-TIME"
            />

            {/* Carga Operativa */}
            <SummaryCard
                title="Carga Operativa"
                subtitle="COSTOS & GASTOS (5, 6)"
                value={report.gastos.total + report.costos.total}
                icon={Activity}
                type="expense"
                badge="CONSOLIDADO"
            />

            {/* Margen de Operación */}
            <SummaryCard
                title="Margen Operativo"
                subtitle="EXCEDENTE BRUTO"
                value={report.utilidadBruta}
                icon={TrendingUp}
                type="neutral"
                percentage={report.ingresos.total > 0 ? (report.utilidadBruta / report.ingresos.total) * 100 : 0}
            />

            {/* Utilidad Neta */}
            <SummaryCard
                title="Utilidad Neta"
                subtitle="BALANCE FINAL"
                value={report.utilidadNeta}
                icon={PieChart}
                type="accent"
            />
        </div>
    );
}

function SummaryCard({ 
    title, 
    subtitle, 
    value, 
    icon: Icon, 
    type,
    badge,
    percentage
}: { 
    title: string; 
    subtitle: string; 
    value: number; 
    icon: any; 
    type: 'income' | 'expense' | 'neutral' | 'accent';
    badge?: string;
    percentage?: number;
}) {
    const isPositive = type === 'income' || (type === 'neutral' && value > 0) || (type === 'accent' && value > 0);
    
    return (
        <div className={cn(
            "bg-white border-2 border-primary/5 p-6 relative overflow-hidden group transition-all duration-300 hover:border-primary/20",
            type === 'accent' ? "bg-primary text-white border-none shadow-2xl" : ""
        )}>
            {/* Background Geometric Decor */}
            <div className={cn(
                "absolute -right-2 -bottom-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-125 duration-700 pointer-events-none",
                type === 'accent' ? "text-white opacity-10" : "text-primary"
            )}>
                <Icon size={120} />
            </div>

            <div className="flex justify-between items-start mb-6 relative">
                <div className={cn(
                    "h-10 w-10 flex items-center justify-center border-2 border-primary/10 transition-colors group-hover:bg-primary group-hover:text-white",
                    type === 'accent' ? "border-white/20 bg-white/10 group-hover:bg-accent group-hover:text-primary group-hover:border-accent" : "bg-primary/5 text-primary"
                )}>
                    <Icon size={20} className="transition-transform group-hover:scale-110" />
                </div>
                {badge && (
                    <span className={cn(
                        "text-[8px] font-black tracking-widest px-2 py-0.5 border italic",
                        type === 'accent' ? "bg-accent text-primary border-accent" : "bg-primary text-white border-primary"
                    )}>
                        {badge}
                    </span>
                )}
                {percentage !== undefined && (
                    <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 italic">
                        <TrendingUp size={10} />
                        {percentage.toFixed(1)}%
                    </span>
                )}
            </div>

            <div className="relative">
                <p className={cn(
                    "text-[8px] font-bold uppercase tracking-[0.2em] mb-1",
                    type === 'accent' ? "text-white/70" : "text-primary/60"
                )}>
                    {subtitle}
                </p>
                <h3 className={cn(
                    "text-xs font-black uppercase tracking-widest mb-2",
                    type === 'accent' ? "text-accent" : "text-primary/80"
                )}>
                    {title}
                </h3>
                <h4 className={cn(
                    "text-3xl font-black italic tracking-tighter leading-none mb-1",
                    type === 'accent' ? "text-white" : "text-primary"
                )}>
                    {formatCurrency(value)}
                </h4>
                
                {type !== 'accent' && (
                    <div className="h-1 w-full bg-primary/5 mt-4 overflow-hidden">
                        <div 
                            className={cn(
                                "h-full transition-all duration-1000 delay-300",
                                value > 0 ? (type === 'expense' ? "bg-red-500" : "bg-accent") : "bg-slate-200"
                            )} 
                            style={{ width: '65%' }} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
