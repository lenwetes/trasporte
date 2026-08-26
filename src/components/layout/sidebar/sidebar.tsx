import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth-client";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "./sidebar-nav";

interface SidebarProps {
  userRole?: string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-primary text-white flex-col border-r border-white/10 z-50 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-8 border-b border-white/10 shrink-0">
        <span className="text-xl font-black italic tracking-tighter text-white">COOPETRAES</span>
        <span className="ml-3 text-[9px] font-black bg-white/10 px-1.5 py-0.5 tracking-widest uppercase">PRO</span>
      </div>

      {/* Navigation (extracted for responsiveness) */}
      <div className="flex-1 overflow-y-auto scrollbar-hide py-4">
        <SidebarNav userRole={userRole} />
      </div>

      {/* User Footer */}
      <div className="p-6 border-t border-white/10 bg-black/5">
        <Button
          variant="ghost"
          onClick={() => logoutAction()}
          className="w-full justify-start text-[11px] font-black uppercase tracking-widest text-white hover:text-white hover:bg-red-400/20 rounded-none h-11 gap-4 group transition-all"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </aside>
  );
}
