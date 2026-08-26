import React from "react";
import { ArrowUpRight, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export interface LoansRechargeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cajaGeneral: number;
  rechargeAmount: string;
  setRechargeAmount: (val: string) => void;
  handleRecharge: () => void;
  isRecharging: boolean;
}

export function LoansRechargeModal({
  isOpen,
  onOpenChange,
  cajaGeneral,
  rechargeAmount,
  setRechargeAmount,
  handleRecharge,
  isRecharging
}: LoansRechargeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none border-t-4 border-t-accent shadow-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <ArrowUpRight className="h-6 w-6 text-accent" />
              Inyección de Liquidez
          </DialogTitle>
          <DialogDescription className="text-[11px] font-black uppercase tracking-widest leading-relaxed">
              Autorice el traslado de fondos desde Caja Central (110505) hacia el Fondo de Préstamos (110510).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4 pb-2">
           <div className="flex justify-between items-center p-4 bg-slate-900 text-white rounded-none border-l-4 border-l-accent">
              <div className="flex flex-col">
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Disponible en Caja Gral</span>
                 <span className="text-lg font-black italic tracking-tighter text-accent">{formatCurrency(cajaGeneral)}</span>
              </div>
              <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={() => setRechargeAmount(String(cajaGeneral))}
                 className="h-8 rounded-none border-white/20 bg-transparent text-white text-[9px] font-black uppercase hover:bg-white hover:text-slate-900"
              >
                 Usar todo
              </Button>
           </div>
           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Monto a Trasladar (COP)</Label>
              <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black">$</span>
                  <Input 
                      type="text"
                      placeholder="0"
                      value={rechargeAmount ? new Intl.NumberFormat("es-CO").format(Number(rechargeAmount)) : ""}
                      onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setRechargeAmount(val);
                      }}
                      className="h-14 pl-10 text-xl font-black rounded-none bg-slate-50 border-primary/20 focus-visible:ring-accent"
                  />
              </div>
           </div>
           
           <div className="bg-amber-50 p-4 border border-amber-200 flex items-start gap-4">
               <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-1" />
               <p className="text-[10px] font-medium text-amber-800 uppercase leading-relaxed italic tracking-tighter">
                   Asegúrese de contar con liquidez física equivalente en la <strong className="font-black text-amber-900">CAJA GENERAL PRINCIPAL</strong> o la operación será declinada por tesorería.
               </p>
           </div>
        </div>

        <DialogFooter className="mt-4 flex flex-row justify-end space-x-2">
           <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="rounded-none font-black uppercase text-[10px] tracking-widest text-slate-900"
           >
              Cancelar
           </Button>
           <Button 
              onClick={handleRecharge}
              disabled={isRecharging || !rechargeAmount}
              className="rounded-none font-black uppercase text-[10px] tracking-widest bg-primary hover:bg-black px-8"
           >
              {isRecharging ? "Autorizando..." : "Autorizar Recarga"}
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
