import { auth } from "@/auth";
import {
    getUsuarioById,
    getExamenesConductor,
    getEntregasConductor,
    getConfiguracionGlobal,
} from "@/actions";
import { redirect, notFound } from "next/navigation";
import {
    ArrowLeft,
    ShieldAlert,
    HeartPulse,
    HardHat,
    FileDigit,
    CalendarCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    SafetySectionClient,
    ExamenMedicoDisplay,
    EntregaDotacionDisplay,
} from "@/app/dashboard/usuarios/[id]/_components/safety-section-client";
import { UsuarioWithRelations } from "@/types";
import { ConfiguracionGlobal } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SGSSTUserDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function SGSSTUserDetailPage({
    params,
}: SGSSTUserDetailPageProps) {
    const session = await auth();
    if (session?.user?.rol !== "ADMIN" && session?.user?.rol !== "SECRETARIA") {
        redirect("/dashboard");
    }

    const { id } = await params;

    const [userRes, examenesRes, entregasRes, configRes] = await Promise.all([
        getUsuarioById(id),
        getExamenesConductor(id),
        getEntregasConductor(id),
        getConfiguracionGlobal(),
    ]);

    if (!userRes.success || !userRes.data) {
        notFound();
    }

    const usuario = userRes.data as UsuarioWithRelations;
    const examenes = examenesRes.success
        ? (examenesRes.data as ExamenMedicoDisplay[])
        : [];
    const entregas = entregasRes.success
        ? (entregasRes.data as EntregaDotacionDisplay[])
        : [];
    const companyConfig = configRes.success
        ? (configRes.data as ConfiguracionGlobal)
        : null;

    const ingresoExam = examenes.find((e) => e.tipo === "INGRESO");

    return (
        <div>
            {/* Header Navigation */}
            <div>
                <div>
                    <Link href="/dashboard/safety/sg-sst">
                        <Button
                            variant="outline"
                            size="icon"
                            
                        >
                            <ArrowLeft />
                        </Button>
                    </Link>
                    <div>
                        <div>
                            <FileDigit />
                            <h1>
                                Digitalización SG-SST
                            </h1>
                        </div>
                        <p>
                            Carga de documentos físicos y expediente digital
                        </p>
                    </div>
                </div>

                <div>
                    <div>
                        {usuario.nombres[0]}
                        {usuario.apellidos[0]}
                    </div>
                    <div>
                        <p>
                            {usuario.nombres} {usuario.apellidos}
                        </p>
                        <p>
                            {usuario.rol}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Summary Cards focused on Compliance */}
            <div>
                {/* INGRESO EXAM HIGHLIGHT */}
                <div>
                    <div>
                        <span>[CALENDAR]</span>
                    </div>
                    <p>
                        <span></span>
                        Examen de Ingreso
                    </p>
                    {ingresoExam ? (
                        <div>
                            <p>
                                Registrado
                            </p>
                            <p>
                                {format(
                                    new Date(ingresoExam.fechaRealizacion),
                                    "PP",
                                    { locale: es },
                                )}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p>
                                Faltante
                            </p>
                            <p>
                                Documento no digitalizado
                            </p>
                        </div>
                    )}
                </div>

                <div>
                    <div>
                        <HeartPulse />
                    </div>
                    <p>
                        Total Historial Médico
                    </p>
                    <p>
                        {examenes.length}
                    </p>
                    <p>
                        Registros cargados
                    </p>
                </div>

                <div>
                    <div>
                        <HardHat />
                    </div>
                    <p>
                        Estado Dotación
                    </p>
                    {entregas.length > 0 ? (
                        <div>
                            <p>
                                Al Día
                            </p>
                            <p>
                                Última:{" "}
                                {format(
                                    new Date(entregas[0].fechaEntrega),
                                    "PP",
                                    { locale: es },
                                )}
                            </p>
                        </div>
                    ) : (
                        <p>
                            Sin Entregas
                        </p>
                    )}
                </div>
            </div>

            {/* Management Section (Redesigned for Digitalization) */}
            <div>
                <div>
                    <h2>
                        <ShieldAlert />
                        Centro de Gestión Documental SG-SST
                    </h2>
                    <p>
                        Utilice los botones &quot;Nuevo Examen&quot; o
                        &quot;Nueva Entrega&quot; para digitalizar los recibos
                        físicos.
                    </p>
                </div>

                <SafetySectionClient
                    conductorId={usuario.id}
                    conductorNombre={`${usuario.nombres} ${usuario.apellidos}`}
                    initialExamenes={examenes}
                    initialEntregas={entregas}
                    isAdmin={true}
                    companyConfig={companyConfig as ConfiguracionGlobal}
                />
            </div>
        </div>
    );
}
