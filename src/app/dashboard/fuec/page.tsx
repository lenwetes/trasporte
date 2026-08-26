import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FuecService } from "@/services/fuec.service";
import { FuecPageClient } from "@/components/modules/fuec/fuec-page-client";
import { PlanillaFUEC, ResolucionFUEC } from "@prisma/client";

interface FuecWithRelations extends PlanillaFUEC {
    resolucion?: ResolucionFUEC | null;
}

export default async function FuecPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const result = await FuecService.list({ pageSize: 50 });
    
    // Saneamiento profundo para evitar problemas de serialización (Decimal, Date, etc.)
    const rawPlanillas = result.success && result.data ? result.data.data : [];
    const planillas: FuecWithRelations[] = JSON.parse(JSON.stringify(rawPlanillas));

    const stats = {
        total:   planillas.length,
        activo:  planillas.filter((p) => p.estado === "ACTIVO").length,
        vencido: planillas.filter((p) => p.estado === "VENCIDO").length,
        anulado: planillas.filter((p) => p.estado === "ANULADO").length,
    };

    return (
        <FuecPageClient
            planillas={planillas}
            isAdmin={session.user.rol === "ADMIN"}
            stats={stats}
        />
    );
}
