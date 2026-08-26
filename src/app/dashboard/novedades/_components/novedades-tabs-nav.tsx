import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, AlertTriangle, ShieldAlert } from "lucide-react";

interface NovedadesTabsNavProps {
    activeTab: string;
}

export function NovedadesTabsNav({ activeTab }: NovedadesTabsNavProps) {
    return (
        <div className="flex items-center gap-1">
            <Link href="/dashboard/novedades?tab=novedades" className="flex-1 sm:flex-none">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full h-12 rounded-none gap-3 font-black uppercase tracking-widest text-[10px] transition-all",
                        activeTab === "novedades" 
                            ? "bg-white text-primary border-b-2 border-primary shadow-sm" 
                            : "text-muted-foreground hover:bg-white hover:text-primary"
                    )}
                >
                    <Bell className={cn("h-4 w-4", activeTab === "novedades" ? "text-primary" : "text-primary/20")} />
                    <span>Novedades Operativas</span>
                </Button>
            </Link>
            <Link href="/dashboard/novedades?tab=siniestros" className="flex-1 sm:flex-none">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full h-12 rounded-none gap-3 font-black uppercase tracking-widest text-[10px] transition-all",
                        activeTab === "siniestros" 
                            ? "bg-white text-destructive border-b-2 border-destructive shadow-sm" 
                            : "text-muted-foreground hover:bg-white hover:text-destructive"
                    )}
                >
                    <ShieldAlert className={cn("h-4 w-4", activeTab === "siniestros" ? "text-destructive" : "text-destructive/20")} />
                    <span>Siniestros & Emergencias</span>
                </Button>
            </Link>
        </div>
    );
}
