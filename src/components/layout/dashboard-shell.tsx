"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar/sidebar";
import { Header } from "./header/header";
import { User } from "next-auth";
import { AlertNotification } from "@/lib/alerts";

interface DashboardShellProps {
  children: ReactNode;
  user: User;
  alerts: AlertNotification[];
  notifications?: import("@prisma/client").Notificacion[];
}

export function DashboardShell({
  children,
  user,
  alerts,
  notifications = [],
}: DashboardShellProps) {
  return (
    <div className="h-screen overflow-hidden bg-[#F4F4F4] text-primary">
      {/* Sidebar - Solid Deep Teal Background */}
      <Sidebar userRole={user.rol} />
      
      {/* Contenedor derecho: altura fija para que main pueda scrollear */}
      <div className="flex flex-col h-screen lg:pl-64">
        {/* Header fijo (fixed pos, alto 64px = h-16) */}
        <Header user={user} initialAlerts={alerts} initialNotifications={notifications} />
        
        {/* Área de contenido con scroll independiente - pt-16 compensa el header fijo */}
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
