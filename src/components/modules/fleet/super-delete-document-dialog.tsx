"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteDocumentoSuperUserAction } from "@/actions/documentos";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldAlert, AlertTriangle, Trash2, X } from "lucide-react";

interface SuperDeleteDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentId: string;
    documentLabel: string;
}

export function SuperDeleteDocumentDialog({
    open,
    onOpenChange,
    documentId,
    documentLabel,
}: SuperDeleteDocumentDialogProps) {
    const [justificacion, setJustificacion] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!justificacion.trim() || justificacion.trim().length < 10) {
            toast.error(
                "Debe ingresar una justificación válida (mín. 10 caracteres)",
            );
            return;
        }

        setLoading(true);
        try {
            const result = await deleteDocumentoSuperUserAction({
                id: documentId,
                justificacion,
            });

            if (result.success) {
                toast.success("Documento eliminado permanentemente");
                onOpenChange(false);
                setJustificacion("");
                router.refresh();
            } else {
                toast.error(result.error || "Ocurrió un error");
            }
        } catch (error) {
            toast.error("Error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-rose-100 shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl ring-4 ring-rose-50/50">
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
                                Eliminación Forense
                            </DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-rose-600/80 mt-1">
                                Protocolo de Purga Administrativa de Alto Nivel
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={18} />
                        <div className="space-y-1">
                            <p className="text-xs font-black text-rose-900 uppercase tracking-tight leading-none">
                                Advertencia Crítica
                            </p>
                            <p className="text-[11px] text-rose-800 leading-relaxed">
                                Esta acción es <span className="font-bold underline">irreversible</span>. El documento <span className="font-bold">{documentLabel}</span> será eliminado de la base de datos y de los servidores de almacenamiento físico.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label
                            htmlFor="justificacion-forense"
                            className="text-[10px] font-black uppercase tracking-widest text-slate-900"
                        >
                            Justificación Técnica Obligatoria
                        </Label>
                        <Textarea
                            id="justificacion-forense"
                            placeholder="Describa el motivo técnico o legal para la eliminación definitiva del registro..."
                            className="bg-slate-50 border-slate-200 focus:bg-white min-h-[120px] text-sm font-medium"
                            value={justificacion}
                            onChange={(e) => setJustificacion(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-900"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Abortar
                    </Button>
                    <Button 
                        type="button"
                        variant="destructive"
                        className="bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 px-6 rounded-xl shadow-lg shadow-rose-200 transition-all font-black uppercase text-xs tracking-widest"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin text-white">
                                    <Trash2 size={14} />
                                </span>
                                Procesando...
                            </span>
                        ) : (
                            <>
                                Ejecutar Purga
                                <Trash2 size={14} />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
