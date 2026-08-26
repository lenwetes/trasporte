"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    Truck,
    Users,
    FileText,
    Calendar as CalendarIcon,
    TrendingUp,
    ShieldCheck,
    Plus,
// [REMOVED IMPORT]
} from "lucide-react";
interface QuickActionItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    color:
        | "emerald"
        | "indigo"
        | "amber"
        | "rose"
        | "blue"
        | "slate"
        | "violet";
}

function QuickActionItem({ href, icon, label, color }: QuickActionItemProps) {
    const colorVariants = {
        emerald:
            "bg-[#F0FDF4] border-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7]",
        indigo: "bg-[#F5F3FF] border-[#EDE9FE] text-[#5B21B6] hover:bg-[#EDE9FE]",
        amber: "bg-[#FFFBEB] border-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7]",
        rose: "bg-[#FFF1F2] border-[#FFE4E6] text-[#9F1239] hover:bg-[#FFE4E6]",
        blue: "bg-[#EFF6FF] border-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE]",
        slate: "bg-[#F8FAFC] border-[#F1F5F9] text-[#334155] hover:bg-[#F1F5F9]",
        violet: "bg-[#F5F3FF] border-[#EDE9FE] text-[#5B21B6] hover:bg-[#EDE9FE]",
    };

    return (
        <Link href={href}> <div>
                <div>
                    <div>{icon}</div>
                </div>
                <span>
                    {label}
                </span>
            </div>
        </Link>
    );
}

export function QuickActionsMenu() {
    return (
        <div>
            <QuickActionItem
                href="/dashboard/vehiculos/nuevo"
                icon={<span>[PLUS]</span>}
                label="Registrar Unidad"
                color="emerald"
            />
            <QuickActionItem
                href="/dashboard/usuarios/crear-wizard"
                icon={<span>[USER]</span>}
                label="Nuevo Usuario"
                color="indigo"
            />
            <QuickActionItem
                href="/dashboard/fuec"
                icon={<span>[FILETEXT]</span>}
                label="Generar FUEC"
                color="amber"
            />
            <QuickActionItem
                href="/dashboard/safety/calendario"
                icon={<span>[ICON]</span>}
                label="Seguridad PESV"
                color="rose"
            />
            <QuickActionItem
                href="/dashboard/finance"
                icon={<TrendingUp />}
                label="Caja y Finanzas"
                color="blue"
            />
            <QuickActionItem
                href="/dashboard/vehiculos?tab=operatividad"
                icon={<ShieldCheck />}
                label="Bloqueos Admin"
                color="slate"
            />
        </div>
    );
}
