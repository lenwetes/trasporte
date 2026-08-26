import { getUsuarioById } from "@/actions";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ConductorExpedienteClient } from "./_components/conductor-expediente-client";
import { UsuarioWithRelations } from "@/types";

interface ConductorDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ConductorDetailPage({
    params,
}: ConductorDetailPageProps) {
    const session = await auth();
    const { id } = await params;

    const result = await getUsuarioById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const conductor = result.data as UsuarioWithRelations;

    const isAdmin =
        session?.user?.rol === "ADMIN" || session?.user?.rol === "SECRETARIA";

    return (
        <div className="">
            <ConductorExpedienteClient
                conductor={conductor}
                isAdmin={isAdmin}
            />
        </div>
    );
}
