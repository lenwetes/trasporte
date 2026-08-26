"use client";

import { useState } from "react";
import {
    User,
    Car,
    ShieldAlert,
    ShieldCheck,
    Lock,
    Unlock,
    Mail,
    FileText,
    AlertTriangle
} from "lucide-react";
import { toggleOwnerBlockAction } from "@/actions/fleet/operability.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Owner {
    id: string;
    nombres: string;
    apellidos: string;
    email: string | null;
    numeroDocumento: string | null;
    _count: {
        vehiculosPropiedad: number;
    };
}

interface OwnersTableProps {
    initialOwners: Owner[];
}

export function OwnersTable({ initialOwners }: OwnersTableProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
    const [actionType, setActionType] = useState<"block" | "unblock">("block");
    const [razon, setRazon] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAction = (owner: Owner, type: "block" | "unblock") => {
        setSelectedOwner(owner);
        setActionType(type);
        setOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedOwner) return;

        if (actionType === "block" && !razon.trim()) {
            toast.error("Debe especificar una razón para el bloqueo");
            return;
        }

        setLoading(true);
        try {
            const res = await toggleOwnerBlockAction(
                selectedOwner.id,
                actionType === "block",
                razon,
            );
            if (res.success) {
                toast.success(actionType === "block"
                    ? `Flota de ${selectedOwner.nombres} bloqueada correctamente`
                    : `Flota de ${selectedOwner.nombres} desbloqueada`);
                setOpen(false);
                setRazon("");
                router.refresh();
            } else {
                toast.error(res.error || "Error al procesar la acción");
            }
        } catch {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b-2 border-slate-100">Propietario / Contacto</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b-2 border-slate-100">Documentación</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b-2 border-slate-100">Flota Asociada</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b-2 border-slate-100">Acciones Masivas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {initialOwners.map((owner) => (
                            <tr key={owner.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <User className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                                {owner.nombres} {owner.apellidos}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Mail className="h-3 w-3 text-slate-300" />
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{owner.email || "SIN EMAIL"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{owner.numeroDocumento || "—"}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-200">
                                            <Car className="h-4 w-4 text-slate-500" />
                                            <span className="text-sm font-black text-slate-900">{owner._count.vehiculosPropiedad}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Unidades</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAction(owner, "block")}
                                            disabled={owner._count.vehiculosPropiedad === 0}
                                            className="bg-red-50 hover:bg-red-100 border-red-100 text-red-700 h-9 px-4 text-[10px] font-black uppercase tracking-widest gap-2 rounded-lg"
                                        >
                                            <Lock size={14} /> Bloqueo
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAction(owner, "unblock")}
                                            disabled={owner._count.vehiculosPropiedad === 0}
                                            className="bg-emerald-50 hover:bg-emerald-100 border-emerald-100 text-emerald-700 h-9 px-4 text-[10px] font-black uppercase tracking-widest gap-2 rounded-lg"
                                        >
                                            <Unlock size={14} /> Habilitar
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Dialog */}
            {open && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center shadow-sm border",
                                actionType === "block" ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"
                            )}>
                                {actionType === "block" ? <ShieldAlert className="h-6 w-6 text-red-600" /> : <ShieldCheck className="h-6 w-6 text-emerald-600" />}
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                    {actionType === "block" ? "Bloqueo Masivo" : "Desbloqueo Masivo"}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                    Afectará a <strong className="text-slate-900">{selectedOwner?._count.vehiculosPropiedad} vehículos</strong>.
                                </p>
                            </div>
                        </div>

                        {actionType === "block" && (
                            <div className="mb-6 space-y-3">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] block">
                                    Motivo de la Restricción
                                </label>
                                <textarea
                                    placeholder="Especifique el motivo administrativo o de seguridad..."
                                    value={razon}
                                    onChange={(e) => setRazon(e.target.value)}
                                    className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-0 focus:border-red-400 transition-all resize-none outline-none"
                                />
                                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                                    <AlertTriangle className="h-3 w-3" />
                                    Acción Drástica Auditable
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                            <Button
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                className="font-black uppercase tracking-widest text-[10px] h-11 px-6"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={confirmAction}
                                disabled={loading}
                                className={cn(
                                    "font-black uppercase tracking-widest text-[10px] h-11 px-8 shadow-lg transition-all",
                                    actionType === "block" 
                                        ? "bg-red-600 hover:bg-red-700 text-white shadow-red-200" 
                                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                                )}
                            >
                                {loading ? "Procesando..." : "Confirmar Acción"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

