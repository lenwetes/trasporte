"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Plus,
    Search,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    Pencil,
    Trash2,
    Building2,
    Globe,
    UserCircle,
    Loader2,
    ExternalLink,
    ShieldCheck,
    Contact,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProviders, deleteProvider } from "@/actions/finance/providers";
import {
    ProviderDialog,
    ProviderData,
} from "@/components/modules/finance/provider-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function ProvidersPage() {
    const [providers, setProviders] = useState<ProviderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<ProviderData | null>(null);

    const loadProviders = async () => {
        setLoading(true);
        try {
            const res = (await getProviders()) as {
                success: boolean;
                data?: ProviderData[];
                error?: string;
            };
            if (res && res.success && res.data) {
                setProviders(res.data);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadProviders();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este proveedor?")) return;
        const res = await deleteProvider(id);
        if (res.success) {
            toast.success("Proveedor actualizado");
            loadProviders();
        } else {
            toast.error(res.error || "Error al eliminar");
        }
    };

    const filteredProviders = providers.filter(
        (p) =>
            (p.nombres &&
                p.nombres.toLowerCase().includes(search.toLowerCase())) ||
            (p.numeroDocumento && p.numeroDocumento.includes(search)) ||
            (p.razonSocial &&
                p.razonSocial.toLowerCase().includes(search.toLowerCase())),
    );

    return (
        <div className="space-y-8 pb-12">
            <DashboardHeader
                title="Terceros y Proveedores"
                tagline="Base de Datos Maestra"
                subtitle="Gestión centralizada de entidades, proveedores y contratistas de la organización"
                icon={Contact}
                iconGradient="from-slate-800 to-slate-900"
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="relative group w-full md:w-[450px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <Input
                        placeholder="Buscar por nombre, NIT o razón social..."
                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border-slate-100 rounded-xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button
                    onClick={() => {
                        setSelectedProvider(null);
                        setIsDialogOpen(true);
                    }}
                    className="h-12 px-8 bg-slate-900 hover:bg-black text-white rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                    <Plus size={16} />
                    Vincular Tercero
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                    <div 
                        key={provider.id} 
                        className="group bg-white border border-slate-200 rounded-[2rem] p-8 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all relative overflow-hidden flex flex-col h-full"
                    >
                        {/* Status/Type Tag */}
                        <div className="absolute top-0 right-0 p-6">
                            <div className="px-2 py-0.5 bg-slate-100 text-slate-900 text-[9px] font-black rounded uppercase tracking-widest">
                                {provider.tipoTercero || "PROVEEDOR"}
                            </div>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="flex items-start justify-between">
                                <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg">
                                    <Building2 size={24} />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-900 hover:text-slate-900 rounded-lg">
                                            <MoreVertical size={18} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl p-1 w-40">
                                        <DropdownMenuItem 
                                            onClick={() => {
                                                setSelectedProvider(provider);
                                                setIsDialogOpen(true);
                                            }}
                                            className="rounded-lg gap-2 text-xs font-bold py-2.5"
                                        >
                                            <Pencil size={14} className="text-slate-900" /> Editar Ficha
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            className="rounded-lg gap-2 text-xs font-bold py-2.5 text-rose-500 focus:text-rose-600 focus:bg-rose-50"
                                            onClick={() => provider.id && handleDelete(provider.id)}
                                        >
                                            <Trash2 size={14} /> Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-black text-slate-900 leading-tight truncate px-1">
                                    {provider.nombres || provider.razonSocial}
                                </h3>
                                <div className="flex items-center gap-2 pl-1">
                                    <ShieldCheck size={12} className="text-emerald-500" />
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                                        {provider.tipoDocumento}: {provider.numeroDocumento}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                {provider.celular && (
                                    <div className="flex items-center gap-3 text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                                        <div className="size-6 bg-white rounded-lg flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                                            <Phone size={12} />
                                        </div>
                                        <span className="text-[11px] font-bold tracking-tight">{provider.celular}</span>
                                    </div>
                                )}
                                {provider.email && (
                                    <div className="flex items-center gap-3 text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 overflow-hidden">
                                        <div className="size-6 bg-white rounded-lg flex items-center justify-center text-slate-900 shadow-sm border border-slate-100 shrink-0">
                                            <Mail size={12} />
                                        </div>
                                        <span className="text-[11px] font-bold tracking-tight truncate">{provider.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                                    <div className="size-6 bg-white rounded-lg flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                                        <Globe size={12} />
                                    </div>
                                    <span className="text-[11px] font-bold tracking-tight uppercase">{provider.ciudad || "Sincelejo, SUCRE"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic pl-1">Documentación al día</span>
                            <button className="text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-700 tracking-widest flex items-center gap-1.5 p-1 group/btn transition-all">
                                Ver Perfil
                                <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="size-10 text-emerald-500 animate-spin" />
                    <p className="text-[10px] font-black uppercase text-slate-900 tracking-[0.2em]">Consultando Registro Maestro...</p>
                </div>
            )}

            {!loading && filteredProviders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-white border border-slate-200 border-dashed rounded-[3rem]">
                    <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-100">
                        <UserCircle size={48} />
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-sm font-black text-slate-900 uppercase">Sin resultados encontrados</h3>
                        <p className="text-xs text-slate-900 font-medium">No se detectaron terceros con los parámetros de búsqueda actuales.</p>
                    </div>
                </div>
            )}

            <ProviderDialog
                open={isDialogOpen}
                setOpen={setIsDialogOpen}
                provider={selectedProvider || undefined}
                onSuccess={loadProviders}
            />
        </div>
    );
}
