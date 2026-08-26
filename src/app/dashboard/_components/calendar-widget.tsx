"use client";

import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  FileText, 
  ShieldAlert, 
  Wrench,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { CalendarEvent, getCalendarEvents, createCalendarEvent } from "@/actions/calendar";
import { toast } from "sonner";

export function CalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Form state for new event
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("MEDIA");

  useEffect(() => {
    fetchEvents();
  }, [currentMonth]);

  const fetchEvents = async () => {
    setLoading(true);
    // calculate month offset logic could be simpler or just pass the date
    // for now let's assume we can fetch what we need
    const res = await getCalendarEvents(0); // placeholder, I should update action to take a date
    if (res.success && res.data) {
      setEvents(res.data);
    }
    setLoading(false);
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setIsDetailOpen(true);
  };

  const handleAddEvent = async () => {
    if (!newTitle || !selectedDay) return;
    const res = await createCalendarEvent({
      titulo: newTitle,
      descripcion: newDesc,
      fecha: selectedDay,
      tipo: "NOTA",
      prioridad: newPriority
    });

    if (res.success) {
      toast.success("Evento guardado correctamente");
      setIsAddEventOpen(false);
      setNewTitle("");
      setNewDesc("");
      fetchEvents();
    } else {
      toast.error("Error al guardar el evento");
    }
  };

  const daysHeader = ["D", "L", "M", "M", "J", "V", "S"];
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getDayEvents = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), day));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "FUEC": return <Clock className="h-3 w-3 text-blue-500" />;
      case "DOCUMENTO": return <ShieldAlert className="h-3 w-3 text-red-500" />;
      case "MANTENIMIENTO": return <Wrench className="h-3 w-3 text-amber-500" />;
      default: return <Info className="h-3 w-3 text-emerald-500" />;
    }
  };

  return (
    <div className="bg-white border border-primary/10 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-primary/5 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-accent" />
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-3">
        <div className="grid grid-cols-7 mb-2">
          {daysHeader.map((d, i) => (
            <div key={`${d}-${i}`} className="text-center text-[9px] font-black text-primary py-1">
              {d}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-primary/5 border border-primary/5">
          {calendarDays.map((day, idx) => {
            const dayEvents = getDayEvents(day);
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div
                key={idx}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "min-h-[60px] p-1 bg-white cursor-pointer hover:bg-slate-50 transition-all flex flex-col gap-1 relative",
                  !isCurrentMonth && "bg-slate-50/30 opacity-40",
                  isSelected && "ring-1 ring-accent z-10"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-[10px] font-bold w-5 h-5 flex items-center justify-center",
                    isToday(day) && "bg-accent text-primary rounded-none",
                    !isToday(day) && isCurrentMonth && "text-primary/70",
                    !isCurrentMonth && "text-primary/20"
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[8px] font-black text-accent/60">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Event Dots */}
                <div className="flex flex-wrap gap-0.5 mt-auto">
                    {dayEvents.slice(0, 4).map((e, index) => (
                        <div 
                            key={index} 
                            className={cn(
                                "h-1 w-1",
                                e.type === "DOCUMENTO" ? "bg-red-500" :
                                e.type === "FUEC" ? "bg-blue-500" :
                                e.type === "MANTENIMIENTO" ? "bg-amber-500" : "bg-emerald-500"
                            )}
                        />
                    ))}
                    {dayEvents.length > 4 && <div className="h-1 w-1 bg-slate-300" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md rounded-none border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-accent" />
                {selectedDay && format(selectedDay, "dd 'de' MMMM, yyyy", { locale: es })}
            </DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-tight font-bold text-slate-900">
                Agenda del día seleccionado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {selectedDay && getDayEvents(selectedDay).length > 0 ? (
                getDayEvents(selectedDay).map((event) => (
                    <div key={event.id} className="p-3 border border-primary/5 bg-slate-50 flex items-start gap-3 group">
                        <div className="shrink-0 mt-0.5">
                            {getTypeIcon(event.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="text-[10px] font-black text-primary uppercase leading-tight truncate">
                                    {event.title}
                                </h4>
                                <Badge variant="outline" className={cn(
                                    "text-[8px] px-1 py-0 h-4 rounded-none border-primary/10",
                                    event.priority === "ALTA" ? "text-red-600 bg-red-50" : "text-slate-900"
                                )}>
                                    {event.priority}
                                </Badge>
                            </div>
                            {event.description && (
                                <p className="text-[9px] text-primary/60 mt-1 line-clamp-2 italic">
                                    {event.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-8 text-center bg-slate-50 border border-dashed border-primary/10">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">No hay actividades para este día</p>
                </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
                variant="outline" 
                className="rounded-none text-[10px] font-black uppercase tracking-widest h-10 w-full sm:flex-1"
                onClick={() => setIsAddEventOpen(true)}
            >
                <Plus className="h-3 w-3 mr-2 text-accent" />
                Añadir Nota
            </Button>
            <Button 
                variant="default" 
                className="rounded-none text-[10px] font-black uppercase tracking-widest h-10 w-full sm:flex-1 bg-primary text-white"
                onClick={() => setIsDetailOpen(false)}
            >
                Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="max-w-sm rounded-none border-primary/20">
            <DialogHeader>
                <DialogTitle className="text-sm font-black uppercase tracking-widest text-primary">Nueva Nota / Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-900 uppercase">Título</label>
                    <input 
                        className="w-full bg-slate-50 border-primary/10 border p-3 text-xs outline-none focus:border-accent"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ej: Reunión de socios..."
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-900 uppercase">Descripción</label>
                    <textarea 
                        className="w-full bg-slate-50 border-primary/10 border p-3 text-xs outline-none focus:border-accent min-h-[80px] resize-none"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Detalles adicionales..."
                    />
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {["BAJA", "MEDIA", "ALTA"].map((p) => (
                        <Button
                            key={p}
                            variant={newPriority === p ? "default" : "outline"}
                            className={cn(
                                "h-9 rounded-none text-[9px] font-black uppercase",
                                newPriority === p && p === "ALTA" ? "bg-red-600" : 
                                newPriority === p ? "bg-primary" : ""
                            )}
                            onClick={() => setNewPriority(p)}
                        >
                            {p}
                        </Button>
                    ))}
                </div>
            </div>
            <DialogFooter>
                <Button 
                    variant="default" 
                    className="w-full rounded-none bg-accent hover:bg-accent/90 text-[10px] font-black uppercase h-10 text-primary border-none shadow-none"
                    onClick={handleAddEvent}
                >
                    Guardar en Calendario
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
