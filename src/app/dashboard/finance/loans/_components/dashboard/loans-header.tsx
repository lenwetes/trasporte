import * as React from "react";
import { CreditCard, ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoansHeaderProps {
  setIsRechargeOpen: (open: boolean) => void;
  setIsDialogOpen: (open: boolean) => void;
}

export function LoansHeader({ setIsRechargeOpen, setIsDialogOpen }: LoansHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-primary pb-6">
      <div>
        <h1 className="text-4xl font-black text-primary tracking-tighter uppercase italic flex items-center gap-3">
          <CreditCard className="h-10 w-10 text-accent" />
          Cartera de Créditos
        </h1>
        <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mt-1 pl-1">
          Gestión de Préstamos y Auxilios — Motor Operativo Coopetraes
        </p>
      </div>
      
      <div className="flex gap-4">
        <Button 
          onClick={() => setIsRechargeOpen(true)}
          variant="outline"
          className="rounded-none h-14 px-8 font-black uppercase tracking-widest text-[11px] border-primary/20 hover:bg-white flex items-center gap-3 shadow-xl transition-all"
        >
          <ArrowUpRight className="h-5 w-5 text-accent" />
          Recargar Fondo
        </Button>

        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="rounded-none h-14 px-10 font-black uppercase tracking-widest text-[11px] bg-primary text-white hover:bg-black flex items-center gap-3 shadow-2xl"
        >
          <Plus className="h-5 w-5 text-accent" />
          Nuevo Crédito
        </Button>
      </div>
    </div>
  );
}
