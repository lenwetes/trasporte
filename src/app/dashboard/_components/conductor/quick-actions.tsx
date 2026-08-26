import Link from "next/link";
import { Camera, AlertTriangle, FileText, ShieldCheck } from "lucide-react";

export function QuickActions() {
    return (
        <div>
            <QuickAction
                href="/dashboard/siniestros/nuevo"
                icon={Camera}
                label="Reportar Siniestro"
                color="bg-red-500"
            />
            <QuickAction
                href="/dashboard/novedades"
                icon={AlertTriangle}
                label="Novedades y Multas"
                color="bg-amber-500"
            />
            <QuickAction
                href="/dashboard/fuec"
                icon={FileText}
                label="Planilla FUEC"
                color="bg-blue-500"
            />
            <QuickAction
                href="/dashboard/preoperacional"
                icon={ShieldCheck}
                label="Preoperacional"
                color="bg-emerald-600"
            />
        </div>
    );
}

function QuickAction({
    href,
    icon: Icon,
    label,
    color,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    color: string;
}) {
    // Extraer el color base de la clase color (ej: red-500)
    const baseColor = color.replace("bg-", "");

    return (
        <Link href={href}> <div>
                <div />

                <div>
                    <Icon />
                </div>
                <div>
                    <span>
                        {label}
                    </span>
                    <div />
                </div>
            </div>
        </Link>
    );
}

import { cn } from "@/lib/utils";
