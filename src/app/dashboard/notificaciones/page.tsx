import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NotificationsHistoryView } from "./_components/notifications-history-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Historial de Notificaciones | SGIT COOPETRAES",
  description: "Registro auditable y trazable de todas las alertas y notificaciones del sistema",
};

export default async function NotificacionesHistoricoPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="p-8">
        <NotificationsHistoryView />
    </div>
  );
}
