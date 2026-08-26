import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PreoperacionalForm } from "./_components/preoperacional-form";
import Link from "next/link";
import { formatPlaca } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ShieldCheck, ArrowLeft, AlertCircle, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PreoperacionalPage() {
    const session = await auth();
    if (!session?.user?.id) return redirect("/login");

    // Buscar vehículo activo para el conductor
    const vinculacion = await prisma.vinculacion.findFirst({
        where: {
            conductorId: session.user.id,
            activo: true,
        },
        include: { vehiculo: true },
    });

    if (!vinculacion || !vinculacion.vehiculo) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white border border-primary/10 shadow-2xl p-8 space-y-6">
                    <div className="h-16 w-16 bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="text-xl font-black uppercase tracking-tighter text-primary">Unidad no Identificada</h1>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            No es posible proceder con la inspección técnica sin una unidad de flota vinculada activamente a su usuario.
                        </p>
                    </div>
                    <Link href="/dashboard" className="block">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-none h-12 gap-2">
                            <ArrowLeft className="h-4 w-4" /> REGRESAR AL PANEL
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const { vehiculo } = vinculacion;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <DashboardHeader
                title="Protocolo de Seguridad Vial"
                tagline="Inspección Preoperacional Técnica"
                subtitle="Cumplimiento Resolución 40595 - Sistema PESV"
                icon={HardHat}
                iconGradient="from-primary to-primary/80"
                actions={
                    <Link href="/dashboard">
                        <Button variant="outline" className="h-10 rounded-none border-primary/20 font-bold gap-2 text-primary hover:bg-primary/5">
                            <ArrowLeft className="h-4 w-4" /> CANCELAR PROTOCOLO
                        </Button>
                    </Link>
                }
            />

            <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
                <div className="bg-white border border-primary/10 shadow-2xl p-8 sm:p-12 overflow-hidden">
                    {/* Decorative Header Accents */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] -translate-y-1/2 translate-x-1/2 rotate-45 pointer-events-none" />
                    
                    <PreoperacionalForm
                        conductorId={session.user.id}
                        vehiculoId={vehiculo.id}
                        vehiculoPlaca={formatPlaca(vehiculo.placa)}
                    />
                </div>
            </div>
        </div>
    );
}
