import { getFinancialStats } from "@/actions/dashboard-overview";
import { FinancialMiniDashboard } from "../financial-mini-dashboard";

export async function FinancialStatsWidget() {
    const result = await getFinancialStats();
    const data = (result.success && result.data) ? result.data : { recaudoMes: 0, carteraTotal: 0, cajaBalance: 0 };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="space-y-6">
            <FinancialMiniDashboard />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-100 p-6 flex flex-col justify-center gap-1 shadow-sm border-l-4 border-l-emerald-500 hover:shadow-lg transition-all">
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">RECAUDO MES ACTUAL</p>
                    <p className="text-2xl font-black text-emerald-600 font-mono tracking-tighter leading-none">{formatCurrency(data.recaudoMes)}</p>
                </div>
                <div className="bg-white border border-slate-100 p-6 flex flex-col justify-center gap-1 shadow-sm border-l-4 border-l-red-500 hover:shadow-lg transition-all">
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">CARTERA TOTAL PENDIENTE</p>
                    <p className="text-2xl font-black text-red-600 font-mono tracking-tighter leading-none">{formatCurrency(data.carteraTotal)}</p>
                </div>
            </div>
        </div>
    );
}
