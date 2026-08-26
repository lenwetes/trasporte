import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FileText } from "lucide-react";

export function ReportHeader() {
    return (
        <DashboardHeader
            title="Centro de Inteligencia"
            tagline="Reportes Analíticos"
            subtitle="Reportes ejecutivos de alta precisión para tu operación"
            icon={FileText}
            iconGradient="from-slate-800 to-slate-950"
            
        />
    );
}
