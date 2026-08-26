"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
    Bell, 
    CheckCheck, 
    Clock, 
    Filter, 
    Search, 
    Trash2, 
    History,
    AlertCircle,
    Info,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { 
    getMisNotificacionesHistorial, 
    markAllNotificationsAsRead,
    markNotificationAsRead 
} from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    titulo: string;
    mensaje: string;
    tipo: string;
    leida: boolean;
    creadoEn: Date;
    vinculo?: string;
}

export function NotificationsHistoryView() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

    const loadNotifications = async () => {
        setLoading(true);
        const res = await getMisNotificacionesHistorial({ limit: 100 });
        if (res.success) {
            setNotifications(res.data as Notification[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkAllRead = async () => {
        const res = await markAllNotificationsAsRead();
        if (res.success) {
            toast.success("Todas las notificaciones marcadas como leídas");
            loadNotifications();
        }
    };

    const handleMarkRead = async (id: string) => {
        const res = await markNotificationAsRead(id);
        if (res.success) {
            loadNotifications();
        }
    };

    const getIcon = (tipo: string) => {
        switch (tipo) {
            case "SUCCESS": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case "WARNING": return <AlertCircle className="h-5 w-5 text-amber-500" />;
            case "ERROR": return <XCircle className="h-5 w-5 text-red-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const filtered = notifications.filter(n => {
        const matchesSearch = n.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             n.mensaje.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" ? true : 
                             filter === "unread" ? !n.leida : n.leida;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Intel Header */}
            <div className="bg-white border border-primary/10 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-primary flex items-center justify-center shadow-2xl">
                            <History className="h-8 w-8 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight text-primary">
                                Historial Auditable
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-1">
                                Trazabilidad Completa de Notificaciones y Alertas
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            className="rounded-none border-primary/10 text-[10px] font-black uppercase tracking-widest h-12 px-6 hover:bg-slate-50"
                            onClick={handleMarkAllRead}
                        >
                            <CheckCheck className="h-4 w-4 mr-2 text-emerald-500" />
                            Limpiar Pendientes
                        </Button>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-primary/5">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input 
                            placeholder="FILTRAR POR TÍTULO O CONTENIDO DE LA ALERTA..."
                            className="pl-12 h-12 rounded-none border-primary/10 bg-slate-50 focus:bg-white text-xs font-bold uppercase tracking-tight"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-1 bg-slate-100 p-1">
                        {(["all", "unread", "read"] as const).map((f) => (
                            <Button
                                key={f}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "flex-1 rounded-none text-[9px] font-black uppercase tracking-tighter h-10",
                                    filter === f ? "bg-white shadow-sm text-primary" : "text-slate-900"
                                )}
                                onClick={() => setFilter(f)}
                            >
                                {f === "all" ? "Todas" : f === "unread" ? "Pendientes" : "Leídas"}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center justify-end px-4 border-l border-primary/5">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                            {filtered.length} Registros Encontrados
                        </span>
                    </div>
                </div>
            </div>

            {/* Notifications Grid/List */}
            <div className="bg-white border border-primary/10 shadow-2xl overflow-hidden">
                <div className="divide-y divide-primary/5">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="p-8 animate-pulse flex gap-6">
                                <div className="h-12 w-12 bg-slate-100 rounded-none" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-slate-100 w-1/4" />
                                    <div className="h-3 bg-slate-100 w-3/4" />
                                </div>
                            </div>
                        ))
                    ) : filtered.length > 0 ? (
                        filtered.map((n) => (
                            <div 
                                key={n.id} 
                                className={cn(
                                    "p-6 flex flex-col md:flex-row gap-6 transition-all hover:bg-slate-50 group border-l-4",
                                    !n.leida ? "border-l-accent bg-accent/5" : "border-l-transparent"
                                )}
                            >
                                <div className="flex-shrink-0">
                                    <div className={cn(
                                        "h-12 w-12 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                                        !n.leida ? "bg-primary text-white" : "bg-slate-100 text-primary/20"
                                    )}>
                                        {getIcon(n.tipo)}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-sm font-black uppercase tracking-tight text-primary">
                                                {n.titulo}
                                            </h3>
                                            {!n.leida && (
                                                <Badge className="bg-accent text-primary text-[8px] font-black px-1.5 h-4 rounded-none uppercase">
                                                    Sin Leer
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-primary uppercase">
                                            <Clock className="h-3 w-3" />
                                            {format(new Date(n.creadoEn), "MMM d, yyyy HH:mm", { locale: es })}
                                        </div>
                                    </div>

                                    <p className="text-xs text-primary/60 font-medium leading-relaxed max-w-4xl">
                                        {n.mensaje}
                                    </p>

                                    {n.vinculo && (
                                        <div className="pt-2">
                                            <Button 
                                                variant="link" 
                                                className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-accent hover:text-primary transition-colors"
                                                asChild
                                            >
                                                <a href={n.vinculo}>Ver información relacionada →</a>
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!n.leida && (
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 rounded-none text-emerald-500 hover:bg-emerald-50"
                                            onClick={() => handleMarkRead(n.id)}
                                            title="Marcar como leída"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-24 flex flex-col items-center justify-center space-y-4">
                            <Bell className="h-12 w-12 text-primary/10" />
                            <div className="text-center">
                                <p className="text-sm font-black uppercase text-primary/20 tracking-[0.2em]">
                                    No se encontraron registros
                                </p>
                                <p className="text-[10px] font-bold text-primary/10 uppercase mt-1">
                                    El historial auditable está vacío bajo este filtro
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Paging / Footer Info */}
            <div className="flex justify-between items-center py-4 px-2 border-t border-primary/5">
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                    SGIT SECURITY PROTOCOL - COOPETRAES DATA LAKE
                </div>
                <div className="flex items-center gap-2">
                    <History className="h-3 w-3 text-primary/20" />
                    <span className="text-[9px] font-bold text-primary/20 uppercase">Audit Trail v2.0</span>
                </div>
            </div>
        </div>
    );
}
