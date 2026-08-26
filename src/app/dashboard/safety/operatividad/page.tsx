/**
 * Operatividad Dashboard - Refactored with Tailwind CSS
 */
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
    getOwnersForBlockingAction,
    getVehiclesForBlockingAction,
} from "@/actions/fleet/operability.actions";

import { OwnersTable } from "@/app/dashboard/safety/operatividad/_components/owners-table";
import { VehiclesBlockingTable } from "@/app/dashboard/safety/operatividad/_components/vehicles-blocking-table";
import { ShieldAlert, Info, AlertTriangle, Truck, Users } from "lucide-react";

interface Owner {
    id: string;
    nombres: string;
    apellidos: string;
    email: string | null;
    numeroDocumento: string | null;
    _count: {
        vehiculosPropiedad: number;
    };
}

interface Vehicle {
    id: string;
    placa: string;
    marca: string | null;
    modelo: string | null;
    bloqueadoManualmente: boolean;
    razonBloqueo: string | null;
    estadoOperativo: string;
    propietario: string | null;
}

export default async function OperatividadPage() {
    const session = await auth();
    if (session?.user?.rol !== "ADMIN") {
        redirect("/dashboard");
    }

    const [ownersRes, vehiclesRes] = await Promise.all([
        getOwnersForBlockingAction(),
        getVehiclesForBlockingAction(),
    ]);

    const owners = (ownersRes.success ? ownersRes.data : []) as Owner[];
    const vehicles = (vehiclesRes.success ? vehiclesRes.data : []) as Vehicle[];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <ShieldAlert className="h-7 w-7 text-secondary" />
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Control de Operatividad
                    </h1>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-10">
                    Gestión centralizada de restricciones y bloqueos de seguridad de la flota
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden p-10 space-y-12">
                {/* Vehicles Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="h-8 w-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                            <Truck className="h-4 w-4 text-slate-500" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Unidades de la Flota</h3>
                    </div>
                    <VehiclesBlockingTable initialVehicles={vehicles} />
                </section>

                {/* Owners Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="h-8 w-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                            <Users className="h-4 w-4 text-slate-500" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Gestión por Propietarios</h3>
                    </div>
                    <OwnersTable initialOwners={owners} />
                </section>
            </div>

            {/* Context Insight */}
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 flex gap-6 items-start shadow-sm animate-pulse hover:animate-none transition-all">
                <div className="h-12 w-12 bg-red-100/50 border border-red-200 rounded-xl flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-red-900 uppercase tracking-tight mb-1">Protocolo de Restricción Operativa</h4>
                    <p className="text-xs font-medium text-red-700/80 leading-relaxed max-w-3xl">
                        Los bloqueos manuales inhabilitan inmediatamente el despacho de servicios asociados. 
                        Es imperativo documentar la razón administrativa o de seguridad en el sistema para fines de auditoría 
                        antes de proceder con cualquier cambio de estado.
                    </p>
                </div>
            </div>
        </div>
    );
}

