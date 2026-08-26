import { UserWizard } from "@/components/wizard/user-wizard";
import { auth } from "@/auth";
import { UserPlus, Activity, ShieldCheck } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function CreateUserWizardPage() {
    const session = await auth();
    const userRole = session?.user?.rol || "CONDUCTOR";

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000 p-6 md:p-10">
            <DashboardHeader 
                title="ALTA DE PERSONAL"
                tagline="TALENTO HUMANO COOPERATIVO"
                subtitle="Registro estructurado de conductores, propietarios y administrativos con validación de seguridad social."
                icon={UserPlus}
                actions={
                    <div className="flex flex-col items-end border border-primary/10 bg-white p-4 shadow-sm">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 mb-1">
                            ESTATUS DEL PROCESO
                        </p>
                        <div className="flex items-center gap-3">
                            <Activity className="h-4 w-4 text-accent animate-pulse" />
                            <p className="text-xl font-black font-mono tracking-tighter text-primary">
                                Iniciación Maestra
                            </p>
                        </div>
                    </div>
                }
            />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Wizard Container - Flat, no rounded corners */}
                <div className="bg-white border border-slate-200 shadow-sm p-4 md:p-8 shrink-0 relative z-10">
                    <UserWizard userRole={userRole} />
                </div>
                
                {/* Footer Insight */}
                <div className="flex items-center justify-center gap-3 text-slate-900 pt-4">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Toda información está cifrada y protegida en el ecosistema.</span>
                </div>
            </div>
        </div>
    );
}
