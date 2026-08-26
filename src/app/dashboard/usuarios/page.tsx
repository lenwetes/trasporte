import { getUsuarios } from "@/actions";
import { auth } from "@/auth";
import { UsuarioWithRelations } from "@/types";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { UsuariosListadoView } from "./_components/usuarios-listado-view";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UsuariosPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const session = await auth();
    const isAdmin = session?.user?.rol === "ADMIN";
    const isSecretaria = session?.user?.rol === "SECRETARIA";

    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const searchTerm = params.search || "";
    
    const result = await getUsuarios({
        page: currentPage,
        pageSize: 12,
        search: searchTerm,
    });

    const usuarios =
        result.success &&
        result.data &&
        typeof result.data === "object" &&
        "data" in result.data
            ? (result.data.data as unknown as UsuarioWithRelations[])
            : [];
            
    const metadata =
        result.success &&
        result.data &&
        typeof result.data === "object" &&
        "pagination" in result.data
            ? (result.data.pagination as any)
            : { total: 0, page: 1, totalPages: 1 };

    return (
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
            <DashboardHeader
                title="Socio Director"
                tagline="Capital Humano & Privilegios"
                subtitle="Administración estratégica de perfiles administrativos y niveles de seguridad institucional"
                icon={Users}
            />

            <div style={{ marginTop: "30px" }}>
                <UsuariosListadoView 
                    usuarios={usuarios} 
                    metadata={metadata}
                    isAdmin={isAdmin}
                    isSecretaria={isSecretaria}
                />
            </div>
        </div>
    );
}
