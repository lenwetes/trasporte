import { prisma } from "@/lib/prisma";
import { FinanceService } from "@/services/finance.service";
import { serializeDecimal, formatCurrency } from "@/lib/utils";
import { TransaccionWithAsientos, ConceptoWithCuenta } from "@/types/finance";
import { CashMovementForm } from "@/components/modules/finance/cash-movement-form";
import { DailyMovementsTable } from "@/components/modules/finance/daily-movements-table";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { 
    Wallet, 
    ArrowUpCircle, 
    ArrowDownCircle, 
    TrendingUp, 
    History, 
    Calculator,
    Activity,
    ShieldCheck,
    BarChart3
} from "lucide-react";
import { CloseCashButton } from "@/components/modules/finance/close-cash-button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CajaMenorPage() {
    // 1. Obtener saldos de disponibilidad
    const balanceCaja = await FinanceService.getAccountBalanceByCode("110505");
    const saldoCaja = balanceCaja.success ? (balanceCaja.data as number) : 0;
    
    // Calculamos liquidez total (Todas las 11xx)
    const { prisma: db } = await import("@/lib/prisma");
    const liquidAccounts = await db.cuentaContable.findMany({
        where: { codigo: { startsWith: "11" } }
    });
    
    const liquidezPromises = liquidAccounts.map(acc => FinanceService.getAccountBalance(acc.id));
    const liquidezResults = await Promise.all(liquidezPromises);
    const totalLiquidez = liquidezResults.reduce((sum, res) => sum + (res.success ? Number(res.data) : 0), 0);

    // 2. Obtener movimientos del día
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const movimientosHoyRaw = await prisma.transaccion.findMany({
        where: {
            fecha: { gte: today, lt: tomorrow },
            tipo: { in: ["INGRESO", "EGRESO"] },
        },
        include: {
            asientos: { include: { cuenta: true } },
            tercero: { select: { nombres: true, apellidos: true } },
            creadoPor: { select: { nombres: true, apellidos: true } },
        },
        orderBy: { fecha: "desc" },
    });

    const movimientosHoy = JSON.parse(JSON.stringify(serializeDecimal(movimientosHoyRaw))) as TransaccionWithAsientos[];

    // 3. Calcular totales
    const ingresosHoy = movimientosHoy
        .filter((m) => m.tipo === "INGRESO")
        .reduce((sum, m) => sum + m.asientos.reduce((s, a) => s + Number(a.credito), 0), 0);

    const egresosHoy = movimientosHoy
        .filter((m) => m.tipo === "EGRESO")
        .reduce((sum, m) => sum + m.asientos.reduce((s, a) => s + Number(a.debito), 0), 0);

    // 4. Conceptos
    const conceptosRaw = await prisma.conceptoFinanciero.findMany({
        where: { activo: true },
        include: { cuenta: true },
        orderBy: { nombre: "asc" },
    });

    const conceptos = JSON.parse(JSON.stringify(serializeDecimal(conceptosRaw))) as ConceptoWithCuenta[];
    const conceptosIngreso = conceptos.filter((c) => c.tipo === "INGRESO");
    const conceptosEgreso = conceptos.filter((c) => c.tipo === "EGRESO");

    const stats = [
        {
            label: "Fondos de Maniobra",
            value: formatCurrency(saldoCaja),
            icon: Wallet,
            color: "text-primary",
            borderColor: "border-l-primary",
            indicator: "BALANCE ACTUAL",
            description: "CUENTA 110505 - CAJA GENERAL"
        },
        {
            label: "Ingreso en Jornada",
            value: formatCurrency(ingresosHoy),
            icon: ArrowUpCircle,
            color: "text-emerald-600",
            borderColor: "border-l-emerald-500",
            indicator: "RECAUDO DIARIO",
            description: "TOTAL ASENTADO HOY"
        },
        {
            label: "Gasto en Jornada",
            value: formatCurrency(egresosHoy),
            icon: ArrowDownCircle,
            color: "text-red-500",
            borderColor: "border-l-red-500",
            indicator: "SALIDA DIARIA",
            description: "OPERATIVO & CAJA MENOR"
        },
        {
            label: "Presupuesto Total",
            value: formatCurrency(totalLiquidez),
            icon: Calculator,
            color: "text-accent",
            borderColor: "border-l-accent",
            indicator: "LIQUIDEZ GLOBAL",
            description: "TOTAL CAJA & BANCOS (DISP)"
        }
    ];

    return (
        <div className="pb-32 space-y-16 animate-in fade-in slide-in-from-top-4 duration-1000">
            <DashboardHeader
                title="Centro de Control Financiero"
                tagline="TESORERÍA & GESTIÓN DE CAJA"
                subtitle="Monitoreo de flujo de efectivo bajo sistema de auditoría"
                icon={Activity}
                actions={
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 relative z-10 w-full md:w-auto">
                        {/* Compact Audit Indicators */}
                        <div className="bg-slate-900 border-l-[3px] border-l-accent px-6 py-2 flex items-center gap-6 shadow-xl">
                            <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                                <ShieldCheck className="h-4 w-4 text-accent" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1">Auditoría</span>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Activa</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1">Libro Mayor</span>
                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">Sincronizado</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1">Firma Digital</span>
                                    <span className="text-[9px] font-black text-accent uppercase tracking-widest leading-none">Validada</span>
                                </div>
                            </div>
                        </div>
                        
                        <CloseCashButton 
                            saldoActual={saldoCaja} 
                            movimientosHoy={movimientosHoy.length} 
                        />
                    </div>
                }
            />

            <div className="space-y-16">
                {/* Visualización Analítica de Activos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-1">
                    {stats.map((stat, i) => (
                        <div 
                            key={i} 
                            className={cn(
                                "relative overflow-hidden group bg-white border-2 border-slate-100 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 border-l-[6px]",
                                stat.borderColor
                            )}
                        >
                            <div className="p-8 h-full flex flex-col justify-between relative">
                                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
                                    <stat.icon size={120} />
                                </div>
                                
                                <div className="space-y-10 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.3em] block">
                                                {stat.indicator}
                                            </span>
                                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">
                                                {stat.label}
                                            </h4>
                                        </div>
                                        <div className={cn("h-10 w-10 flex items-center justify-center bg-slate-50 border border-slate-100 shadow-inner", stat.color)}>
                                            <stat.icon size={18} />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-baseline gap-2">
                                            <h3 className={cn("text-3xl font-black font-mono tracking-tighter truncate", stat.color)}>
                                                {stat.value}
                                            </h3>
                                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">COP</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] pt-4 border-t border-slate-50 flex items-center gap-2">
                                            {stat.description}
                                        </p>
                                    </div>
                                </div>
                                <div className={cn("absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700", stat.borderColor.replace('border-l', 'bg'))} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Espacio de Operaciones e Inteligencia - Stack Vertical */}
                <div className="flex flex-col gap-16">
                    {/* bloque 01: Terminal de Transacciones a Ancho Completo */}
                    <div className="grid grid-cols-1 gap-12 items-start">
                        <div className="w-full">
                            <div className="bg-white border border-primary/20 shadow-[40px_40px_80px_-20px_rgba(0,84,97,0.08)] overflow-hidden group">
                                <div className="p-8 border-b-2 border-primary bg-primary text-white flex justify-between items-center relative">
                                    <div className="absolute top-0 right-0 w-64 h-full bg-white/[0.03] -skew-x-12 translate-x-32" />
                                    <div className="space-y-1 relative z-10">
                                        <h3 className="text-sm font-black uppercase tracking-[0.3em]">Terminal de Transacciones Integrada</h3>
                                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Punto de Entrada Maestro Autorizado</p>
                                    </div>
                                    <Activity size={24} className="text-accent animate-pulse relative z-10" />
                                </div>
                                <div className="p-1">
                                    <CashMovementForm
                                        conceptosIngreso={conceptosIngreso}
                                        conceptosEgreso={conceptosEgreso}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* bloque 02: Kardex Técnico de Operaciones (Fila Inferior - Full Width) */}
                    <div className="space-y-10">
                        <div className="bg-white border border-primary/10 shadow-2xl flex flex-col min-h-[850px]">
                            <div className="px-10 py-10 border-b border-primary/5 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4 text-primary">
                                        <History className="h-6 w-6 text-accent" />
                                        <h3 className="text-[16px] font-black uppercase tracking-[0.4em]">Kardex de Operaciones</h3>
                                    </div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] pl-10 leading-none">Visor de Movimientos Intradiarios</p>
                                </div>
                                <div className="flex items-center gap-4 px-6 py-3 bg-white border border-primary/10 shadow-sm">
                                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Sincronizado</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-x-auto">
                                <DailyMovementsTable movimientos={movimientosHoy} />
                            </div>

                            <div className="p-10 bg-slate-50 border-t border-primary/5 flex flex-col sm:flex-row justify-between items-center gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="flex -space-x-3">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="h-8 w-8 rounded-none border-[3px] border-white bg-primary text-[10px] font-black text-white flex items-center justify-center">
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Verificación Multinivel</span>
                                        <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Cumplimiento PESV</span>
                                    </div>
                                </div>
                                <Button 
                                    className="h-14 px-10 text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-4 group rounded-none"
                                    variant="outline"
                                >
                                    Auditoría Maestra 
                                    <BarChart3 className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
