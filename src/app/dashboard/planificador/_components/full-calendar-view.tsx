"use client";

import React, { useState } from "react";
import { format, addMonths, subMonths, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Info, Clock, AlertCircle, Wrench, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent } from "@/actions/calendar";

interface FullCalendarViewProps {
    events: CalendarEvent[];
    loading: boolean;
    onDayClick?: (date: Date) => void;
    onEventClick?: (id: string) => void;
    onDropTemplate?: (date: Date, template: any) => void;
}

export function FullCalendarView({ events, loading, onDayClick, onEventClick, onDropTemplate }: FullCalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [dragOverDay, setDragOverDay] = useState<string | null>(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    const getDayEvents = (day: Date) => {
        return events.filter(e => isSameDay(new Date(e.date), day));
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "FUEC": return "bg-blue-500";
            case "DOCUMENTO": return "bg-red-500";
            case "MANTENIMIENTO": return "bg-amber-500";
            default: return "bg-emerald-500";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "FUEC": return <Clock className="h-2 w-2 text-white" />;
            case "DOCUMENTO": return <AlertCircle className="h-2 w-2 text-white" />;
            case "MANTENIMIENTO": return <Wrench className="h-2 w-2 text-white" />;
            default: return <Info className="h-2 w-2 text-white" />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Calendar Controls */}
            <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-white">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-primary">
                        {format(currentMonth, "MMMM yyyy", { locale: es })}
                    </h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Vista de Agenda Mensual</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-none bg-white" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 rounded-none bg-white px-4 text-[9px] font-black uppercase tracking-widest" onClick={() => setCurrentMonth(new Date())}>
                        Hoy
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-none bg-white" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-7 border-b border-primary/10 bg-white shadow-sm sticky top-0 z-10">
                    {weekDays.map(d => (
                        <div key={d} className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-slate-900 border-r border-primary/5 last:border-0 text-center sm:text-left">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-primary/10 border-b border-primary/10">
                    {days.map((day, i) => {
                        const dayEvents = getDayEvents(day);
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const today = isToday(day);

                        return (
                            <div 
                                key={i} 
                                className={cn(
                                    "min-h-[140px] bg-white p-3 flex flex-col gap-2 transition-all group border-2 border-transparent",
                                    !isCurrentMonth && "bg-slate-50/10 grayscale opacity-40",
                                    today && "relative ring-2 ring-primary ring-inset z-10",
                                    dragOverDay === day.toISOString() && "bg-accent/5 border-dashed border-accent"
                                )}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = "copy";
                                    setDragOverDay(day.toISOString());
                                }}
                                onDragLeave={() => setDragOverDay(null)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragOverDay(null);
                                    const templateData = e.dataTransfer.getData("sticker-template");
                                    if (templateData && onDropTemplate) {
                                        try {
                                            const template = JSON.parse(templateData);
                                            onDropTemplate(day, template);
                                        } catch (err) {
                                            console.error("Error parsing drop data:", err);
                                        }
                                    }
                                }}
                            >
                                <div className="flex justify-between items-center mb-1 cursor-pointer" onClick={() => onDayClick?.(day)}>
                                    <span className={cn(
                                        "text-xs font-black w-7 h-7 flex items-center justify-center transition-colors",
                                        today ? "bg-primary text-white" : "text-slate-900 group-hover:text-primary"
                                    )}>
                                        {format(day, "d")}
                                    </span>
                                    {dayEvents.length > 0 && (
                                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/5 bg-slate-50 text-primary/60 rounded-none py-0 h-4">
                                            {dayEvents.length} Eventos
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-1.5 overflow-hidden">
                                    {dayEvents.slice(0, 3).map((e) => (
                                        <div 
                                            key={e.id} 
                                            onClick={(ev) => {
                                                ev.stopPropagation();
                                                onEventClick?.(e.id);
                                            }}
                                            className={cn(
                                                "p-1.5 text-[9px] font-bold uppercase tracking-tight flex items-center gap-2 border-l-4 leading-none transition-all cursor-pointer shadow-sm hover:translate-x-1 relative",
                                                e.type === "FUEC" ? "bg-blue-50/50 border-blue-500 text-blue-700" :
                                                e.type === "DOCUMENTO" ? "bg-red-50/50 border-red-500 text-red-700" :
                                                e.type === "MANTENIMIENTO" ? "bg-amber-50/50 border-amber-500 text-amber-700" :
                                                "bg-emerald-50/50 border-emerald-500 text-emerald-700",
                                                e.ejecutado && "opacity-60 grayscale-[0.5]"
                                            )}
                                            style={typeof e.metadata?.color === "string" ? { borderLeftColor: e.metadata.color, backgroundColor: `${e.metadata.color}15` } : undefined}
                                        >
                                            <div className={cn("h-4 w-4 shrink-0 flex items-center justify-center", getTypeColor(e.type))}>
                                                {e.ejecutado ? <CheckCircle2 className="h-2 w-2 text-white" /> : getTypeIcon(e.type)}
                                            </div>
                                            <span className="truncate pr-4">{e.title}</span>
                                            {e.ejecutado && <CheckCircle2 className="h-3 w-3 text-emerald-600 absolute right-1" />}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <p className="text-[8px] font-black text-primary uppercase tracking-widest pl-1 mt-1">
                                            + {dayEvents.length - 3} más
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
