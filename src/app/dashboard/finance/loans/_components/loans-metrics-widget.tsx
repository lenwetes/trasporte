import React from "react";
import { Wallet, TrendingDown, Users, PieChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DashboardData } from "@/types";

export function LoansMetricsWidget({ data }: { data: DashboardData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="rounded-none border-none shadow-sm bg-white overflow-hidden group">
        <CardContent className="p-6 flex items-center gap-5">
           <div className="p-4 bg-primary text-white group-hover:bg-accent group-hover:text-primary transition-all">
              <Wallet size={24} />
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1 italic">Total Desembolsado</p>
              <p className="text-xl font-black text-primary tracking-tighter">{formatCurrency(data.totalPrestado)}</p>
           </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border-none shadow-sm bg-white overflow-hidden group">
        <CardContent className="p-6 flex items-center gap-5">
           <div className="p-4 bg-primary text-white group-hover:bg-accent group-hover:text-primary transition-all">
              <TrendingDown size={24} />
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1 italic">Vigente en Calle</p>
              <p className="text-xl font-black text-primary tracking-tighter">{formatCurrency(data.carteraVigente)}</p>
           </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border-none shadow-sm bg-white overflow-hidden group">
        <CardContent className="p-6 flex items-center gap-5">
           <div className="p-4 bg-primary text-white group-hover:bg-accent group-hover:text-primary transition-all">
              <Users size={24} />
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1 italic">Créditos en curso</p>
              <p className="text-xl font-black text-primary tracking-tighter">{data.prestamosActivos} UNIDADES</p>
           </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border-none shadow-2xl bg-slate-900 text-white overflow-hidden group">
        <CardContent className="p-6 flex items-center gap-5">
           <div className="p-4 bg-accent text-primary">
              <PieChart size={24} />
           </div>
           <div className="flex-1">
              <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1 italic">Disponible en {data.nombreFondo || "FONDO"}</p>
              <p className="text-xl font-black text-white tracking-tighter">{formatCurrency(data.fondoDisponible)}</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
