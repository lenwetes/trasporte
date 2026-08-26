"use client";

import {
    useProviderForm,
    ProviderData,
} from "./provider-dialog/use-provider-form";
import { 
    X, 
    UserPlus, 
    ShieldCheck, 
    MapPin, 
    Phone, 
    Mail, 
    Building2, 
    CreditCard,
    Save,
    UserCheck,
    Briefcase
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

// Re-export type so consumers don't need to know the internal file structure
export type { ProviderData };

interface ProviderDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    provider?: ProviderData;
    onSuccess?: (newProvider?: ProviderData) => void;
}

export function ProviderDialog({
    open,
    setOpen,
    provider,
    onSuccess,
}: ProviderDialogProps) {
    const { loading, formData, setFormData, handleSubmit } = useProviderForm(
        open,
        setOpen,
        provider,
        onSuccess,
    );

    const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
        <label htmlFor={htmlFor} className="block text-[10px] font-black text-primary/70 uppercase tracking-[0.2em] mb-3">
            {children}
        </label>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl p-0 border-none bg-transparent shadow-none rounded-none flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 z-[9999]">
                <div className="bg-white border-2 border-primary shadow-2xl relative overflow-hidden flex flex-col h-full ring-8 ring-primary/5">
                    {/* Indicador de Tipo Sharp */}
                    <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
                    
                    {/* Header Técnico */}
                    <div className="p-8 border-b-2 border-primary bg-slate-900 text-white relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-45 translate-x-16 -translate-y-16" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="h-12 w-12 flex items-center justify-center border-2 border-white/20 bg-white/10 shadow-xl">
                                {formData.id ? <Briefcase className="h-6 w-6 text-accent" /> : <UserPlus className="h-6 w-6 text-accent" />}
                            </div>
                            <div>
                                <DialogTitle className="text-[14px] font-black uppercase tracking-[0.3em] leading-none mb-2 text-white">
                                    {formData.id ? "Ajuste Maestro de Proveedor" : "Registro de Nuevo Proveedor"}
                                </DialogTitle>
                                <DialogDescription className="text-[9px] font-black text-white/70 uppercase tracking-[0.4em] italic leading-none">
                                    Protocolo de Registro de Terceros v2.2 (Ready)
                                </DialogDescription>
                            </div>
                        </div>
                        <button 
                            onClick={() => setOpen(false)} 
                            className="absolute right-8 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all rounded-none z-10"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 custom-scrollbar bg-white">
                        <div className="p-10 space-y-12">
                            {/* Sección 1: Identidad Legal */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b-2 border-primary/10 pb-4">
                                    <ShieldCheck size={18} className="text-primary" />
                                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Identidad Legal & Identificación</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-8">
                                    <div className="space-y-1">
                                        <Label htmlFor="p-razon-social">Razón Social / Nombre Comercial Full</Label>
                                        <input 
                                            id="p-razon-social"
                                            required
                                            placeholder="EJ: TRANSPORTES DEL NORTE S.A.S"
                                            value={formData.nombres}
                                            onChange={(e) => setFormData({ ...formData, nombres: e.target.value.toUpperCase() })}
                                            className="h-14 w-full rounded-none border-2 border-primary/10 bg-slate-50 px-6 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-0 transition-all placeholder:text-primary/20"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <Label htmlFor="p-tipo-doc">Tipo Identificación Fiscal</Label>
                                            <select 
                                                id="p-tipo-doc"
                                                value={formData.tipoDocumento}
                                                onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value })}
                                                className="h-14 w-full rounded-none border-2 border-primary/10 bg-slate-50 px-6 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-0 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="NIT">NIT - NÚMERO TRIBUTARIO</option>
                                                <option value="CC">CC - CÉDULA DE CIUDADANÍA</option>
                                                <option value="CE">CE - CÉDULA DE EXTRANJERÍA</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="p-documento">Número de Documento / NIT</Label>
                                            <div className="relative group">
                                                <CreditCard size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" />
                                                <input 
                                                    id="p-documento"
                                                    required
                                                    placeholder="900.000.000-0"
                                                    value={formData.numeroDocumento}
                                                    onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                                                    className="h-14 w-full rounded-none border-2 border-primary/10 bg-slate-50 pl-14 pr-6 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-0 transition-all font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sección 2: Información de Contacto */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b-2 border-primary/10 pb-4">
                                    <Building2 size={18} className="text-primary" />
                                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Localización & Contacto Operativo</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 leading-none">
                                    <div className="space-y-1">
                                        <Label htmlFor="p-celular">Teléfono Maestro / Celular</Label>
                                        <div className="relative group">
                                            <Phone size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" />
                                            <input 
                                                id="p-celular"
                                                placeholder="+57 300 000 0000"
                                                value={formData.celular}
                                                onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                                                className="h-14 w-full rounded-none border-2 border-primary/10 bg-slate-50 pl-14 pr-6 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-0 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="p-email">Correo Electrónico Corporativo</Label>
                                        <div className="relative group">
                                            <Mail size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" />
                                            <input 
                                                id="p-email"
                                                type="email"
                                                placeholder="CORREO@EMPRESA.COM"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                                                className="h-14 w-full rounded-none border-2 border-primary/10 bg-slate-50 pl-14 pr-6 text-xs font-bold tracking-widest focus:border-primary focus:ring-0 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="p-direccion">Dirección Física / Oficina</Label>
                                        <div className="relative group">
                                            <MapPin size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" />
                                            <input 
                                                id="p-direccion"
                                                placeholder="CALLE 123 # 45 - 67"
                                                value={formData.direccion}
                                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value.toUpperCase() })}
                                                className="h-14 w-full rounded-none border-2 border-primary/10 bg-slate-50 pl-14 pr-6 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-0 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="p-ciudad">Ciudad de Operación</Label>
                                        <input 
                                            id="p-ciudad"
                                            placeholder="EJ: MEDELLÍN"
                                            value={formData.ciudad}
                                            onChange={(e) => setFormData({ ...formData, ciudad: e.target.value.toUpperCase() })}
                                            className="h-14 w-full rounded-none border-2 border-primary/10 bg-slate-50 px-6 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-0 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer de Acciones */}
                        <div className="p-8 bg-slate-50 border-t-2 border-primary/10 flex flex-col sm:flex-row justify-end gap-6 shrink-0 relative mt-auto">
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="h-14 rounded-none border-2 border-primary/10 bg-white text-primary hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-10 text-[11px] font-black uppercase tracking-[0.2em] transition-all order-2 sm:order-1"
                            >
                                [ Abortar Proceso ]
                            </Button>
                            <Button 
                                type="submit"
                                disabled={loading}
                                className="h-14 rounded-none bg-slate-900 text-white hover:bg-slate-800 px-12 text-[11px] font-black uppercase tracking-[0.3em] gap-3 transition-all shadow-2xl shadow-primary/20 order-1 sm:order-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Validando...
                                    </>
                                ) : (
                                    <>
                                        <UserCheck size={18} className="text-accent" />
                                        {formData.id ? "Actualizar Registro Maestro" : "Confirmar Registro de Proveedor"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Loader2({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
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
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
