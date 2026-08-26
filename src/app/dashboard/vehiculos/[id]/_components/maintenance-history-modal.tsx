"use client";

import { VehiculoWithRelations } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { MaintenanceHistory } from "./maintenance-history";

interface MaintenanceHistoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehiculo: VehiculoWithRelations;
}

export function MaintenanceHistoryModal({
    open,
    onOpenChange,
    vehiculo,
}: MaintenanceHistoryModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}> <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Historial de Mantenimiento
                    </DialogTitle>
                    <DialogDescription>
                        Registro de mantenimientos y órdenes de servicio del
                        vehículo
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <MaintenanceHistory
                        mantenimientos={vehiculo.mantenimientos}
                        ordenesPendientes={vehiculo.ordenesServicio}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
