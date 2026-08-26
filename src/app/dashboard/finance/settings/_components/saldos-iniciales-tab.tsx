"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
    Database, 
    DollarSign, 
    Calendar, 
    FileText, 
    CheckCircle2, 
    Loader2, 
    ShieldCheck,
    History,
    PiggyBank,
    Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInput } from "@/components/ui/currency-input";
import { toast } from "sonner";
import { createCashMovement } from "@/actions/finance/cash-movements";
import { MetodoPago } from "@prisma/client";
import { cn } from "@/lib/utils";

import type { ConfigForm } from "./types";

interface SaldosInicialesTabProps {
    configForm: ConfigForm;
}

export function SaldosInicialesTab({ configForm }: SaldosInicialesTabProps) {
    const [accountBalances, setAccountBalances] = useState<Record<string, string>>({});
    const [fechaCorte, setFechaCorte] = useState<string>(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!configForm) return null;

    const accounts = [
        { id: configForm.cuentaCajaId, label: "Caja General", type: MetodoPago.EFECTIVO, icon: Wallet },
        { id: configForm.cuentaBancosId, label: "Cuentas Bancarias", type: MetodoPago.TRANSFERENCIA, icon: PiggyBank },
        { id: configForm.cuentaPrestamosId, label: "Cartera de Préstamos", type: MetodoPago.EFECTIVO, icon: History },
    ].filter(acc => acc.id && acc.id !== "");

    const handleBalanceChange = (accountId: string, value: string) => {
        setAccountBalances(prev => ({ ...prev, [accountId]: value }));
    };

    const handleExecuteApertura = async () => {
        const entries = Object.entries(accountBalances).filter(([_, val]) => val !== "" && parseFloat(val) > 0);
        
        if (entries.length === 0) {
            toast.error("Ingrese al menos un saldo para iniciar la apertura");
            return;
        }

        if (!confirm("¿Está seguro de consolidar estos balances iniciales? Esta acción generará asientos contables definitivos.")) {
            return;
        }

        setIsSubmitting(true);
        let successCount = 0;

        try {
            for (const [accountId, amountStr] of entries) {
                const accInfo = accounts.find(a => a.id === accountId);
                const result = await createCashMovement({
                    tipo: "SALDO_INICIAL",
                    conceptoId: "", 
                    monto: parseFloat(amountStr),
                    detallesPago: [{
                        metodo: accInfo?.type || MetodoPago.EFECTIVO,
                        monto: parseFloat(amountStr)
                    }],
                    descripcion: `APERTURA TÉCNICA - ${accInfo?.label || "CUENTA CONTABLE"}`,
                    fechaOperacion: new Date(fechaCorte),
                });

                if (result.success) {
                    successCount++;
                    // Pequeño delay para evitar colisiones en ráfaga
                    await new Promise(r => setTimeout(r, 500));
                } else {
                    toast.error(`Error en ${accInfo?.label}: ${result.error}`);
                }
            }

            if (successCount === entries.length) {
                toast.success(`Carga exitosa: ${successCount} cuentas inicializadas`);
                setAccountBalances({});
            } else if (successCount > 0) {
                toast.warning(`Carga parcial: ${successCount} de ${entries.length} cuentas procesadas`);
            }
        } catch (error) {
            toast.error("Error en el proceso de migración masiva");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header de Gestión */}
            <div className="bg-primary p-8 md:p-10 text-white relative overflow-hidden group">
                <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 transition-transform group-hover:scale-110">
                    <Database size={240} />
                </div>
                <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-8 bg-accent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Admin Core</span>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">Migración de Saldos Iniciales</h2>
                    <p className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest max-w-xl">
                        Establezca el balance de apertura histórico de la cooperativa para inicializar la contabilidad post-migración.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Formulario Dinámico de Cuentas */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Selector de Fecha Histórica */}
                    <div className="bg-white p-6 border-l-4 border-accent shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Fecha de Inicio de Libros</h3>
                        </div>
                        <div className="max-w-xs">
                            <Input 
                                type="date"
                                value={fechaCorte}
                                onChange={(e) => setFechaCorte(e.target.value)}
                                className="h-12 rounded-none border-2 border-primary/10 text-[11px] font-mono font-bold bg-white focus:border-primary transition-all"
                            />
                            <p className="text-[8px] text-slate-400 font-bold uppercase mt-2 italic">
                                * Los balances se registrarán con esta fecha en el libro mayor.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {accounts.map((acc) => (
                            <div key={acc.id} className="space-y-3 bg-white p-6 border-b-4 border-primary shadow-sm hover:translate-x-1 transition-transform">
                                <div className="flex items-center justify-between border-b border-primary/5 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-accent" />
                                        <span className="text-[10px] font-black uppercase text-primary tracking-widest">{acc.label}</span>
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 font-mono">ID: {acc.id.substring(0,8)}...</span>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-primary/40 block">Saldo de Apertura</label>
                                    <CurrencyInput 
                                        value={accountBalances[acc.id] || ""}
                                        onChange={(val) => handleBalanceChange(acc.id, val)}
                                        className="h-12 text-xl font-black font-mono tracking-tighter"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {accounts.length === 0 ? (
                        <div className="h-40 border-2 border-dashed border-primary/10 flex flex-col items-center justify-center space-y-4 opacity-50">
                            <Database size={32} className="text-primary" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">No hay cuentas contables configuradas aún.</p>
                        </div>
                    ) : (
                        <Button 
                            onClick={handleExecuteApertura}
                            disabled={isSubmitting}
                            className="w-full h-16 rounded-none bg-primary text-secondary hover:bg-primary/90 font-black text-[12px] uppercase tracking-[0.3em] gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all mt-6"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20} /> Consolidar Balances de Apertura</>}
                        </Button>
                    )}
                </div>

                {/* Panel Informativo de Reglas */}
                <div className="lg:col-span-4 bg-slate-100 p-8 space-y-8 border-l-4 border-primary">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <History size={16} className="text-primary" />
                            <h3 className="text-sm font-black uppercase tracking-wider text-primary">Reglas de Integridad</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <div className="h-5 w-5 bg-white border-2 border-primary shrink-0 flex items-center justify-center font-black text-[10px]">1</div>
                                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight leading-relaxed">
                                    Este proceso genera un asiento contable de contrapartida automática a la cuenta de <span className="text-primary">Aportes Sociales (311505)</span>.
                                </p>
                            </li>
                            <li className="flex gap-4">
                                <div className="h-5 w-5 bg-white border-2 border-primary shrink-0 flex items-center justify-center font-black text-[10px]">2</div>
                                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight leading-relaxed">
                                    No se requiere seleccionar un tercero, ya que el origen es el balance general consolidado de la instalación previa.
                                </p>
                            </li>
                            <li className="flex gap-4">
                                <div className="h-5 w-5 bg-white border-2 border-primary shrink-0 flex items-center justify-center font-black text-[10px]">3</div>
                                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight leading-relaxed">
                                    Las fechas históricas no afectan el flujo de caja del mes actual, pero sí inicializan los estados financieros globales.
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 border-2 border-primary/5 border-dashed space-y-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-900 block mb-1">Resumen Fiscal</span>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-primary">AUDITORÍA ACTIVA</span>
                            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                        <p className="text-[8px] text-slate-900 font-bold leading-tight uppercase">
                            Cada ejecución de este módulo queda registrada permanentemente en el historial de configuraciones críticas del sistema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
