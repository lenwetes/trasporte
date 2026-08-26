import { UserWizard } from "@/components/wizard/user-wizard";
import Link from "next/link";
import { auth } from "@/auth";
import { ArrowLeft, UserPlus, ShieldAlert } from "lucide-react";

export default async function NuevoUsuarioPage() {
    const session = await auth();

    if (session?.user?.rol !== "ADMIN" && session?.user?.rol !== "SECRETARIA") {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
                <div className="bg-white border border-red-200 rounded-none p-10 max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-lg font-black text-primary uppercase tracking-widest">Acceso Restringido</h2>
                    <p className="text-sm font-medium text-slate-900 uppercase tracking-wider">
                        Nivel de autorizacion insuficiente para esta operacion.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-block mt-4 px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                    >
                        Volver al Panel
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-5">
                    <Link href="/dashboard/usuarios">
                        <button className="w-10 h-10 border border-slate-200 bg-white flex items-center justify-center text-slate-900 hover:text-primary hover:border-primary transition-colors rounded-none">
                            <ArrowLeft size={18} />
                        </button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/5 text-primary flex items-center justify-center rounded-none">
                            <UserPlus size={18} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-primary uppercase tracking-widest leading-none">
                                Alta de Nuevo Personnel
                            </h1>
                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mt-1">
                                Protocolo de habilitación de expediente digital
                            </p>
                        </div>
                    </div>
                </div>

                {/* Wizard */}
                <UserWizard userRole={session?.user?.rol} />
            </div>
        </div>
    );
}
