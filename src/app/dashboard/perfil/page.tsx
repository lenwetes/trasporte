import { auth } from "@/auth";
import Link from "next/link";
import { getUsuarioById, getReglasAlertas } from "@/actions";
import { redirect } from "next/navigation";
import { PerfilHistorialClient } from "@/components/perfil-historial-client";
import { LicenseManager } from "@/components/forms/license-manager";
import { ArrowLeft, ShieldPlus, Info, Settings2 } from "lucide-react";

import { UsuarioWithRelations } from "@/types";
import {
    ReglaAlerta,
    OrdenServicio,
    Vehiculo,
    PlanMantenimiento,
    RepositorioArchivo,
} from "@prisma/client";
import { PerfilHeader } from "./_components/perfil-header";
import { PerfilSidebar } from "./_components/perfil-sidebar";
import { ConductorOrdenesPendientes } from "./_components/conductor-ordenes-pendientes";
import { getOrdenesPendientesConductor } from "@/actions/mantenimiento";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

// Tipado extendido para incluir relaciones
type OrdenExtendida = OrdenServicio & {
    vehiculo: Pick<Vehiculo, "placa" | "marca" | "modelo">;
    plan: Pick<PlanMantenimiento, "nombre">;
    comprobante?: Pick<RepositorioArchivo, "id" | "rutaAbsoluta"> | null;
};

export default async function PerfilPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const [userResult, rulesResult, pendingOrders] = await Promise.all([
        getUsuarioById(session.user.id),
        getReglasAlertas(),
        getOrdenesPendientesConductor(),
    ]);

    const usuario = userResult.success
        ? (userResult.data as UsuarioWithRelations)
        : null;
    const alertRules = (
        rulesResult.success && rulesResult.data ? rulesResult.data : []
    ) as ReglaAlerta[];

    if (!usuario) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] border border-red-500/10 bg-red-50/30 p-8 text-center space-y-6">
                <h2 className="text-lg font-black text-red-700 uppercase tracking-[0.2em]">Error de Vinculación</h2>
                <p className="text-[10px] font-bold text-red-600/70 uppercase max-w-md leading-relaxed">
                    NO SE PUDO CARGAR LA INFORMACIÓN DEL PERFIL MAESTRO.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6" style={{ maxWidth: "1600px", margin: "0 auto", padding: "20px" }}>
            <DashboardHeader
                title="Centro de Operaciones"
                tagline="Perfil de Usuario"
                subtitle="Gestión y parametrización de credenciales operativas, accesos y métricas de rendimiento"
                icon={Settings2}
                iconGradient="from-slate-700 to-primary"
            />

            <PerfilHeader usuario={usuario} />

            <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-8">
                <PerfilSidebar usuario={usuario} session={session} />

                <div className="flex flex-col gap-8">
                    {/* Sección de Órdenes Pendientes */}
                    {(() => {
                        const isSuccess = pendingOrders.success;
                        const pData = pendingOrders.data;
                        const ordersArray =
                            isSuccess &&
                            pData &&
                            typeof pData === "object" &&
                            "data" in pData
                                ? (pData.data as any[])
                                : Array.isArray(pData)
                                  ? pData
                                  : [];

                        return ordersArray.length > 0 ? (
                            <ConductorOrdenesPendientes
                                ordenes={ordersArray as OrdenExtendida[]}
                            />
                        ) : null;
                    })()}

                    <div className="bg-white border border-primary/10 flex flex-col p-8">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-primary/5">
                            <div className="h-12 w-12 bg-slate-50 border border-primary/5 flex items-center justify-center text-slate-900 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                <ShieldPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                                    Licencias Operativas
                                </h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">
                                    Gestión de Categorías y Vencimientos
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <LicenseManager
                                usuarioId={usuario.id}
                                licenciasActivas={usuario.licencias || []}
                            />
                        </div>
                    </div>

                    <PerfilHistorialClient
                        usuario={usuario}
                        alertRules={alertRules}
                    />

                    <div className="bg-white border border-primary/10 flex flex-col p-8">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-primary/5">
                            <div className="h-12 w-12 bg-slate-50 border border-primary/5 flex items-center justify-center text-slate-900">
                                <Info className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                                    Información Técnica
                                </h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">
                                    Atributos y Categorías del Sujeto
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoField
                                label="Clase de Credencial"
                                value={usuario.tipoDocumento}
                            />
                            <InfoField
                                label="Hash de Identidad"
                                value={usuario.numeroDocumento || "N/A"}
                            />
                            <InfoField
                                label="Folio C-DIR"
                                value={usuario.numeroLicencia || "N/A"}
                            />
                            
                            <div className="md:col-span-2 lg:col-span-3 pt-4">
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                    Autorizaciones Activas
                                    <div className="flex-1 h-px bg-primary/10"></div>
                                </h4>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {usuario.licencias &&
                                    usuario.licencias.length > 0 ? (
                                        usuario.licencias.map((lic: { categoria: string; servicio: string; fechaVencimiento: Date | string; [key: string]: unknown }, idx: number) => (
                                            <div
                                                key={idx}
                                                className="border border-primary/10 bg-slate-50 flex items-center justify-between p-4 group hover:border-primary/30 transition-all"
                                            >
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xl font-black text-primary font-mono tracking-tighter">
                                                        {lic.categoria}
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase text-accent tracking-widest">
                                                        {lic.servicio}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">EXPIRACIÓN</p>
                                                    <p className="text-xs font-bold text-red-600 mt-1">
                                                        {new Date(
                                                            lic.fechaVencimiento,
                                                        ).toLocaleDateString(
                                                            "es-CO"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-1 sm:col-span-2 lg:col-span-3 py-10 flex flex-col justify-center items-center border border-dashed border-primary/10 bg-white">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                No se registran categorías de licencia en los subsistemas
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1.5 p-4 border border-primary/5 bg-slate-50/50">
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                {label}
            </p>
            <p className="text-xs font-bold text-primary uppercase tracking-tight truncate">
                {value}
            </p>
        </div>
    );
}
