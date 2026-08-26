import { getConductores } from "@/actions";
import { ConductoresListadoView } from "./_components/conductores-listado-view";

export const dynamic = "force-dynamic";

export default async function ConductoresPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const searchTerm = params.search || "";
    
    const result = await getConductores({
        page: currentPage,
        pageSize: 12,
        search: searchTerm,
    });

    const dataObj = result.success && result.data ? (result.data as any) : { data: [], pagination: {} };
    const conductores = dataObj.data || (Array.isArray(result.data) ? result.data : []);
    const metadata = dataObj.pagination || { total: 0, page: 1, totalPages: 1 };

    return (
        <div className="max-w-[1440px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
            <ConductoresListadoView 
                conductores={conductores} 
                metadata={metadata}
            />
        </div>
    );
}
