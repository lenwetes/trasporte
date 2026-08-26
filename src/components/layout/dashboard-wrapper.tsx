"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { Menu, X, LogOut, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./sidebar/sidebar-nav";
import Link from "next/link";
import { Settings, Wallet } from "lucide-react";

interface DashboardWrapperProps {
    children: React.ReactNode;
    userRole?: string;
    userName?: string;
}

export function DashboardWrapper({ children, userRole, userName }: DashboardWrapperProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Seguro de Vehículo Vence Pronto", type: "warning" },
        { id: 2, text: "Nueva FUEC Generada Correctamente", type: "success" },
    ]);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const pathname = usePathname();

    React.useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const clearNotifications = () => setNotifications([]);

    return (
        <div id="dashboard-layout" className="flex h-screen bg-slate-50 w-full overflow-hidden relative">
            {/* Desktop Sidebar */}
            <Sidebar userRole={userRole} />

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar (Omitted for brevity, but stays same) */}
            <div className={cn(
                "fixed inset-y-0 left-0 w-80 bg-primary text-white z-[70] lg:hidden transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl overflow-hidden",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                 <div className="h-20 flex items-center justify-between px-8 border-b border-white/10 shrink-0 bg-black/10">
                    <div className="flex flex-col">
                        <span className="text-xl font-black italic tracking-tighter">COOPETRAES</span>
                        <span className="text-[8px] font-black tracking-[0.4em] opacity-30 uppercase">Mobile_UI v2.0</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-white hover:bg-white/10 rounded-none transition-all">
                        <X size={20} className="transition-transform active:scale-90" />
                    </Button>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-2">
                    <SidebarNav userRole={userRole} onItemClick={() => setIsMobileMenuOpen(false)} />
                </div>

                <div className="p-8 border-t border-white/10 bg-black/20 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-none bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-white tracking-widest">{userName || 'User'}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className={cn(
                "flex-1 min-h-0 flex flex-col overflow-hidden",
                "lg:ml-64"
            )}>
                {/* ─── NEW UNIVERSAL TOP NAVBAR ─── */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50 shrink-0">
                    <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                            <Menu size={18} className="rotate-90" /> {/* Representation of Search icon if needed or use Lucide Search */}
                        </div>
                        <input 
                            type="text" 
                            placeholder="Buscar en el sistema (Ctrl + K)..." 
                            className="w-full bg-slate-50 border border-slate-100 h-10 pl-10 pr-4 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all border-l-4 border-l-primary/10 focus:border-l-primary"
                        />
                    </div>

                    <div className="lg:hidden flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                            <Menu size={24} />
                        </Button>
                        <span className="text-xs font-black tracking-tighter uppercase italic">COOPETRAES</span>
                    </div>

                    {/* Utility Section: Notifications & User */}
                    <div className="flex items-center gap-6">
                        {/* Status & Time */}
                        <div className="hidden xl:flex items-center gap-4 border-r border-slate-100 pr-6">
                             <div className="flex items-center gap-2 bg-emerald-50 px-2 py-1 border border-emerald-100" title="Connected to Default Data Engine">
                                 <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                 <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-[1px]">DB Online</span>
                             </div>
                             <div className="flex flex-col text-right">
                                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                                     {currentTime ? currentTime.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '') : '...'}
                                 </span>
                                 <span className="text-[8px] font-bold text-slate-900 uppercase tracking-widest mt-1">
                                     {currentTime ? currentTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : '...'}
                                 </span>
                             </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-4 border-r border-slate-100 pr-6 relative">
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-black text-slate-900 uppercase leading-none">{userName || 'Administrador'}</span>
                                <span className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">Nivel Operativo 01</span>
                            </div>
                            
                            {/* Notificaciones */}
                            <div className="relative group/notif" onMouseLeave={() => setIsNotificationsOpen(false)}>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className="h-10 w-10 bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 transition-all rounded-none relative"
                                >
                                    <Bell size={18} className="text-slate-900" />
                                    {notifications.length > 0 && (
                                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 border border-white" />
                                    )}
                                </Button>

                                {isNotificationsOpen && (
                                    <div className="absolute top-full right-0 w-80 pt-2 z-[100] animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-white border border-slate-200 shadow-2xl overflow-hidden">
                                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Notificaciones</span>
                                                <Button 
                                                    variant="ghost" 
                                                    className="text-[9px] font-bold text-red-600 uppercase hover:bg-red-50 h-6 px-2"
                                                    onClick={clearNotifications}
                                                >
                                                    Limpiar Todo
                                                </Button>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map(n => (
                                                        <Link 
                                                            key={n.id} 
                                                            href={n.id === 1 ? "/dashboard/vehiculos" : "/dashboard/fuec"}
                                                            onClick={() => setIsNotificationsOpen(false)}
                                                            className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-center gap-3 w-full text-left"
                                                        >
                                                            <div className={cn("h-2 w-2 rounded-full shrink-0", n.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500')} />
                                                            <span className="text-[11px] font-medium text-slate-900 uppercase">{n.text}</span>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div className="p-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-900">Sin Alertas Nuevas</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Configuraciones */}
                            <div className="relative group/settings" onMouseLeave={() => setIsSettingsOpen(false)}>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                    className="h-10 w-10 bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 transition-all rounded-none"
                                >
                                    <Settings size={18} className="text-slate-900" />
                                </Button>

                                {isSettingsOpen && (
                                    <div className="absolute top-full right-0 w-64 pt-2 z-[100] animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-white border border-slate-200 shadow-2xl overflow-hidden">
                                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Ajustes del Sistema</span>
                                            </div>
                                            <div className="flex flex-col py-2">
                                                <Link 
                                                    href="/dashboard/configuracion" 
                                                    className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center gap-3"
                                                    onClick={() => setIsSettingsOpen(false)}
                                                >
                                                    <Settings size={14} /> Globales
                                                </Link>
                                                <Link 
                                                    href="/dashboard/finance/settings" 
                                                    className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center gap-3"
                                                    onClick={() => setIsSettingsOpen(false)}
                                                >
                                                    <Wallet size={14} /> Ajustes Financieros
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <Link href="/dashboard/perfil">
                            <div className="h-10 w-10 bg-primary text-white flex items-center justify-center font-black text-xs border-2 border-white shadow-xl hover:scale-110 transition-transform cursor-pointer relative group">
                                {(userName?.[0] || 'A').toUpperCase()}
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </Link>
                        
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                            onClick={() => (window as any).location.href = '/api/auth/signout'}
                        >
                            <LogOut size={18} />
                        </Button>
                    </div>
                </header>

                {/* Dashboard Page Content - THE ONLY SCROLLABLE AREA */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <div className="p-4 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
