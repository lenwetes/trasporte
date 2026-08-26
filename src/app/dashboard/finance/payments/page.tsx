import { prisma } from "@/lib/prisma";
import {
    CreditCard,
    Search,
    Landmark,
    Receipt,
    CalendarCheck,
    ShieldCheck,
    Users,
    AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { serializeDecimal } from "@/lib/utils";
import { ObligationsList } from "@/components/modules/finance/obligations-list";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Recaudos y Cartera | Coopetraes",
};

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
    // 1. Fetch all pending obligations
    const obligationsRaw = await prisma.obligacionFinanciera.findMany({
        where: { estado: { not: "ANULADO" } },
        include: { usuario: true, vehiculo: true },
        orderBy: [{ estado: "asc" }, { fechaVence: "asc" }],
    });

    // Serialize completely to avoid Decimal/Date issues
    const obligations = JSON.parse(
        JSON.stringify(serializeDecimal(obligationsRaw)),
    );

    return (
        <div className="space-y-8 pb-12">
            <DashboardHeader
                title="Gestión de Recaudos"
                tagline="Caja y Cartera"
                subtitle="Administración de obligaciones pendientes y fiscalización de ingresos operativos"
                icon={Landmark}
                iconGradient="from-indigo-600 to-emerald-600"
            />

            <div className="grid gap-8">
                {/* Control Panel: Search & Insight Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Search & Filter */}
                    <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 group-focus-within:text-emerald-500 transition-colors">
                                <Search size={20} />
                            </div>
                            <Input
                                placeholder="Consultar por nombre de asociado o placa vehicular..."
                                className="h-14 pl-12 bg-slate-50 border-transparent focus:bg-white focus:border-emerald-200 rounded-xl text-sm font-medium transition-all"
                            />
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Receipt size={60} className="text-white" />
                            </div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest pl-0.5">Cartera Total</span>
                                    <div className="text-3xl font-black text-white tracking-tighter">
                                        {obligations.length}
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-900">
                                        Compromisos exigibles
                                    </p>
                                </div>
                                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                                    <Receipt className="text-emerald-400" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main List Section */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div>
                            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                                Cartera Activa y Exigible
                            </h3>
                            <p className="text-xs text-slate-900 font-medium">
                                Auditoría pormenorizada de obligaciones financieras por cobrar
                            </p>
                        </div>
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl flex items-center gap-2 shadow-sm">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                Registros Convalidados
                            </span>
                        </div>
                    </div>

                    <div className="p-2">
                        <ObligationsList obligations={obligations} />
                    </div>
                </div>

                {obligations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6">
                            <CreditCard size={32} className="text-slate-200" />
                        </div>
                        <div className="max-w-xs space-y-2">
                            <h3 className="text-lg font-bold text-slate-900">
                                Gestión al Día
                            </h3>
                            <p className="text-sm text-slate-900 font-medium">
                                No se detectan obligaciones financieras exigibles en el periodo actual. Excelente desempeño de cartera.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
