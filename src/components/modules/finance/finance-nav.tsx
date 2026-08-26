"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wallet, Receipt, FileText, BookOpenText, CircleDollarSign, Settings, CreditCard } from "lucide-react";

export function FinanceNav() {
    const pathname = usePathname();

    const navItems = [
        {
            href: "/dashboard/finance",
            label: "Caja Menor",
            icon: Wallet,
        },
        {
            href: "/dashboard/finance/loans",
            label: "Préstamos",
            icon: CircleDollarSign,
        },
        {
            href: "/dashboard/finance/receivables",
            label: "Cuentas X Cobrar",
            icon: CreditCard,
        },
        {
            href: "/dashboard/finance/egresos",
            label: "Egresos",
            icon: Receipt,
        },
        {
            href: "/dashboard/finance/concepts",
            label: "Conceptos",
            icon: BookOpenText,
        },
        {
            href: "/dashboard/finance/reports",
            label: "Reportes",
            icon: FileText,
        },
        {
            href: "/dashboard/finance/settings",
            label: "Configuración",
            icon: Settings,
        },
    ];

    return (
        <nav className="flex items-center gap-0 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-8 h-16 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group",
                            isActive 
                                ? "text-primary bg-primary/[0.02]" 
                                : "text-slate-900 hover:text-primary hover:bg-slate-50"
                        )}
                    >
                        <Icon size={16} className={cn("transition-colors", isActive ? "text-accent" : "text-primary/20 group-hover:text-slate-900")} />
                        <span className="whitespace-nowrap">{item.label}</span>
                        
                        {/* Indicador Activo Sharp */}
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent animate-in fade-in slide-in-from-bottom-1 duration-300" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
