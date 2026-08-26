"use client";

import * as React from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import {
    ShieldAlert,
    Info,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    MapPin,
    User,
    FileText,
    Truck,
    X,
    CalendarDays,
    ArrowRight
} from "lucide-react";
import { getSafetyCalendarEvents } from "@/actions";
import { SafetyCalendarEvent } from "@/services/safety/calendar.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SafetyCalendarView() {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
    const [events, setEvents] = React.useState<SafetyCalendarEvent[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedDateEvents, setSelectedDateEvents] = React.useState<SafetyCalendarEvent[]>([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const fetchEvents = React.useCallback(async (month: Date) => {
        setLoading(true);
        try {
            const res = await getSafetyCalendarEvents(month);
            if (res.success && res.data) {
                setEvents(res.data as SafetyCalendarEvent[]);
            } else {
                toast.error("Error al cargar eventos del calendario");
            }
        } catch {
            toast.error("Error inesperado al cargar eventos");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchEvents(currentMonth);
    }, [currentMonth, fetchEvents]);

    const handleSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            const dayEvents = events.filter((e) => isSameDay(new Date(e.date), date));
            if (dayEvents.length > 0) {
                setSelectedDateEvents(dayEvents);
                setIsDialogOpen(true);
            }
        }
    };

    const getDaysInMonth = (month: Date) => {
        const year = month.getFullYear();
        const m = month.getMonth();
        const firstDay = new Date(year, m, 1);
        const lastDay = new Date(year, m + 1, 0);
        const days: (Date | null)[] = [];
        
        for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
        for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, m, d));
        return days;
    };

    const getEventIcon = (type: string) => {
        switch (type) {
            case "DOCUMENTO_VEHICULO": return <FileText className="h-4 w-4" />;
            case "LICENCIA_CONDUCCION": return <User className="h-4 w-4" />;
            case "EXAMEN_MEDICO": return <ShieldAlert className="h-4 w-4" />;
            case "PLANILLA_FUEC": return <MapPin className="h-4 w-4" />;
            default: return <Info className="h-4 w-4" />;
        }
    };

    const getSeverityClasses = (severity: string) => {
        switch (severity) {
            case "critical": return "bg-red-50 text-red-700 border-red-100 hover:bg-red-100";
            case "warning": return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100";
            case "info": return "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100";
            default: return "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100";
        }
    };

    const days = getDaysInMonth(currentMonth);
    const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <CalendarDays className="h-6 w-6 text-secondary" />
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Calendario de Seguridad
                    </h1>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-9">
                    Control preventivo de vencimientos y vigencias de la flota
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* CALENDAR CARD */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                    {/* Month Navigation */}
                    <div className="flex justify-between items-center mb-10">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                            className="h-10 w-10 border-slate-200 rounded-xl"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-[0.2em]">
                            {format(currentMonth, "MMMM yyyy", { locale: es })}
                        </h2>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                            className="h-10 w-10 border-slate-200 rounded-xl"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Week days header */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {weekDays.map((day) => (
                            <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-3">
                        {days.map((day, i) => {
                            if (!day) return <div key={`empty-${i}`} className="aspect-square" />;
                            
                            const dayEvents = events.filter((e) => {
                                const ed = new Date(e.date);
                                return ed.getUTCFullYear() === day.getFullYear() &&
                                    ed.getUTCMonth() === day.getMonth() &&
                                    ed.getUTCDate() === day.getDate();
                            });
                            const hasCritical = dayEvents.some((e) => e.severity === "critical");
                            const hasWarning = dayEvents.some((e) => e.severity === "warning");
                            const isToday = isSameDay(day, new Date());
                            const isSelected = selectedDate && isSameDay(day, selectedDate);

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => handleSelect(day)}
                                    className={cn(
                                        "aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all relative group",
                                        isSelected 
                                            ? "bg-slate-900 border-slate-900 text-white shadow-lg scale-105 z-10" 
                                            : isToday 
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-black" 
                                                : "bg-white border-slate-100 text-slate-600 hover:border-secondary hover:text-secondary",
                                        dayEvents.length > 0 && !isSelected && "font-black"
                                    )}
                                >
                                    <span className="text-sm">{day.getDate()}</span>
                                    {dayEvents.length > 0 && (
                                        <div className="flex gap-1 justify-center mt-1">
                                            {hasCritical && <div className={cn("w-1.5 h-1.5 rounded-full bg-red-500", isSelected && "bg-white")} />}
                                            {hasWarning && <div className={cn("w-1.5 h-1.5 rounded-full bg-amber-500", isSelected && "bg-white")} />}
                                        </div>
                                    )}
                                    {isToday && !isSelected && (
                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center gap-2 mt-8 py-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 animate-pulse">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Eventos...</span>
                        </div>
                    )}
                </div>

                {/* UPCOMING EXPIRATIONS PANEL */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6 shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                            Próximos Vencimientos
                        </h3>
                    </div>
                    
                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {events.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <Info className="h-10 w-10 text-slate-100 mb-4" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sin alertas para este periodo</p>
                            </div>
                        ) : (
                            events
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleSelect(new Date(event.date))}
                                        className={cn(
                                            "p-4 rounded-xl border transition-all cursor-pointer group",
                                            getSeverityClasses(event.severity)
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-white/50 rounded-lg">
                                                    {getEventIcon(event.type)}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">
                                                    {format(new Date(event.date), "dd MMM", { locale: es })}
                                                </span>
                                            </div>
                                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <h4 className="text-xs font-black uppercase mb-1 leading-tight group-hover:underline">
                                            {event.entityName}
                                        </h4>
                                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-tight leading-relaxed">{event.label}</p>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>

            {/* DETAIL DIALOG */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
                        <div className="p-8 border-b border-slate-100 shrink-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-3 bg-secondary/10 rounded-2xl mb-4">
                                    <ShieldAlert className="h-6 w-6 text-secondary" />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="rounded-full hover:bg-slate-100"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                Detalle de Vencimientos
                            </h3>
                            {selectedDate && (
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                                    {format(selectedDate, "EEEE, dd 'de' MMMM yyyy", { locale: es })}
                                </p>
                            )}
                        </div>

                        <div className="p-8 overflow-y-auto space-y-4 flex-1">
                            {selectedDateEvents.map((event) => (
                                <div key={event.id} className={cn(
                                    "p-6 rounded-2xl border flex flex-col gap-4",
                                    getSeverityClasses(event.severity)
                                )}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/50 rounded-xl">
                                            {getEventIcon(event.type)}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                                            {event.type.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black uppercase leading-tight">{event.label}</h3>
                                        <div className="flex items-center gap-2 mt-3 p-3 bg-white/30 rounded-xl">
                                            {event.type.includes("VEHICULO") ? <Truck className="h-4 w-4 opacity-60" /> : <User className="h-4 w-4 opacity-60" />}
                                            <span className="text-[11px] font-black uppercase tracking-tight">
                                                Identidad: <b className="ml-1 opacity-100 underline">{event.entityName}</b>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs font-medium leading-relaxed opacity-90">{event.description}</div>
                                </div>
                            ))}

                            {selectedDateEvents.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                    <Info className="h-10 w-10 text-slate-100 mb-4" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">No hay registros operacionales<br/>para este ciclo</p>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
                            <Button
                                onClick={() => setIsDialogOpen(false)}
                                className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl shadow-slate-200"
                            >
                                Cerrar Detalles
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

