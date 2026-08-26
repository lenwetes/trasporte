"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarRange, 
  Kanban, 
  Plus, 
  Search, 
  Clock, 
  AlertCircle, 
  Wrench,
  Info,
  Library
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { 
  CalendarEvent, 
  getCalendarEvents, 
  updateCalendarEventStatus, 
  createCalendarEvent 
} from "@/actions/calendar";
import { FullCalendarView } from "@/app/dashboard/planificador/_components/full-calendar-view";
import { KanbanBoardView } from "@/app/dashboard/planificador/_components/kanban-board-view";
import { StickerDetailDialog } from "@/app/dashboard/planificador/_components/sticker-detail-dialog";
import { StickerLibrary, StickerTemplate } from "@/app/dashboard/planificador/_components/sticker-library";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function PlannerView() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Modal state for new note
    const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newPriority, setNewPriority] = useState("MEDIA");
    const [newType, setNewType] = useState("NOTA");
    const [newColor, setNewColor] = useState("#10b981");

    const COLORS = [
        { label: "Emerald", value: "#10b981" },
        { label: "Crimson", value: "#ef4444" },
        { label: "Royal", value: "#3b82f6" },
        { label: "Amber", value: "#f59e0b" },
        { label: "Slate", value: "#64748b" },
        { label: "Purple", value: "#8b5cf6" },
    ];

    // Detail view state
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Sidebar state
    const [isLibraryOpen, setIsLibraryOpen] = useState(true);

    const loadEvents = useCallback(async () => {
        setLoading(true);
        const res = await getCalendarEvents(0);
        if (res.success && res.data) {
            setEvents(res.data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const handleStatusChange = async (eventId: string, newStatus: string) => {
        const res = await updateCalendarEventStatus(eventId, newStatus);
        if (res.success) {
            loadEvents();
            toast.success("Estado actualizado");
        } else {
            toast.error("No se pudo actualizar el estado");
        }
    };

    const handleOpenCreator = (date?: Date) => {
        if (date) setSelectedDate(date);
        else setSelectedDate(new Date());
        
        // Reset defaults
        setNewTitle("");
        setNewDesc("");
        setNewPriority("MEDIA");
        setNewType("NOTA");
        setNewColor("#10b981");
        
        setIsAddNoteOpen(true);
    };

    const handleOpenDetail = (eventId: string) => {
        setSelectedEventId(eventId);
        setIsDetailOpen(true);
    };

    const handleSelectTemplate = (tpl: StickerTemplate) => {
        setNewTitle(tpl.title);
        setNewDesc(tpl.description);
        setNewPriority(tpl.priority);
        setNewType(tpl.type);
        setNewColor(tpl.priority === 'ALTA' ? '#ef4444' : tpl.type === 'MANTENIMIENTO' ? '#f59e0b' : '#10b981');
        setIsAddNoteOpen(true);
    };

    const handleDropTemplate = (date: Date, tpl: StickerTemplate) => {
        setSelectedDate(date);
        setNewTitle(tpl.title);
        setNewDesc(tpl.description);
        setNewPriority(tpl.priority);
        setNewType(tpl.type);
        setNewColor(tpl.priority === 'ALTA' ? '#ef4444' : tpl.type === 'MANTENIMIENTO' ? '#f59e0b' : '#10b981');
        setIsAddNoteOpen(true);
        toast.info(`Programando: ${tpl.title}`, {
            description: `Para el ${format(date, "dd 'de' MMMM", { locale: es })}`,
        });
    };

    const handleCreateNote = async () => {
        if (!newTitle) {
            toast.error("El título es obligatorio");
            return;
        }

        const res = await createCalendarEvent({
            titulo: newTitle,
            descripcion: newDesc,
            fecha: selectedDate,
            tipo: newType,
            prioridad: newPriority,
            estado: "PENDIENTE",
            metadata: { color: newColor }
        });

        if (res.success) {
            toast.success("Nota creada con éxito");
            setIsAddNoteOpen(false);
            setNewTitle("");
            setNewDesc("");
            setNewPriority("MEDIA");
            loadEvents();
        } else {
            toast.error(res.error || "Error al crear la nota");
        }
    };

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const selectedEvent = events.find(e => e.id === selectedEventId) || null;

    return (
        <div className="flex gap-0 min-h-[calc(100vh-100px)]">
            {/* Sidebar Biblioteca - Izquierda */}
            <div className={cn(
                "transition-all duration-300 border-r border-primary/10 overflow-hidden bg-white shadow-2xl z-20",
                isLibraryOpen ? "w-[300px]" : "w-0 border-none"
            )}>
                <StickerLibrary onSelect={handleSelectTemplate} />
            </div>

            {/* Contenedor Principal - Derecha */}
            <div className="flex-1 p-6 space-y-6 max-w-[1600px] bg-slate-50/30">
                {/* Header Operativo */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-primary/10 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className={cn(
                                "h-10 w-10 rounded-none border-primary/10",
                                !isLibraryOpen && "bg-accent text-primary border-accent"
                            )}
                            onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                        >
                            <Library className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-primary flex items-center gap-3">
                                <CalendarRange className="h-6 w-6 text-accent" />
                                Planificador Estratégico
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mt-1">
                                Gestión de Tareas, Eventos y Stickers Operativos
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input 
                                placeholder="Buscar en el plan..." 
                                className="pl-9 h-10 w-64 rounded-none border-primary/10 text-xs font-bold uppercase"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button 
                            className="h-10 rounded-none bg-primary text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-xl hover:bg-primary/90 transition-colors"
                            onClick={() => handleOpenCreator()}
                        >
                            <Plus className="h-4 w-4 mr-2 text-accent" />
                            Nueva Nota
                        </Button>
                    </div>
                </div>

                {/* Main Tabs */}
                <Tabs defaultValue="calendar" className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <TabsList className="bg-slate-100 p-1 rounded-none border border-primary/5">
                            <TabsTrigger 
                                value="calendar" 
                                className="rounded-none data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 text-[10px] font-black uppercase tracking-widest"
                            >
                                <CalendarRange className="h-3 w-3 mr-2" />
                                Calendario Full
                            </TabsTrigger>
                            <TabsTrigger 
                                value="kanban" 
                                className="rounded-none data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 text-[10px] font-black uppercase tracking-widest"
                            >
                                <Kanban className="h-3 w-3 mr-2" />
                                Tablero Kanban
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 gray-indicator">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span className="text-[8px] font-black uppercase text-primary/60 tracking-tighter">FUEC</span>
                                </div>
                                <div className="flex items-center gap-1.5 gray-indicator">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <span className="text-[8px] font-black uppercase text-primary/60 tracking-tighter">Documento</span>
                                </div>
                                <div className="flex items-center gap-1.5 gray-indicator">
                                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                                    <span className="text-[8px] font-black uppercase text-primary/60 tracking-tighter">Mantenimiento</span>
                                </div>
                                <div className="flex items-center gap-1.5 gray-indicator">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-[8px] font-black uppercase text-primary/60 tracking-tighter">Nota</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TabsContent value="calendar" className="mt-1 focus-visible:outline-none">
                        <div className="bg-white border border-primary/10 shadow-2xl min-h-[700px]">
                            <FullCalendarView 
                                events={filteredEvents} 
                                loading={loading} 
                                onDayClick={handleOpenCreator} 
                                onEventClick={handleOpenDetail} 
                                onDropTemplate={handleDropTemplate}
                            />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="kanban" className="mt-1 focus-visible:outline-none overflow-x-auto pb-4">
                        <div className="min-w-[1000px]">
                            <KanbanBoardView 
                                events={filteredEvents} 
                                loading={loading} 
                                onStatusChange={handleStatusChange} 
                                onEventClick={handleOpenDetail}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modals para Creación */}
            <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
                <DialogContent className="max-w-sm rounded-none border-primary/20 bg-white shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                          <Plus className="h-4 w-4 text-accent" />
                          Nueva Tarea Estratégica
                        </DialogTitle>
                        <DialogDescription className="text-[9px] font-bold uppercase text-slate-900 tracking-tight flex items-center justify-between">
                          <span>Fecha Seleccionada:</span>
                          <span className="text-accent">{format(selectedDate, "dd 'de' MMMM", { locale: es })}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-900 uppercase">Fecha de Programación</label>
                            <input 
                                type="date"
                                className="w-full bg-slate-50 border-primary/10 border p-3 text-xs outline-none focus:border-accent font-bold text-primary uppercase"
                                value={format(selectedDate, 'yyyy-MM-dd')}
                                onChange={(e) => {
                                    const nextDate = new Date(e.target.value);
                                    // Ajustar zona horaria para evitar desfase
                                    nextDate.setMinutes(nextDate.getMinutes() + nextDate.getTimezoneOffset());
                                    setSelectedDate(nextDate);
                                }}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-900 uppercase">Asunto / Título</label>
                            <input 
                                className="w-full bg-slate-50 border-primary/10 border p-3 text-xs outline-none focus:border-accent font-bold text-primary uppercase"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="EJ: REVISIÓN DE NEUMÁTICOS..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-900 uppercase">Contenido / Detalle</label>
                            <textarea 
                                className="w-full bg-slate-50 border-primary/10 border p-3 text-xs outline-none focus:border-accent min-h-[80px] resize-none font-medium text-primary/70"
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                                placeholder="Escribe los detalles aquí..."
                            />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-900 uppercase mb-2 block">Prioridad de Atención</label>
                          <div className="grid grid-cols-3 gap-2">
                              {["BAJA", "MEDIA", "ALTA"].map((p) => (
                                  <Button
                                      key={p}
                                      variant={newPriority === p ? "default" : "outline"}
                                      className={cn(
                                          "h-9 rounded-none text-[9px] font-black uppercase transition-all",
                                          newPriority === p && p === "ALTA" ? "bg-red-600 border-red-600 text-white" : 
                                          newPriority === p ? "bg-primary border-primary text-white" : "border-primary/10 text-slate-900"
                                      )}
                                      onClick={() => setNewPriority(p as any)}
                                  >
                                      {p}
                                  </Button>
                              ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-900 uppercase block">Identidad Visual (Color)</label>
                          <div className="flex items-center gap-3">
                              {COLORS.map((c: any) => (
                                  <button
                                      key={c.value}
                                      type="button"
                                      className={cn(
                                          "h-6 w-6 rounded-full transition-all border-2",
                                          newColor === c.value ? "border-primary scale-125 shadow-sm" : "border-transparent"
                                      )}
                                      style={{ backgroundColor: c.value }}
                                      onClick={() => setNewColor(c.value)}
                                      title={c.label}
                                  />
                              ))}
                          </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            className="w-full rounded-none bg-accent hover:bg-accent/90 text-[10px] font-black uppercase h-11 text-primary shadow-xl transition-all border-none"
                            onClick={handleCreateNote}
                        >
                            Guardar Nota en Tablero
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal para Detalle y Validación */}
            <StickerDetailDialog 
                event={selectedEvent} 
                open={isDetailOpen} 
                onOpenChange={setIsDetailOpen} 
                onUpdate={loadEvents} 
            />
        </div>
    );
}
