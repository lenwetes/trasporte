"use client";

import {
    useExpenseForm,
    SUGGESTED_CONCEPTS,
} from "./expense-dialog/use-expense-form";
import { ExpenseFileUpload } from "./expense-dialog/expense-file-upload";
import { ProviderForm } from "./expense-dialog/provider-form";
import { 
    X, 
    FileText, 
    User, 
    Building2, 
    DollarSign, 
    CreditCard, 
    ShieldCheck, 
    Plus, 
    Save, 
    Activity,
    AlertCircle,
    BadgeCheck,
    Briefcase,
    Receipt,
    ChevronDown,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface ExpenseDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function ExpenseDialog({ open, setOpen }: ExpenseDialogProps) {
    const {
        loading,
        metadata,
        showNewProvider,
        setShowNewProvider,
        uploading,
        formData,
        setFormData,
        providerData,
        setProviderData,
        handleFileUpload,
        removeArchivo,
        handleConceptChange,
        handleCreateProvider,
        handleSubmit,
    } = useExpenseForm(open, setOpen);

    const Label = ({ children }: { children: React.ReactNode }) => (
        <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-2 px-1">
            {children}
        </label>
    );

    const InputClass = "h-12 w-full rounded-none border-2 border-primary/10 bg-slate-50 px-4 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-0 transition-all placeholder:text-primary/10";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl p-0 border-none bg-transparent shadow-none rounded-none flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 z-[9999]">
                <div className="bg-white border-2 border-primary shadow-2xl relative overflow-hidden flex flex-col h-full ring-8 ring-primary/5">
                    
                    {/* Indicador de Tipo Sharp */}
                    <div className="absolute top-0 left-0 w-2 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
                    
                    {/* Header Auditoría */}
                    <div className="p-8 border-b-2 border-primary bg-slate-900 text-white relative shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-45 translate-x-16 -translate-y-16" />
                        
                        <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 flex items-center justify-center border-2 border-white/20 bg-white/10 shadow-xl">
                                    <Receipt className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                    <DialogTitle className="text-[14px] font-black uppercase tracking-[0.3em] leading-none mb-1 text-white">
                                        Nuevo Comprobante de Egreso
                                    </DialogTitle>
                                    <DialogDescription className="text-[9px] font-black text-white uppercase tracking-[0.4em] italic">
                                        Protocolo de Desembolso v4.2 (Stacking Corrected)
                                    </DialogDescription>
                                </div>
                            </div>
                            <button 
                                onClick={() => setOpen(false)} 
                                className="h-10 w-10 flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all rounded-none"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar bg-white">
                        <div className="p-10 space-y-10">
                            
                            {/* 1. Proveedor / Tercero */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b-2 border-primary/10 pb-2">
                                    <Label><User size={12} className="inline mr-2" /> Entidad de Destino (Proveedor / Tercero)</Label>
                                    <button 
                                        onClick={() => setShowNewProvider(!showNewProvider)}
                                        className="text-[9px] font-black text-accent uppercase tracking-widest hover:underline mb-1 flex items-center gap-2"
                                    >
                                        {showNewProvider ? <X size={10} /> : <Plus size={10} />}
                                        {showNewProvider ? "Abortar Registro" : "Nuevo Proveedor Express"}
                                    </button>
                                </div>
                                
                                {showNewProvider ? (
                                    <div className="p-6 border-2 border-accent/20 bg-accent/5 animate-in slide-in-from-top-2 duration-300">
                                        <ProviderForm
                                            providerData={providerData}
                                            setProviderData={setProviderData}
                                            handleCreateProvider={handleCreateProvider}
                                            loading={loading}
                                        />
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors z-10" />
                                        <select 
                                            value={formData.proveedorId}
                                            onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
                                            className={cn(InputClass, "pl-12 border-primary/20 appearance-none pr-10 bg-white font-black cursor-pointer")}
                                        >
                                            <option value="">CENTRALIZACIÓN DE PROVEEDORES...</option>
                                            {metadata?.proveedores.map((p) => (
                                                <option key={p.id} value={p.id}>{p.nombres} - {p.numeroDocumento}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20 pointer-events-none" />
                                    </div>
                                )}
                            </div>

                            {/* 2. Soportes & Normativa */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ring-2 ring-primary/5 p-8 bg-slate-50 shadow-sm border-2 border-primary/5">
                                <div className="space-y-6">
                                    <div className={cn(
                                        "flex items-center gap-4 p-4 border-2 transition-all cursor-pointer",
                                        formData.esElectronica ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-500/10" : "border-primary/10 bg-white text-slate-900"
                                    )} onClick={() => setFormData({ ...formData, esElectronica: !formData.esElectronica })}>
                                        <div className={cn(
                                            "h-6 w-6 border-2 flex items-center justify-center transition-colors",
                                            formData.esElectronica ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-primary/20"
                                        )}>
                                            {formData.esElectronica && <BadgeCheck size={14} />}
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-widest">Factura Electrónica NIIF</span>
                                    </div>
                                    <div className="space-y-4">
                                        <Label><Hash size={12} className="inline mr-2" /> N° de Documento / FE</Label>
                                        <input 
                                            type="text" 
                                            value={formData.documentoNumero}
                                            onChange={(e) => setFormData({ ...formData, documentoNumero: e.target.value.toUpperCase() })}
                                            placeholder="FE-0000"
                                            className={cn(InputClass, "font-mono border-primary/20 bg-white")}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label><Briefcase size={12} className="inline mr-2" /> Soportes Digitales (PDF/IMG)</Label>
                                    <ExpenseFileUpload
                                        archivoNames={formData.archivoNames}
                                        removeArchivo={removeArchivo}
                                        handleFileUpload={handleFileUpload}
                                        uploading={uploading}
                                    />
                                </div>
                            </div>

                            {/* 3. Concepto y Liquidación */}
                            <div className="p-8 bg-slate-900 text-white space-y-8 relative overflow-hidden group border-2 border-primary">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-45 translate-x-12 -translate-y-12" />
                                
                                <div className="grid grid-cols-1 gap-8 relative z-10">
                                    <div className="space-y-4">
                                        <Label><Activity size={12} className="inline mr-2 text-accent" /> Concepto del Desembolso</Label>
                                        <input 
                                            list="concepts-list"
                                            value={formData.descripcion}
                                            onChange={(e) => handleConceptChange(e.target.value.toUpperCase())}
                                            placeholder="DESCRIPCIÓN TÉCNICA DEL GASTO..."
                                            className="h-14 w-full rounded-none border-2 border-white/10 bg-white/5 px-6 text-xs font-black uppercase tracking-widest focus:border-accent focus:ring-0 transition-all placeholder:text-white/20 outline-none"
                                        />
                                        <datalist id="concepts-list">
                                            {SUGGESTED_CONCEPTS.map((c, i) => <option key={i} value={c.label} />)}
                                        </datalist>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4 text-white">
                                            <Label><DollarSign size={12} className="inline mr-2 text-accent" /> Cuantía Liquidada ($)</Label>
                                            <div className="relative">
                                                <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center bg-white/5 border-r-2 border-white/10 font-black text-accent text-xs">$</div>
                                                <input 
                                                    type="number"
                                                    value={formData.monto}
                                                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                                                    className="h-14 w-full rounded-none border-2 border-white/10 bg-white/5 pl-16 pr-6 text-xl font-black font-mono tracking-tighter text-white focus:border-accent outline-none"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4 text-white">
                                            <Label><CreditCard size={12} className="inline mr-2 text-accent" /> Origen de Fondos (Caja)</Label>
                                            <select 
                                                value={formData.cuentaCajaId}
                                                onChange={(e) => setFormData({ ...formData, cuentaCajaId: e.target.value })}
                                                className="h-14 w-full rounded-none border-2 border-white/10 bg-white/5 px-6 text-xs font-black uppercase tracking-widest focus:border-accent outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-slate-900 border-none">SELECCIONAR CANAL...</option>
                                                {metadata?.cuentas?.filter(c => c.codigo.startsWith("11")).map(c => (
                                                    <option key={c.id} value={c.id} className="bg-slate-900 border-none">
                                                        [{c.codigo}] {c.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer Auditoría */}
                    <div className="p-8 bg-slate-50 border-t-2 border-primary flex flex-col sm:flex-row justify-end gap-6 relative overflow-hidden shrink-0 mt-auto">
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-4 opacity-30">
                            <AlertCircle size={16} className="text-red-600" />
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic">Auditoría Fiscal en Tiempo Real</span>
                        </div>

                        <Button 
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="h-14 bg-transparent text-slate-900 hover:text-red-600 hover:bg-red-50 px-10 text-[11px] font-black uppercase tracking-[0.3em] transition-all rounded-none"
                        >
                            [ Abortar Emisión ]
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={loading}
                            className={cn(
                                "h-14 px-12 text-[11px] font-black uppercase tracking-[0.4em] gap-4 transition-all shadow-2xl rounded-none border-none bg-slate-900 text-white hover:bg-slate-800 shadow-primary/20",
                                loading && "opacity-50"
                            )}
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} className="text-accent" />
                            )}
                            Emitir Registro Maestro
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Hash({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="9" y2="9" />
            <line x1="4" x2="20" y1="15" y2="15" />
            <line x1="10" x2="8" y1="3" y2="21" />
            <line x1="16" x2="14" y1="3" y2="21" />
        </svg>
    )
}
