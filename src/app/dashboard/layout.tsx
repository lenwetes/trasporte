import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AlertsService } from "@/services/alerts.service";
import { getMisNotificaciones } from "@/actions/notifications";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/login");
    }

    // Fetch alerts and notifications for the header in parallel
    const [alertsResult, notificationsResult] = await Promise.all([
        AlertsService.getResumen(20),
        getMisNotificaciones()
    ]);

    // Map AlertsService result to the format DashboardShell/Header expects
    const alerts: import("@/lib/alerts").AlertNotification[] = (alertsResult.alertas || []).map(a => ({
        documentId: a.id,
        tipo: a.tipo,
        fechaVencimiento: a.fechaVencimiento,
        daysUntilExpiry: a.diasRestantes,
        status: (a.estado === "VENCIDO" ? "red" : "yellow") as import("@/lib/alerts").AlertLevel,
        vehiculoPlaca: a.placa,
        vehiculoId: a.vehiculoId
    }));

    return (
        <DashboardShell 
            user={session.user} 
            alerts={alerts}
            notifications={(notificationsResult.success ? (notificationsResult.data as import("@prisma/client").Notificacion[]) : [])}
        >
            {children}
        </DashboardShell>
    );
}
