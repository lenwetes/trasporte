"use client";

import { Button } from "@/components/ui/button";
import { 
    UserPlus, 
    Hash, 
    Phone, 
    Save, 
    Activity,
    ShieldCheck,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderFormProps {
    providerData: {
        nombres: string;
        apellidos: string;
        numeroDocumento: string;
        celular: string;
        email: string;
    };
    setProviderData: React.Dispatch<
        React.SetStateAction<ProviderFormProps["providerData"]>
    >;
    handleCreateProvider: () => void;
    loading: boolean;
}

export function ProviderForm({
    providerData,
    setProviderData,
    handleCreateProvider,
    loading,
}: ProviderFormProps) {
    const Label = ({ children, htmlFor }: { children: React.ReactNode, htmlFor?: string }) => (
        <label htmlFor={htmlFor} className="block text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] mb-2 px-1">
            {children}
        </label>
    );

    const InputClass = "h-11 w-full rounded-none border-primary/10 bg-white px-4 text-xs font-bold uppercase tracking-widest focus:border-accent focus:ring-0 transition-all placeholder:text-primary/10 mb-4";

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4 border-b border-accent/20 pb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rotate-45 translate-x-12 -translate-y-12" />
                <div className="h-8 w-8 bg-accent flex items-center justify-center text-primary shadow-lg">
                    <UserPlus size={16} />
                </div>
                <div>
                    <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Alta de Tercero Express</h4>
                    <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] italic leading-none mt-1">Sincronización Inmediata con Ledger</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="new-provider-name"><Activity size={10} className="inline mr-1" /> Razón Social / Nombre</Label>
                    <input
                        id="new-provider-name"
                        placeholder="NOMBRES / RAZÓN SOCIAL..."
                        value={providerData.nombres}
                        onChange={(e) => setProviderData({
                            ...providerData,
                            nombres: e.target.value.toUpperCase(),
                        })}
                        className={InputClass}
                    />
                </div>
                <div>
                    <Label htmlFor="new-provider-id"><Hash size={10} className="inline mr-1" /> Identificación / NIT</Label>
                    <input
                        id="new-provider-id"
                        placeholder="DOCUMENTO / NIT..."
                        value={providerData.numeroDocumento}
                        onChange={(e) => setProviderData({
                            ...providerData,
                            numeroDocumento: e.target.value,
                        })}
                        className={cn(InputClass, "font-mono")}
                    />
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-end gap-4">
                <div className="flex-1 w-full">
                    <Label htmlFor="new-provider-phone"><Phone size={10} className="inline mr-1" /> Contacto Técnico</Label>
                    <input
                        id="new-provider-phone"
                        placeholder="TELÉFONO DE CONTACTO..."
                        value={providerData.celular || ""}
                        onChange={(e) => setProviderData({
                            ...providerData,
                            celular: e.target.value,
                        })}
                        className={cn(InputClass, "mb-0")}
                    />
                </div>
                <Button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        handleCreateProvider();
                    }}
                    disabled={loading}
                    className="h-11 w-full md:w-auto px-8 rounded-none bg-primary text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-[0.2em] gap-3 transition-all shadow-xl shadow-primary/10"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <ShieldCheck size={16} className="text-accent" />
                    )}
                    Certificar Registro
                </Button>
            </div>
        </div>
    );
}
