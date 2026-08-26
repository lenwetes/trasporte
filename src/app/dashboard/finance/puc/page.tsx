import { FinanceService } from "@/services/finance.service";
import { 
    Database, 
    ChevronRight, 
    Search,
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PUCDatePicker } from "./_components/date-picker";
import { CuentaConHijos } from "@/services/finance/finance-accounts.service";

export const metadata = {
    title: "Plan Único de Cuentas | Coopetraes",
};

interface PUCNodeProps {
    cuenta: CuentaConHijos;
    nivel: number;
}

function PUCNode({ cuenta, nivel }: PUCNodeProps) {
    const hasChildren = cuenta.hijos && cuenta.hijos.length > 0;
    const isAuxiliary = cuenta.permiteMovimiento;
    const balance = cuenta.balance?.saldo || 0;

    return (
        <div className="group">
            <div className={cn(
                "flex items-center gap-4 py-3 px-4 border-b border-primary/5 hover:bg-slate-50 transition-colors",
                nivel === 0 ? "bg-slate-100/50" : ""
            )}>
                <div 
                    className="flex items-center gap-2"
                    style={{ paddingLeft: `${nivel * 20}px` }}
                >
                    {hasChildren ? (
                        <ChevronRight size={14} className="text-slate-900 group-hover:text-primary transition-transform group-hover:rotate-90" />
                    ) : (
                        <div className="w-[14px]" />
                    )}
                    <span className={cn(
                        "text-[11px] font-black tracking-tighter w-16",
                        isAuxiliary ? "text-primary" : "text-slate-900"
                    )}>
                        {cuenta.codigo}
                    </span>
                </div>

                <span className={cn(
                    "text-[11px] font-black uppercase tracking-widest flex-1 truncate",
                    !isAuxiliary ? "text-primary/50" : "text-primary"
                )}>
                    {cuenta.nombre}
                </span>

                <div className="flex items-center gap-6">
                    <div className="text-right w-32">
                        <span className={cn(
                            "text-[10px] font-mono font-bold",
                            Number(balance) < 0 ? "text-red-500" : "text-emerald-600"
                        )}>
                            $ {Number(balance).toLocaleString()}
                        </span>
                    </div>
                    <div className="w-20 text-right">
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest italic">
                            {cuenta.naturaleza === "DEBITO" ? "DB" : "CR"}
                        </span>
                    </div>
                </div>
            </div>
            
            {hasChildren && (
                <div className="hidden group-hover:block">
                    {cuenta.hijos.map((hijo) => (
                        <PUCNode key={hijo.id} cuenta={hijo} nivel={nivel + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default async function PUCPage({
    searchParams,
}: {
    searchParams: { date?: string };
}) {
    const historicalDate = searchParams.date ? new Date(searchParams.date) : new Date();
    const tree = await FinanceService.getAccountTree(historicalDate);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Corporativo */}
            <div className="flex justify-between items-end border-b-2 border-primary pb-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-4 bg-accent animate-pulse" />
                        <h1 className="text-[20px] font-black text-primary uppercase tracking-[0.4em]">Plan Único de Cuentas</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] bg-slate-100 px-3 py-1">Vigencia 2026</span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-2">
                            <ShieldCheck size={12} /> Consolidación Auditada
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6 pr-4">
                    <PUCDatePicker />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Activos (1)", val: "$ 0.00", icon: TrendingUp },
                    { label: "Pasivos (2)", val: "$ 0.00", icon: Database },
                    { label: "Patrimonio (3)", val: "$ 0.00", icon: ShieldCheck },
                    { label: "Resultado (4/5)", val: "$ 0.00", icon: TrendingUp },
                ].map((stat, i) => (
                    <div key={i} className="p-4 ring-1 ring-primary/5 bg-slate-50 border-r-2 border-primary/20 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <stat.icon size={14} className="text-primary" />
                            <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest italic">Live Ledger</span>
                        </div>
                        <p className="text-[9px] font-black text-primary/60 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <p className="text-[14px] font-black text-primary uppercase tracking-widest">{stat.val}</p>
                    </div>
                ))}
            </div>

            {/* Tree Container */}
            <div className="ring-1 ring-primary/10 bg-white shadow-2xl overflow-hidden border-t-4 border-primary">
                <div className="bg-primary/5 px-6 py-4 flex justify-between items-center border-b border-primary/10">
                    <div className="flex items-center gap-2">
                        <Search size={14} className="text-slate-900" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Jerarquía de Cuentas PUC v4.0</span>
                    </div>
                    <div className="flex gap-8">
                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Saldo Contable</span>
                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest w-20 text-right">Nat</span>
                    </div>
                </div>
                
                <div className="max-h-[800px] overflow-y-auto">
                    {tree && tree.map((node) => (
                        <PUCNode key={node.id} cuenta={node} nivel={0} />
                    ))}
                </div>
            </div>

            {/* Footer Técnico */}
            <div className="flex justify-between items-center pt-8 border-t border-primary/10">
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">
                    System Core: Finance Ledger v3 // Audit Ready // © 2026 Coopetraes
                </p>
                <div className="h-1.5 w-32 bg-slate-100 relative overflow-hidden rounded-full">
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-primary animate-move-progress" />
                </div>
            </div>
        </div>
    );
}
