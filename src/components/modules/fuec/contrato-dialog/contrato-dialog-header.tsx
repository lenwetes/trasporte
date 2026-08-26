"use client";

import { Briefcase } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ContratoDialogHeaderProps {
    isEdit: boolean;
}

export function ContratoDialogHeader({ isEdit }: ContratoDialogHeaderProps) {
    return (
        <div className="bg-primary p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45" />
            <DialogHeader className="relative">
                <div className="flex items-center gap-4 mb-2">
                    <div className="h-12 w-12 bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl">
                        <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter leading-none">{isEdit ? "EDITAR CONTRATO" : "Vínculo de Contrato"}</DialogTitle>
                        <DialogDescription className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Configuración Maestro de Parámetros FUEC</DialogDescription>
                    </div>
                </div>
            </DialogHeader>
        </div>
    );
}
