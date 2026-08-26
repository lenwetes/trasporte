"use client";

import { useState } from "react";
import { deleteVehiculo } from "@/actions";
import { 
    Trash2, 
    AlertTriangle, 
    Loader2, 
    ShieldAlert, 
    ChevronRight,
    SearchX
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DeleteVehicleButtonProps {
    vehicleId: string;
    placa: string;
    className?: string;
}

export function DeleteVehicleButton({
    vehicleId,
    placa,
    className,
}: DeleteVehicleButtonProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteVehiculo(vehicleId);
            if (result.success) {
                toast.success(`Activo ${placa} desvinculado exitosamente del inventario.`);
                window.location.reload();
            } else {
                toast.error(result.error || "No se pudo procesar la desvinculación");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error crítico en el protocolo de eliminación");
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setShowConfirm(true)}
                variant="outline"
                disabled={loading}
                title="Desvincular Activo"
                className={cn(
                    "h-14 rounded-none border-primary/10 bg-white hover:bg-red-50 text-red-600/40 hover:text-red-600 transition-all",
                    className
                )}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="max-w-md p-0 rounded-none border-none overflow-hidden sm:max-w-[450px]">
                    <div className="bg-white">
                        <DialogHeader className="p-8 bg-red-600 text-white">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-white/10 flex items-center justify-center border border-white/20">
                                    <ShieldAlert className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-0.5">
                                    <DialogTitle className="text-lg font-black uppercase tracking-tighter">Protocolo de Purga</DialogTitle>
                                    <DialogDescription className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                        Confirmación de Desvinculación de Activo Fijo
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="p-8 text-center space-y-6">
                            <div className="flex justify-center">
                                <div className="h-20 w-20 bg-red-50 flex items-center justify-center">
                                    <SearchX className="h-10 w-10 text-red-600" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black text-primary uppercase tracking-tight">
                                    ¿CERTIFICA LA ELIMINACIÓN DE LA UNIDAD <span className="text-red-600 font-mono tracking-normal">{placa}</span>?
                                </p>
                                <p className="text-[11px] font-bold text-muted-foreground uppercase leading-relaxed tracking-tight max-w-xs mx-auto">
                                    Esta acción es irreversible. Se eliminarán permanentemente los registros de mantenimiento, documentos y vinculaciones asociadas en el Libro Mayor.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="p-8 bg-slate-50 border-t border-primary/5 flex flex-col sm:flex-row gap-4">
                            <Button 
                                variant="ghost" 
                                onClick={() => setShowConfirm(false)} 
                                className="rounded-none font-black text-[10px] uppercase tracking-widest h-12 flex-1"
                            >
                                ABORTAR OPERACIÓN
                            </Button>
                            <Button
                                onClick={handleDelete}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-none font-black text-[10px] uppercase tracking-[0.15em] h-12 px-8 flex-1 gap-2 shadow-xl"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                    <>
                                        CONFIRMAR DESVINCULACIÓN <ChevronRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
