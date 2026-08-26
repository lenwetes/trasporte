"use client";

import { VehiculoWithRelations } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { SiniestrosHistory } from "./siniestros-history";

interface SiniestrosHistoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehiculo: VehiculoWithRelations;
}

export function SiniestrosHistoryModal({
    open,
    onOpenChange,
    vehiculo,
}: SiniestrosHistoryModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}> <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Historial de Siniestros
                    </DialogTitle>
                    <DialogDescription>
                        Registro de incidentes y accidentes asociados a este
                        vehículo
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <SiniestrosHistory siniestros={vehiculo.siniestros} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
