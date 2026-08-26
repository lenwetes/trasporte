import React from "react";
import { Calculator, ShieldCheck, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { DashboardData } from "@/types";

export function LoansRiskWidget({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-6">
       <Card className="rounded-none border-none shadow-2xl bg-primary text-white overflow-hidden relative">
          <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
              <Calculator size={160} />
          </div>
          <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-white/20 pb-4">
                    <ShieldCheck className="h-5 w-5 text-accent" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-white italic">Control de Riesgo y Cartera</span>
                </div>
              
              <div className="space-y-8">
                  <div>
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2 italic">Total Colocado en Mercado</p>
                      <h4 className="text-4xl font-black italic tracking-tighter text-white mb-3">
                         {formatCurrency(data.totalPrestado)}
                      </h4>
                      <Badge className="bg-slate-950 text-white border-none rounded-2xl px-3 py-1 font-black text-[10px] uppercase">
                          Cumplimiento: 0.0%
                      </Badge>
                  </div>

                  <div className="pt-6 border-t border-white/20 space-y-6">
                      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-tighter italic">
                          <span className="text-white/60">Índice de Mora (IMB)</span>
                          <span className="text-emerald-400">0.00%</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-tighter italic">
                          <span className="text-white/60">Recaudado este mes</span>
                          <span className="text-accent underline">$0</span>
                      </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 italic">
                     <p className="text-[10px] font-medium text-white/50 leading-relaxed uppercase tracking-tighter">
                        EL CÁLCULO DE INTERÉS {data.totalPrestado > 0 ? "DIARIO RÁPIDO" : "ESTÁNDAR"} ESTÁ SIENDO APLICADO SEGÚN PARÁMETROS DE CONFIGURACIÓN VIGENTES.
                     </p>
                  </div>
              </div>
          </CardContent>
       </Card>

       <Card className="rounded-none border-none shadow-xl bg-white p-6 border-l-8 border-l-accent">
          <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 italic">Próximos Cobros Proyectados</h4>
          <div className="space-y-4">
             {[1,2].map(i => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                   <Calendar className="h-8 w-8 text-primary/10 shrink-0 group-hover:text-accent transition-colors" />
                   <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-tighter leading-none mb-1 italic">Recaudo Programado #{i}54</p>
                      <p className="text-[9px] text-slate-900 font-medium italic">VENCIMIENTO PARA EL 15/04</p>
                   </div>
                </div>
             ))}
             <Button variant="ghost" className="w-full text-[9px] font-black uppercase tracking-widest text-accent hover:bg-accent/5">Ver Cronograma Completo</Button>
          </div>
       </Card>
    </div>
  );
}
