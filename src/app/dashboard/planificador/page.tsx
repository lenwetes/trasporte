import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PlannerView } from "./_components/planner-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planificador Estratégico | SGIT COOPETRAES",
  description: "Centro de planificación operativa estilo Kanban y Calendario Integral",
};

export default async function PlanificadorPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // El role check se maneja a nivel de sidebar, pero aquí aseguramos acceso Admin/Secretaria
  if (session.user.rol === "CONDUCTOR" || session.user.rol === "PROPIETARIO") {
    redirect("/dashboard");
  }

  return (
    <div className="p-8">
        <PlannerView />
    </div>
  );
}
