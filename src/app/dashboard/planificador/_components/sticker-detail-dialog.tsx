"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarEvent, toggleEventExecution } from "@/actions/calendar";
import { 
  Clock, 
  AlertCircle, 
  Wrench, 
  Info, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  User,
  MapPin,
  Car,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface StickerDetailDialogProps {
    event: CalendarEvent | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

export function StickerDetailDialog({ event, open, onOpenChange, onUpdate }: StickerDetailDialogProps) {
    if (!event) return null;

    const handleToggleExecution = async () => {
        const res = await toggleEventExecution(event.id, !event.ejecutado);
        if (res.success) {
            toast.success(event.ejecutado ? "Acción marcada como pendiente" : "Acción validada con éxito");
            onUpdate();
        } else {
            toast.error("Error al actualizar la acción");
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "FUEC": return <Clock className="h-5 w-5 text-blue-500" />;
            case "DOCUMENTO": return <AlertCircle className="h-5 w-5 text-red-500" />;
            case "MANTENIMIENTO": return <Wrench className="h-5 w-5 text-amber-500" />;
            default: return <Info className="h-5 w-5 text-emerald-500" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-none border-primary/20 bg-white p-0 overflow-hidden">
                {/* Cabecera Estilo Premium */}
                <div 
                    className={cn(
                        "h-2 w-full",
                        !event.metadata?.color && (
                            event.type === "FUEC" ? "bg-blue-500" :
                            event.type === "DOCUMENTO" ? "bg-red-500" :
                            event.type === "MANTENIMIENTO" ? "bg-amber-500" : "bg-emerald-500"
                        )
                    )} 
                    style={typeof event.metadata?.color === "string" ? { backgroundColor: event.metadata.color } : undefined}
                />
                
                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/10 rounded-none h-6">
                                {event.type}
                            </Badge>
                            <div className="flex items-center gap-1.5 gray-indicator">
                                <div className={cn(
                                    "h-2 w-2 rounded-full",
                                    event.priority === "ALTA" ? "bg-red-500 pulse" : "bg-primary/20"
                                )} />
                                <span className="text-[9px] font-black uppercase text-slate-900 tracking-tighter">Prioridad {event.priority}</span>
                            </div>
                        </div>
                        <DialogTitle className="text-xl font-black uppercase tracking-tight text-primary leading-tight">
                            {event.title}
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-bold uppercase text-primary mt-1 flex items-center gap-2">
                            <CalendarIcon className="h-3 w-3" />
                            Programado para: {format(new Date(event.date), "dd 'de' MMMM, yyyy", { locale: es })}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Contenido de la Nota */}
                    <div className="space-y-6">
                        {event.description && (
                            <div className="bg-slate-50 border border-primary/5 p-4 relative">
                                <span className="absolute -top-2 left-3 bg-white px-2 py-0 text-[8px] font-black text-primary uppercase tracking-widest">Contenido</span>
                                <p className="text-xs text-primary/70 font-medium leading-relaxed italic">
                                    "{event.description}"
                                </p>
                            </div>
                        )}

                        {/* Detalles Específicos según tipo */}
                        <div className="grid grid-cols-2 gap-4">
                            {!!event.metadata?.placa && (
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-primary uppercase tracking-widest block">Vehículo</label>
                                    <div className="flex items-center gap-2 text-[11px] font-black text-primary">
                                        <Car className="h-3 w-3 text-accent" />
                                        {String(event.metadata.placa)}
                                    </div>
                                </div>
                            )}
                            {!!event.metadata?.conductor && (
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-primary uppercase tracking-widest block">Conductor</label>
                                    <div className="flex items-center gap-2 text-[11px] font-black text-primary">
                                        <User className="h-3 w-3 text-accent" />
                                        {String(event.metadata.conductor)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Estado de Ejecución */}
                        <div className={cn(
                            "p-4 border flex items-center justify-between transition-all",
                            event.ejecutado ? "bg-emerald-50/50 border-emerald-500/30" : "bg-slate-50/50 border-primary/10"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "h-10 w-10 flex items-center justify-center transition-all",
                                    event.ejecutado ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-200 text-slate-900"
                                )}>
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-primary tracking-tight">Estado de Ejecución</p>
                                    <p className={cn(
                                        "text-[9px] font-black uppercase tracking-widest",
                                        event.ejecutado ? "text-emerald-600" : "text-slate-900"
                                    )}>
                                        {event.ejecutado ? "Acción Validada ✓" : "Pendiente de Validación"}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Solo permitir validar si es una NOTA o si queremos permitirlo siempre */}
                            <Button 
                                variant={event.ejecutado ? "outline" : "default"}
                                size="sm"
                                className={cn(
                                    "rounded-none h-8 text-[9px] font-black uppercase tracking-widest px-4",
                                    !event.ejecutado ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg" : "border-emerald-500 text-emerald-600 bg-white"
                                )}
                                onClick={handleToggleExecution}
                            >
                                {event.ejecutado ? "Anular Validación" : "Validar Ahora"}
                            </Button>
                        </div>
                        
                        {event.ejecutado && event.fechaEjecucion && (
                             <p className="text-[8px] font-bold text-emerald-600/70 uppercase tracking-widest text-center">
                                Ejecutado el: {format(new Date(event.fechaEjecucion), "dd/MM/yyyy HH:mm", { locale: es })}
                             </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="bg-slate-50 p-4 border-t border-primary/5">
                    <Button 
                        variant="ghost" 
                        className="w-full rounded-none text-[10px] font-black uppercase tracking-widest h-10 text-slate-900 hover:text-primary transition-colors"
                        onClick={() => onOpenChange(false)}
                    >
                        Cerrar Ventana
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
