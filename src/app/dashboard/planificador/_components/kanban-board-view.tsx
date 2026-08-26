"use client";

import React from "react";
import { CalendarEvent } from "@/actions/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
    Clock, 
    AlertCircle, 
    Wrench, 
    Info, 
    ChevronRight, 
    MoreHorizontal,
    MoveRight,
    CheckCircle2
} from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface KanbanBoardViewProps {
    events: CalendarEvent[];
    loading: boolean;
    onStatusChange: (id: string, status: string) => void;
    onEventClick?: (id: string) => void;
}

export function KanbanBoardView({ events, loading, onStatusChange, onEventClick }: KanbanBoardViewProps) {
    const columns = [
        { id: "PENDIENTE", label: "STICKERS PENDIENTES", color: "bg-slate-500" },
        { id: "EN_PROCESO", label: "EN OPERACIÓN", color: "bg-blue-600" },
        { id: "COMPLETADO", label: "FINALIZADO / ARCHIVO", color: "bg-emerald-600" },
    ];

    const getColumnEvents = (status: string) => {
        return events.filter(e => e.estado === status);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "FUEC": return "text-blue-600 bg-blue-50 border-blue-200";
            case "DOCUMENTO": return "text-red-600 bg-red-50 border-red-200";
            case "MANTENIMIENTO": return "text-amber-600 bg-amber-50 border-amber-200";
            default: return "text-emerald-600 bg-emerald-50 border-emerald-200";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "FUEC": return <Clock className="h-3 w-3" />;
            case "DOCUMENTO": return <AlertCircle className="h-3 w-3" />;
            case "MANTENIMIENTO": return <Wrench className="h-3 w-3" />;
            default: return <Info className="h-3 w-3" />;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full min-h-[600px] items-start">
            {columns.map((col) => {
                const colEvents = getColumnEvents(col.id);
                return (
                    <div key={col.id} className="flex flex-col h-full bg-slate-50 border border-primary/5 shadow-inner">
                        <div className={cn("p-4 flex items-center justify-between border-b border-primary/10 bg-white shadow-sm", col.id === "PENDIENTE" ? "border-t-4 border-t-slate-500" : col.id === "EN_PROCESO" ? "border-t-4 border-t-blue-600" : "border-t-4 border-t-emerald-600")}>
                            <h3 className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                                {col.label}
                            </h3>
                            <Badge variant="outline" className="text-[10px] font-black font-mono rounded-none border-primary/10 shadow-sm">
                                {colEvents.length}
                            </Badge>
                        </div>

                        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            {colEvents.length > 0 ? (
                                colEvents.map((event) => (
                                    <div 
                                        key={event.id} 
                                        onClick={() => onEventClick?.(event.id)}
                                        className={cn(
                                            "bg-white border-l-4 p-4 shadow-sm hover:shadow-md transition-all group relative border-primary/20 cursor-pointer overflow-hidden",
                                            event.type === "FUEC" ? "border-l-blue-500" :
                                            event.type === "DOCUMENTO" ? "border-l-red-500" :
                                            event.type === "MANTENIMIENTO" ? "border-l-amber-500" :
                                            "border-l-emerald-500",
                                            event.ejecutado && "opacity-70"
                                        )}
                                        style={typeof event.metadata?.color === "string" ? { borderLeftColor: event.metadata.color } : undefined}
                                    >
                                        {event.ejecutado && (
                                            <div className="absolute top-0 right-0 bg-emerald-500 text-white p-1 shadow-md z-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                            </div>
                                        )}
                                        
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={cn("px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest flex items-center gap-1 border", getTypeColor(event.type))}>
                                                {getTypeIcon(event.type)}
                                                {event.type}
                                            </div>
                                            
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none text-slate-900 hover:text-primary">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-none border-primary/10 shadow-2xl">
                                                        <div className="p-2 text-[8px] font-black uppercase tracking-widest text-primary border-b border-primary/5">Mover a</div>
                                                        {columns.filter(c => c.id !== col.id).map(c => (
                                                            <DropdownMenuItem 
                                                                key={c.id} 
                                                                className="text-[10px] font-bold uppercase tracking-tight py-2 cursor-pointer gap-2"
                                                                onClick={() => onStatusChange(event.id, c.id)}
                                                            >
                                                                <MoveRight className="h-3 w-3 text-slate-900" />
                                                                {c.label.split(" ")[0]}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        <h4 className="text-xs font-black text-primary uppercase leading-tight mb-2 group-hover:text-accent transition-colors">
                                            {event.title}
                                        </h4>
                                        
                                        {event.description && (
                                            <p className="text-[10px] text-primary/60 font-medium mb-4 line-clamp-3">
                                                {event.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-3 border-t border-primary/5 mt-auto">
                                            <div className="flex items-center gap-1.5 opacity-40">
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    event.priority === "ALTA" ? "bg-red-500 animate-pulse" :
                                                    event.priority === "MEDIA" ? "bg-amber-500" :
                                                    "bg-slate-400"
                                                )} />
                                                <span className="text-[8px] font-black uppercase tracking-[0.1em]">
                                                    {event.priority}
                                                </span>
                                            </div>
                                            {event.ejecutado ? (
                                                <div className="flex items-center gap-1 text-emerald-600">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Validado</span>
                                                </div>
                                            ) : (
                                                <div className="text-[9px] font-mono font-black text-primary">
                                                    {new Date(event.date).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit" })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-primary/5 bg-white/50">
                                    <p className="text-[9px] font-black text-primary/20 uppercase tracking-[0.2em]">Columna Vacía</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
