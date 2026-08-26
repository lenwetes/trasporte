import React from "react";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, TrendingUp, ShieldAlert, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ReceivablesMetricsSidebarProps {
  totalCartera: number;
  totalMora: number;
  totalLoans: number;
  morososCount: number;
  prestamosCount: number;
  filter: "ALL" | "MORA" | "PRESTAMOS" | "OBLIGACIONES";
  setFilter: (val: "ALL" | "MORA" | "PRESTAMOS" | "OBLIGACIONES") => void;
  isNotifying: boolean;
  handleNotifyMorosos: () => void;
}

export function ReceivablesMetricsSidebar({
  totalCartera,
  totalMora,
  totalLoans,
  morososCount,
  prestamosCount,
  filter,
  setFilter,
  isNotifying,
  handleNotifyMorosos
}: ReceivablesMetricsSidebarProps) {
  return (
    <div className="lg:col-span-4 space-y-10">
      {/* Master Card */}
      <div className="bg-white border border-primary/10 p-1 shadow-2xl relative overflow-hidden group">
          <div className="p-10 border border-primary/5 bg-slate-50/30 flex flex-col justify-between h-full relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                  <TrendingUp size={160} />
              </div>
              
              <div className="space-y-8 relative z-10">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex items-center justify-center border-2 border-primary/10 bg-white shadow-xl transition-all group-hover:scale-110 text-primary">
                          <CreditCard className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] leading-none">
                              Capital en Circulación
                          </span>
                          <span className="text-[9px] font-black text-accent uppercase tracking-[0.4em] mt-2">
                              CARTERA_TOTAL
                          </span>
                      </div>
                  </div>

                  <div className="space-y-2">
                      <div className="flex items-baseline gap-3">
                          <h3 className="text-4xl font-extrabold tracking-tighter transition-all font-mono text-primary">
                              {formatCurrency(totalCartera)}
                          </h3>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">COP</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Mora Alert Card */}
      <div className="bg-red-950 border-l-[6px] border-l-red-500 p-10 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 -rotate-45 translate-x-32 -translate-y-32 group-hover:scale-110 transition-transform pointer-events-none" />
          <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Morosidad</p>
                      <p className="text-[10px] font-bold text-red-300 uppercase tracking-widest mt-1">
                          {morososCount} Duedores Reportados
                      </p>
                  </div>
                  <ShieldAlert className="text-red-500 w-8 h-8" />
              </div>
              
              <div className="text-3xl font-mono font-black text-red-400">
                  {formatCurrency(totalMora)}
              </div>

              <Button 
                  variant="default"
                  className="w-full h-14 bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-none shadow-xl transition-all disabled:opacity-50"
                  onClick={() => filter === "MORA" ? handleNotifyMorosos() : setFilter("MORA")}
                  disabled={isNotifying || morososCount === 0}
              >
                  {isNotifying ? "ENVIANDO..." : (filter === "MORA" ? `NOTIFICAR A TODOS (${morososCount})` : "GESTIONAR MOROSOS")}
              </Button>
          </div>
      </div>

      {/* Loans Summary Card */}
      <div className="bg-blue-950 border-l-[6px] border-l-blue-500 p-10 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 -rotate-45 translate-x-32 -translate-y-32 group-hover:scale-110 transition-transform pointer-events-none" />
          <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Préstamos Activos</p>
                      <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-1">
                          {prestamosCount} Cuotas Pendientes
                      </p>
                  </div>
                  <Clock className="text-blue-400 w-8 h-8" />
              </div>
              
              <div className="text-3xl font-mono font-black text-blue-400">
                  {formatCurrency(totalLoans)}
              </div>

              <Button 
                  variant="outline"
                  className="w-full h-14 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-none shadow-xl transition-all"
                  onClick={() => setFilter("PRESTAMOS")}
              >
                  Ver Detalles de Préstamos
              </Button>
          </div>
      </div>
    </div>
  );
}
