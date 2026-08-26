"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Calculator, 
  DollarSign, 
  Info,
  FileText,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { simulateAmortization, requestLoan, createQuickColaborador } from "@/actions/finance/loans";
import { UserSelector } from "@/components/modules/finance/user-selector";
import { CuotaPrestamoItem } from "@/types";

interface LoanSimulationItem {
  numCuota: number;
  fechaVencimiento: Date | string;
  valorCapital: number;
  valorInteres: number;
  totalCuota: number;
}

export function LoanDialog({ 
  isOpen, 
  onClose, 
  onCreated 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onCreated: () => void; 
}) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Datos, 2: Simulación, 3: Nuevo Colaborador
  const [simulation, setSimulation] = useState<LoanSimulationItem[]>([]);
  
  const [formData, setFormData] = useState({
    usuarioId: "",
    monto: 1000000,
    tasa: 0.015, 
    cuotas: 12,
    tipo: "LIBRE_INVERSION",
    observaciones: ""
  });

  const [colaboradorForm, setColaboradorForm] = useState({
      nombres: "",
      apellidos: "",
      documento: "",
      telefono: "",
      email: "",
      direccion: ""
  });

  const isDiario = formData.tipo === "FLEXIBLE_DIARIO";

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await simulateAmortization({
        monto: formData.monto,
        tasa: formData.tasa,
        cuotas: formData.cuotas,
        isDiario: isDiario
      });
      if (res.success && res.data) {
        setSimulation(res.data as LoanSimulationItem[]);
        setStep(2);
      }
    } catch (error) {
       toast.error("Error al proyectar plan de pagos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateColaborador = async () => {
      if (!colaboradorForm.nombres || !colaboradorForm.documento || !colaboradorForm.telefono) {
          return toast.error("Nombre, Documento y Teléfono son obligatorios.");
      }

      setLoading(true);
      try {
          const res = await createQuickColaborador(colaboradorForm);
          if (res.success && res.data) {
              toast.success("Colaborador registrado correctamente");
              const newUser = res.data as { id: string };
              setFormData({ ...formData, usuarioId: newUser.id });
              setStep(1);
          } else {
              toast.error(res.error);
          }
      } finally {
          setLoading(false);
      }
  };

  const handleSubmit = async () => {
    if (!formData.usuarioId) return toast.error("Debe seleccionar un beneficiario");
    
    setLoading(true);
    try {
      const res = await requestLoan(formData);
      if (res.success) {
        toast.success("Originación de crédito formalizada");
        onCreated();
        onClose();
        setStep(1);
      } else {
        toast.error(res.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { if(!o) { onClose(); setStep(1); } }}>
      <DialogContent className="max-w-2xl rounded-none border-t-8 border-t-slate-900 p-0 overflow-hidden bg-white shadow-2xl">
        <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-900 text-white font-black italic text-[12px]">ERP</div>
            <DialogTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
              {step === 3 ? "Alta Técnica de Tercero" : "Originación de Crédito Especializado"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-relaxed italic">
            {step === 3 
              ? "Vinculación integral de colaborador externo para la administración operativa de cartera" 
              : "Definición técnica de préstamo sujeta a disponibilidad real en fondo de préstamos"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6">
          {step === 1 ? (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-500">
              <div className="col-span-2 space-y-2">
                <div className="flex justify-between items-center bg-slate-100/50 p-2 border-l-4 border-slate-900">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Beneficiario Operativo</Label>
                    <Button 
                        onClick={() => setStep(3)}
                        variant="link" 
                        className="h-auto p-0 text-[10px] font-black text-slate-900 uppercase tracking-tighter hover:no-underline underline"
                    >
                        + Nueva Vinculación (Tercero)
                    </Button>
                </div>
                <UserSelector 
                    selectedId={formData.usuarioId}
                    onSelect={(id) => setFormData({...formData, usuarioId: id})}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Monto Capital (COP)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-900" />
                  <Input 
                    type="text"
                    value={formData.monto ? new Intl.NumberFormat("es-CO").format(formData.monto) : ""}
                    onChange={(e) => {
                        const val = Number(e.target.value.replace(/\D/g, ""));
                        setFormData({...formData, monto: val});
                    }}
                    className="rounded-none border-slate-100 bg-slate-50 h-10 pl-10 text-[11px] font-black tracking-tight"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Interés {isDiario ? "Diario" : "Mensual"} (%)</Label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-3 h-4 w-4 text-slate-900" />
                  <Input 
                    type="number"
                    step="0.001"
                    value={formData.tasa * 100}
                    onChange={(e) => setFormData({...formData, tasa: Number(e.target.value) / 100})}
                    className="rounded-none border-slate-100 bg-slate-50 h-10 pl-10 text-[11px] font-black tracking-widest"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Plazo ({isDiario ? "Días" : "Cuotas"})</Label>
                <Input 
                  type="number"
                  value={formData.cuotas}
                  onChange={(e) => setFormData({...formData, cuotas: Number(e.target.value)})}
                  className="rounded-none border-slate-100 h-10 text-[11px] font-black pl-3"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Línea de Crédito</Label>
                <Select value={formData.tipo} onValueChange={(val) => setFormData({...formData, tipo: val})}>
                  <SelectTrigger className="rounded-none border-slate-100 h-10 text-[11px] font-black italic">
                    <SelectValue placeholder="SELECCIONAR..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-slate-900 border-2">
                    <SelectItem value="LIBRE_INVERSION" className="text-[10px] font-black">LIBRE INVERSIÓN</SelectItem>
                    <SelectItem value="FLEXIBLE_DIARIO" className="text-[10px] font-black">CRÉDITO OPERATIVO RÁPIDO</SelectItem>
                    <SelectItem value="EDUCACION" className="text-[10px] font-black">AUXILIO EDUCATIVO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Garantía / Concepto Operativo</Label>
                <Input 
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="MOTIVO DEL DESEMBOLSO..."
                  className="rounded-none border-slate-100 bg-slate-50 h-10 text-[10px] font-black uppercase"
                />
              </div>
            </div>
          ) : step === 3 ? (
            <div className="space-y-6 animate-in slide-in-from-top duration-500">
               <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-900 italic">Nombres</Label>
                    <Input 
                        value={colaboradorForm.nombres}
                        onChange={(e) => setColaboradorForm({...colaboradorForm, nombres: e.target.value})}
                        className="rounded-none border-slate-100 h-10 text-[10px] font-black uppercase italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-900 italic">Apellidos</Label>
                    <Input 
                        value={colaboradorForm.apellidos}
                        onChange={(e) => setColaboradorForm({...colaboradorForm, apellidos: e.target.value})}
                        className="rounded-none border-slate-100 h-10 text-[10px] font-black uppercase italic"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-900 italic">Identificación (C.C. / NIT)</Label>
                    <Input 
                        value={colaboradorForm.documento}
                        onChange={(e) => setColaboradorForm({...colaboradorForm, documento: e.target.value})}
                        className="rounded-none border-slate-100 h-10 text-[10px] font-black uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-900 italic flex items-center gap-2">
                        <Phone className="h-3 w-3 text-slate-900" />
                        Contacto Celular
                    </Label>
                    <Input 
                        value={colaboradorForm.telefono}
                        onChange={(e) => setColaboradorForm({...colaboradorForm, telefono: e.target.value})}
                        className="rounded-none border-slate-100 h-10 text-[10px] font-black uppercase"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-900 italic flex items-center gap-2">
                        <Mail className="h-3 w-3 text-slate-900" />
                        Correo para Extractos
                    </Label>
                    <Input 
                        type="email"
                        value={colaboradorForm.email}
                        onChange={(e) => setColaboradorForm({...colaboradorForm, email: e.target.value})}
                        className="rounded-none border-slate-100 h-10 text-[10px] font-black uppercase"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-900 italic flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-slate-900" />
                        Dirección Domiciliaria
                    </Label>
                    <Input 
                        value={colaboradorForm.direccion}
                        onChange={(e) => setColaboradorForm({...colaboradorForm, direccion: e.target.value})}
                        className="rounded-none border-slate-100 h-10 text-[10px] font-black uppercase"
                    />
                  </div>
               </div>
               <div className="p-4 bg-slate-900 text-white flex gap-4 shadow-2xl">
                  <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
                  <p className="text-[9px] font-black uppercase italic leading-relaxed tracking-tighter">
                    VINCULACIÓN AUTORIZADA PARA GESTIÓN DE CARTERA. LA INFORMACIÓN SE UTILIZARÁ EXCLUSIVAMENTE PARA FINES OPERATIVOS Y EMISIÓN DE TÍTULOS DE DEUDA.
                  </p>
               </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
               <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 italic">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    Proyección Maestro de Amortización
                  </h4>
                  <Badge className="bg-slate-900 text-white rounded-none border-none text-[8px] font-black uppercase tracking-widest px-2 py-1 italic">VISTA DE VERIFICACIÓN</Badge>
               </div>
               <div className="h-[300px] overflow-y-auto border border-slate-100 shadow-inner">
                 <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-50 sticky top-0 font-black uppercase tracking-tighter italic text-slate-900">
                      <tr>
                        <th className="px-5 py-4">Sec.</th>
                        <th className="px-5 py-4">Vencimiento</th>
                        <th className="px-5 py-4">Capital</th>
                        <th className="px-5 py-4">Interés</th>
                        <th className="px-5 py-4 text-right">Recaudo Fijo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {simulation.map((c: LoanSimulationItem) => (
                        <tr key={c.numCuota} className="font-bold text-slate-600 hover:bg-slate-50/50">
                          <td className="px-5 py-2.5 font-black text-slate-900 italic">#{String(c.numCuota).padStart(2, '0')}</td>
                          <td className="px-5 py-2.5 tabular-nums italic text-slate-900">{new Date(c.fechaVencimiento).toLocaleDateString()}</td>
                          <td className="px-5 py-2.5 text-slate-900">{formatCurrency(c.valorCapital)}</td>
                          <td className="px-5 py-2.5 text-emerald-500">+{formatCurrency(c.valorInteres)}</td>
                          <td className="px-5 py-2.5 text-right text-slate-900 font-black tabular-nums">{formatCurrency(c.totalCuota)}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
               <div className="bg-slate-900 p-6 flex justify-between items-center shadow-2xl border-l-[12px] border-l-emerald-500">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-white uppercase tracking-widest mb-1 italic">Gran Total a Recaudar</span>
                    <span className="text-[24px] font-black text-white tracking-widest tabular-nums italic">
                        {formatCurrency(simulation.reduce((acc: number, c: LoanSimulationItem) => acc + c.totalCuota, 0))}
                    </span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1 italic">Cuota {isDiario ? "Diaria" : "Mensual"}</span>
                    <span className="text-[24px] font-black text-emerald-400 tracking-tighter tabular-nums underline">
                      {formatCurrency(simulation[0]?.totalCuota || 0)}
                    </span>
                  </div>
               </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 gap-3">
          {step === 1 ? (
             <>
              <Button onClick={onClose} variant="ghost" className="rounded-none uppercase font-black text-[10px] tracking-widest h-12 hover:bg-white border border-slate-200">Cancelar</Button>
              <Button 
                onClick={handleSimulate}
                disabled={loading}
                className="bg-slate-900 text-white hover:bg-black rounded-none h-14 px-10 font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all gap-3"
              >
                {loading ? "Calculando..." : "Siguiente: Proyectar Plan"}
                <ChevronRight size={16} />
              </Button>
             </>
          ) : step === 3 ? (
             <>
              <Button onClick={() => setStep(1)} variant="ghost" className="rounded-none uppercase font-black text-[10px] tracking-widest h-12">Volver</Button>
              <Button 
                onClick={handleCreateColaborador}
                disabled={loading || !colaboradorForm.nombres || !colaboradorForm.documento}
                className="bg-slate-900 text-white hover:bg-black rounded-none h-14 px-10 font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all"
              >
                {loading ? "Procesando..." : "Confirmar Vinculación"}
              </Button>
             </>
          ) : (
            <>
              <Button onClick={() => setStep(1)} variant="outline" className="rounded-none uppercase font-black text-[10px] tracking-widest h-12">Ajustar Datos</Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-slate-900 text-white hover:bg-emerald-600 rounded-none h-14 px-12 font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all italic border-b-4 border-emerald-500"
              >
                {loading ? "Formalizando..." : "RADICAR CRÉDITO EN FIRME"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
