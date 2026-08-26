"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Car, 
  UserCircle, 
  Settings, 
  FileText, 
  Wallet, 
  Users, 
  Bell, 
  Wrench,
  AlertOctagon,
  CalendarRange
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  userRole?: string;
  onItemClick?: () => void;
}

export function SidebarNav({ userRole, onItemClick }: SidebarNavProps) {
  const pathname = usePathname();

  const menuGroups = [
    {
      label: "OPERACIONES",
      links: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Planillas FUEC", href: "/dashboard/fuec", icon: FileText },
        { title: "Novedades", href: "/dashboard/novedades", icon: AlertOctagon },
        { title: "Historial Notificaciones", href: "/dashboard/notificaciones", icon: Bell },
      ]
    },
    {
      label: "GESTIÓN DE FLOTA",
      links: [
        { title: "Vehículos", href: "/dashboard/vehiculos", icon: Car },
        { title: "Conductores", href: "/dashboard/conductores", icon: UserCircle, roles: ["ADMIN", "SECRETARIA"] },
        { title: "Mantenimiento", href: "/dashboard/mantenimiento", icon: Wrench },
      ]
    },
    {
      label: "ADMINISTRACIÓN",
      links: [
        { title: "Finanzas", href: "/dashboard/finance", icon: Wallet, roles: ["ADMIN", "SECRETARIA"] },
        { title: "Usuarios", href: "/dashboard/usuarios", icon: Users, roles: ["ADMIN"] },
        { title: "Planificador", href: "/dashboard/planificador", icon: CalendarRange, roles: ["ADMIN", "SECRETARIA"] },
      ]
    }
  ];

  return (
    <nav className="flex-1 py-6 px-3 space-y-8 uppercase font-black tracking-widest">
      {menuGroups.map((group, groupIdx) => {
        const filteredLinks = group.links.filter(
          link => !link.roles || (userRole && link.roles.includes(userRole))
        );

        if (filteredLinks.length === 0) return null;

        return (
          <div key={groupIdx} className="space-y-4">
            <h3 className="px-3 text-[10px] font-black tracking-[0.3em] text-white uppercase border-l border-white/10 ml-2">
              {group.label}
            </h3>
            <ul className="space-y-1.5">
              {filteredLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      onClick={onItemClick}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 text-[11px] transition-all group rounded-none relative overflow-hidden",
                        isActive 
                          ? "bg-white/5 text-white border-l-4 border-white shadow-[inset_10px_0_15px_-10px_rgba(255,255,255,0.1)]" 
                          : "text-white hover:text-white hover:bg-white/5 border-l-4 border-transparent"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 shrink-0 transition-all duration-300",
                        isActive ? "text-white scale-110" : "text-white/20 group-hover:text-white group-hover:scale-110"
                      )} />
                      <span className="leading-none">{link.title}</span>
                      
                      {isActive && (
                        <div className="absolute right-0 w-1 h-3 bg-white/20 blur-[2px]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
