"use client";

import * as React from "react";
import { User } from "next-auth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Search, ChevronRight, CheckCheck, Info, AlertTriangle, Wrench, CheckCircle2, XCircle, Settings } from "lucide-react";
import { toast } from "sonner";

import { AlertNotification } from "@/lib/alerts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { getMisNotificaciones, markAllNotificationsAsRead, markNotificationAsRead } from "@/actions/notifications";
import { getActiveAlerts } from "@/actions/alerts";

interface HeaderProps {
  user: User;
  initialAlerts?: AlertNotification[];
  initialNotifications?: import("@prisma/client").Notificacion[];
}

export function Header({ user, initialAlerts = [], initialNotifications = [] }: HeaderProps) {
  const pathname = usePathname();
  const [alerts, setAlerts] = React.useState<AlertNotification[]>(initialAlerts);
  const [notifications, setNotifications] = React.useState<import("@prisma/client").Notificacion[]>(initialNotifications);
  const [now, setNow] = React.useState<Date>(new Date());
  const [mounted, setMounted] = React.useState(false);

  // Reloj en tiempo real
  React.useEffect(() => {
    setMounted(true);
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Sync alerts and notifications on navigation/interval
  const refreshData = async () => {
    const [alertsRes, notifRes] = await Promise.all([
        getActiveAlerts(20),
        getMisNotificaciones()
    ]);
    if (alertsRes.success) setAlerts(alertsRes.data as AlertNotification[]);
    if (notifRes.success) setNotifications(notifRes.data as import("@prisma/client").Notificacion[]);
  };

  React.useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // 30s polling
    return () => clearInterval(interval);
  }, [pathname]);
  
  // Transform pathname to breadcrumbs
  const pathParts = pathname.split("/").filter(Boolean);

  // Combine alerts and notifications for the badge and list
  const unreadNotifications = notifications.filter(n => !n.leida);
  const totalCount = alerts.length + unreadNotifications.length;

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await markAllNotificationsAsRead();
    if (res.success) {
      toast.success("Notificaciones limpiadas");
    }
  };

  const handleNotificationClick = async (id: string, leida: boolean) => {
    if (!leida) {
      await markNotificationAsRead(id);
    }
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "SUCCESS": return <CheckCircle2 className="h-3 w-3 text-emerald-600" />;
      case "WARNING": return <AlertTriangle className="h-3 w-3 text-amber-600" />;
      case "ERROR": return <XCircle className="h-3 w-3 text-red-600" />;
      case "MANTENIMIENTO": return <Wrench className="h-3 w-3 text-cyan-600" />;
      default: return <Info className="h-3 w-3 text-slate-600" />;
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-primary/10 flex items-center justify-between px-8 z-40 shrink-0">
      {/* Breadcrumbs / Page Title */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-900 font-medium hidden sm:inline">SGIT</span>
        {pathParts.map((part, idx) => {
          const href = `/${pathParts.slice(0, idx + 1).join("/")}`;
          const isLast = idx === pathParts.length - 1;

          return (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3 w-3 text-primary/20 hidden sm:inline" />
              {isLast ? (
                <span className="font-semibold capitalize truncate max-w-[100px] sm:max-w-none text-primary">
                  {part.replace(/-/g, " ")}
                </span>
              ) : (
                <Link href={href} className="font-semibold capitalize truncate max-w-[100px] sm:max-w-none text-primary/60 hover:text-accent transition-colors">
                  {part.replace(/-/g, " ")}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Search - Sharp Style */}
        <div className="relative hidden xl:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          <Input 
            placeholder="Comando de búsqueda (F)..." 
            className="w-72 pl-9 h-9 bg-primary/5 border-transparent focus:bg-white focus:border-accent transition-all rounded-none text-xs font-bold uppercase tracking-tight"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                toast.info("Iniciando búsqueda global para: " + e.currentTarget.value);
              }
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40">
            <span className="text-[8px] font-black border border-primary/20 px-1 py-0.5">F</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Fecha y Hora en tiempo real */}
          <div className="hidden lg:flex flex-col items-end pr-4 border-r border-primary/10 mr-2">
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter leading-none min-h-[11px]">
              {mounted ? now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : null}
            </span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 leading-none min-h-[8px]">
              {mounted ? now.toLocaleDateString("es-CO", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) : null}
            </span>
          </div>

          {/* Botón de Configuración */}
          <Link href="/dashboard/configuracion">
            <Button variant="ghost" size="icon" className="text-primary/60 hover:text-primary rounded-none transition-colors" title="Configuración">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-primary/60 hover:text-primary rounded-none transition-colors">
                <Bell className="h-5 w-5" />
                {totalCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-accent ring-2 ring-white" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-none border-primary/10 p-0 shadow-2xl animate-in zoom-in-95 duration-200">
              <DropdownMenuLabel className="p-4 bg-slate-50 border-b border-primary/5">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 leading-none">Notificaciones</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-black text-primary leading-none uppercase">Alertas ({totalCount})</span>
                            {unreadNotifications.length > 0 && (
                                <Badge className="bg-primary text-accent text-[8px] font-black rounded-none px-2 h-4 border-none flex items-center">
                                    {unreadNotifications.length} NUEVAS
                                </Badge>
                            )}
                        </div>
                    </div>
                    
                    {unreadNotifications.length > 0 && (
                        <button 
                            onClick={handleMarkAllRead}
                            className="bg-accent/10 hover:bg-accent text-accent hover:text-primary transition-all px-2 py-1.5 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-accent/20"
                        >
                            <CheckCheck className="h-3 w-3" />
                            LIMPIAR
                        </button>
                    )}
                </div>
              </DropdownMenuLabel>

              <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                {/* 1. Alerts (System Calculated) */}
                {alerts.map((alert, idx) => (
                  <DropdownMenuItem key={`alert-${idx}`} className="p-4 rounded-none cursor-pointer hover:bg-slate-50 border-b border-primary/5 last:border-0 flex flex-col items-start gap-1">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-tight">{alert.tipo}</span>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[8px] px-1.5 py-0 h-4 rounded-none border-none font-black",
                        alert.status === "red" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {alert.daysUntilExpiry < 0 ? 'VENCIDO' : `${alert.daysUntilExpiry} DÍAS`}
                      </Badge>
                    </div>
                    <p className="text-[11px] font-bold text-primary/70">{alert.vehiculoPlaca}</p>
                    <p className="text-[9px] text-primary font-mono mt-0.5 uppercase tracking-tighter">
                      Sistema Central de Seguridad
                    </p>
                  </DropdownMenuItem>
                ))}

                {/* 2. Notifications (Database Audit Trail) */}
                {notifications.map((n, idx) => {
                  const content = (
                    <DropdownMenuItem 
                      key={`notif-${idx}`} 
                      className={cn(
                        "p-4 rounded-none cursor-pointer hover:bg-slate-50 border-b border-primary/5 flex flex-col items-start gap-1 transition-colors",
                        !n.leida ? "bg-accent/[0.03] border-l-2 border-l-accent" : "border-l-2 border-l-transparent"
                      )}
                      onClick={() => handleNotificationClick(n.id, n.leida)}
                    >
                       <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            {getIcon(n.tipo)}
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-tight",
                              n.tipo === 'ERROR' ? "text-red-500" : 
                              n.tipo === 'WARNING' ? "text-amber-500" : 
                              n.tipo === 'SUCCESS' ? "text-emerald-500" : "text-blue-500"
                            )}>
                              {n.titulo}
                            </span>
                          </div>
                          {!n.leida && (
                             <div className="h-1.5 w-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                          )}
                       </div>
                       <p className="text-[10px] text-primary/50 font-medium line-clamp-2 leading-relaxed mt-0.5">
                          {n.mensaje}
                       </p>
                    </DropdownMenuItem>
                  );

                  return n.vinculo ? (
                    <Link key={`notif-link-${idx}`} href={n.vinculo}>
                        {content}
                    </Link>
                  ) : content;
                })}

                {totalCount === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Sin notificaciones nuevas</p>
                  </div>
                )}
              </div>
              
              <DropdownMenuSeparator className="m-0" />
              <Link href="/dashboard/notificaciones">
                <DropdownMenuItem className="p-3 justify-center text-[10px] font-black text-accent uppercase hover:bg-slate-50 cursor-pointer rounded-none border-t border-primary/5">
                  Ver todo el historial
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 pl-4 border-l border-primary/10">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-primary uppercase leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-900 font-mono mt-1 leading-none">{user.rol}</p>
            </div>
            <div className="h-8 w-8 bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
