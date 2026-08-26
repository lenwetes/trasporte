import {
    Truck,
    AlertTriangle,
    Users,
    Clock,
    LucideIcon,
    BarChart3,
} from "lucide-react";

export interface ReportFilterState {
    fechaInicio: string;
    fechaFin: string;
    conductorId: string;
    vehiculoId: string;
}

export interface ReportingSessionData {
    role: string;
    userId: string;
    name: string | null | undefined;
}

export interface ReportType {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    adminOnly: boolean;
}

export const REPORT_TYPES: ReportType[] = [
    {
        id: "fleet",
        title: "Estado de Flota",
        description: "Reporte detallado de vehículos y sus convenios.",
        icon: Truck,
        color: "bg-blue-600",
        adminOnly: false,
    },
    {
        id: "expiry",
        title: "Vencimientos Próximos",
        description: "Documentos vencidos o próximos a vencer.",
        icon: AlertTriangle,
        color: "bg-amber-600",
        adminOnly: false,
    },
    {
        id: "conductors",
        title: "Directorio de Conductores",
        description: "Reporte de personal operativo y asignaciones.",
        icon: Users,
        color: "bg-emerald-600",
        adminOnly: true,
    },
    {
        id: "novedades",
        title: "Historial de Novedades",
        description: "Informe consolidado de multas y novedades mecánicas.",
        icon: Clock,
        color: "bg-slate-900",
        adminOnly: false,
    },
    {
        id: "siniestros",
        title: "Registro de Siniestros",
        description: "Historial profesional de accidentes e incidentes.",
        icon: AlertTriangle,
        color: "bg-red-600",
        adminOnly: false,
    },
    {
        id: "executive",
        title: "Resumen Ejecutivo Corporativo",
        description:
            "Reporte de alta fidelidad con KPIs estratégicos para gerencia.",
        icon: BarChart3,
        color: "bg-emerald-600",
        adminOnly: true,
    },
];
