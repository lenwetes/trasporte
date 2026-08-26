import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FuecForm } from "@/components/modules/fuec/fuec-form";
import { FuecVehiculo, FuecConductor, FuecContrato } from "@/components/modules/fuec/fuec-form/types";
import Link from "next/link";
import { ChevronLeft, FilePlus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";

export default async function NuevaPlanillaPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const isAdmin = session.user.rol === "ADMIN";

    // Carga de datos para el formulario
    const [vehiculos, conductores, contratos, config] = await Promise.all([
        prisma.vehiculo.findMany({
            where: { activo: true },
            select: { id: true, placa: true, marca: true, modelo: true },
            orderBy: { placa: "asc" },
        }),
        prisma.usuario.findMany({
            where: { rol: "CONDUCTOR", activo: true },
            select: { id: true, nombres: true, apellidos: true, numeroDocumento: true },
            orderBy: { nombres: "asc" },
        }),
        prisma.contratoEmpresa.findMany({
            where: { activo: true },
            select: {
                id: true,
                numeroContrato: true,
                cliente: true,
                nitCliente: true,
                objeto: true,
                responsableNombre: true,
                responsableCedula: true,
                fechaInicio: true,
            },
            orderBy: { cliente: "asc" },
        }),
        prisma.configuracionGlobal.findFirst(),
    ]);

    const costoBaseFuec = Number(config?.costoBaseFuec ?? 30000);

    // Saneamiento de datos
    const fuecVehiculos: FuecVehiculo[] = JSON.parse(JSON.stringify(vehiculos.map((v) => ({
        id: v.id,
        placa: v.placa,
        marca: v.marca ?? "",
        modelo: v.modelo ?? "",
    }))));

    const fuecConductores: FuecConductor[] = JSON.parse(JSON.stringify(conductores.map((c) => ({
        id: c.id,
        nombre: `${c.nombres} ${c.apellidos}`,
        documento: c.numeroDocumento ?? "",
    }))));

    const fuecContratos: FuecContrato[] = JSON.parse(JSON.stringify(contratos.map((c) => ({
        id: c.id,
        numeroContrato: c.numeroContrato,
        cliente: c.cliente,
        nitCliente: c.nitCliente,
        objeto: c.objeto,
        responsableNombre: c.responsableNombre,
        responsableCedula: c.responsableCedula,
        fechaInicio: c.fechaInicio,
    }))));

    return (
        <div className="space-y-6 animate-in fade-in duration-700 p-6 bg-slate-50/30 min-h-screen">
            {/* Header Técnico Estandarizado (Blanco Sólido como el Listado) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-primary/10 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center border border-primary/10 bg-slate-50 text-primary">
                        <FilePlus className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-primary flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-accent" />
                            Nueva Planilla FUEC
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mt-1">
                            Emisión Jurídica y Técnica de Extractos
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <Link href="/dashboard/fuec">
                        <Button variant="outline" className="h-10 rounded-none border-primary/10 text-[10px] font-black uppercase tracking-widest px-6 hover:bg-slate-50 transition-colors">
                            <ChevronLeft className="h-4 w-4 mr-2 text-slate-900" />
                            Volver al Listado
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Formulario Section */}
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
                <FuecForm
                    vehiculos={fuecVehiculos}
                    conductores={fuecConductores}
                    contratos={fuecContratos}
                    isAdmin={isAdmin}
                    costoBaseFuec={costoBaseFuec}
                />
            </div>
        </div>
    );
}
