/**
 * SG-SST Main Page - Refactored with Tailwind CSS
 */
import { getSGSSTSummary } from "@/actions/safety";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SGSSTHeader } from "./_components/sgsst-header";
import { SGSSTSearch } from "./_components/sgsst-search";
import { SGSSTTable } from "./_components/sgsst-table";
import { SGSSTUser } from "./_components/types";
import { ShieldCheck, HeartPulse } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SGSSTPage({
    searchParams,
}: {
    searchParams: Promise<{q?: string }>;
}) {
    const session = await auth();
    if (session?.user?.rol !== "ADMIN" && session?.user?.rol !== "SECRETARIA") {
        redirect("/dashboard");
    }

    const { q } = await searchParams;
    const result = await getSGSSTSummary();

    let usuarios = result.success ? (result.data as SGSSTUser[]) || [] : [];

    if (q) {
        const query = q.toLowerCase();
        usuarios = usuarios.filter(
            (u) =>
                u.nombres.toLowerCase().includes(query) ||
                u.apellidos.toLowerCase().includes(query) ||
                u.numeroDocumento.includes(query),
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen relative p-8 animate-in fade-in duration-700">
            {/* Background Layer for identity */}
            <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-[1400px] mx-auto relative z-10 space-y-8">
                <SGSSTHeader totalUsers={usuarios.length} />

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm shadow-slate-200/50">
                    <div className="flex flex-col xl:flex-row justify-between xl:items-end mb-10 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shadow-sm animate-pulse">
                                    <HeartPulse size={20} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    Directorio de Salud y Dotación (E.M.O)
                                </h2>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] pl-[3.5rem]">
                                Seguimiento riguroso de requisitos legales y operativos para conductores.
                            </p>
                        </div>
                        <div className="w-full xl:w-[400px]">
                            <SGSSTSearch defaultValue={q} />
                        </div>
                    </div>

                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <SGSSTTable users={usuarios} />
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
                    <div className="flex items-center gap-3 text-emerald-600">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Cumplimiento Normativo SG-SST (ISO 45001)
                        </span>
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">
                        Smart Fleet Security System • COOPETRAES
                    </span>
                </div>
            </div>
        </div>
    );
}

