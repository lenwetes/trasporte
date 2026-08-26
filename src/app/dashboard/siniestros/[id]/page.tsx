import { getSiniestroById } from "@/actions";
import { getConfiguracionGlobal } from "@/actions/configuracion";
import { notFound } from "next/navigation";
import {
    AlertTriangle,
    Calendar,
    MapPin,
    User,
    Truck,
    ArrowLeft,
    CheckCircle2,
    Clock,
    Camera,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { InvestigacionSiniestroForm } from "./_components/investigacion-form";
import { SiniestroReportButton } from "./_components/siniestro-report-button";
import { SiniestroWithRelations } from "@/types";

interface SiniestroDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function SiniestroDetailPage({
    params,
}: SiniestroDetailPageProps) {
    const { id } = await params;
    const result = await getSiniestroById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const siniestro = result.data as SiniestroWithRelations;
    const configResult = await getConfiguracionGlobal();
    const config = configResult.success ? configResult.data : null;
    const hasInvestigacion = !!siniestro.investigacion;

    return (
        <div>
            <Link href="/dashboard/siniestros">
                <Button
                    variant="ghost"
                    
                >
                    <ArrowLeft /> VOLVER A LISTADO
                </Button>
            </Link>

            {/* Header Section */}
            <div>
                <div>
                    <div>
                        <div>
                            <Badge>
                                {siniestro.gravedad?.replace("_", " ") ||
                                    "SOLO DAÑOS"}
                            </Badge>
                            {hasInvestigacion ? (
                                <Badge>
                                    <span>[CHECK]</span>{" "}
                                    INVESTIGADO
                                </Badge>
                            ) : (
                                <Badge>
                                    <span>[CLOCK]</span> PENDIENTE
                                    INVESTIGACIÓN
                                </Badge>
                            )}
                        </div>
                        <h1>
                            Siniestro en {siniestro.lugar}
                        </h1>
                        <div>
                            <div>
                                <span>[CALENDAR]</span>
                                {new Date(siniestro.fecha).toLocaleDateString(
                                    "es-CO",
                                    { dateStyle: "full"  },
                                )}
                            </div>
                            <div>
                                <MapPin />
                                {siniestro.lugar}
                            </div>
                        </div>
                    </div>

                    <div>
                        <SiniestroReportButton
                            siniestro={siniestro}
                            config={config}
                        />
                    </div>
                </div>

                <div>
                    <div>
                        <div>
                            <div>
                                <span>[USER]</span>
                            </div>
                            <div>
                                <p>
                                    Conductor
                                </p>
                                <p>
                                    {siniestro.conductor.nombres}{" "}
                                    {siniestro.conductor.apellidos}
                                </p>
                            </div>
                        </div>
                        <div>
                            <div>
                                <Truck />
                            </div>
                            <div>
                                <p>
                                    Vehículo
                                </p>
                                <p>
                                    PLACA: {siniestro.vehiculo.placa} (
                                    {siniestro.vehiculo.marca})
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p>
                            <span>[ALERTTRIANGLE]</span> Reporte de
                            Hechos
                        </p>
                        <p>
                            &quot;{siniestro.reporteHechos}&quot;
                        </p>
                    </div>
                </div>

                {/* Media Gallery */}
                {siniestro.fotos && siniestro.fotos.length > 0 && (
                    <div>
                        <p>
                            <Camera /> Evidencias
                            Fotográficas
                        </p>
                        <div>
                            {siniestro.fotos.map((foto) => (
                                <div
                                    key={foto.id}>
 <Image
                                        src={`/api/files/${foto.nombreUnico}`}
                                        alt="Evidencia"
                                        fill
                                        
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Investigation Section */}
            {hasInvestigacion ? (
                <div>
                    <div>
                        <div>
                            <span>[CHECK]</span>
                        </div>
                        <div>
                            <h3>
                                Investigación de Accidente
                            </h3>
                            <p>
                                Análisis Técnico PESV Completado
                            </p>
                        </div>
                    </div>

                    <div>
                        <div>
                            <div>
                                <p>
                                    Análisis de Causas (5 Porqués)
                                </p>
                                <div>
                                    {siniestro.investigacion?.analisisCausas}
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>
                                        Días Perdidos
                                    </p>
                                    <p>
                                        {siniestro.investigacion?.diasPerdidos}
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        Costo Estimado
                                    </p>
                                    <p>
                                        $
                                        {siniestro.investigacion?.costoEstimado?.toLocaleString() ||
                                            0}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <p>
                                    Plan de Acción / Medidas
                                </p>
                                <div>
                                    {siniestro.investigacion?.planAccion}
                                </div>
                            </div>
                            <div>
                                <p>
                                    Conclusiones
                                </p>
                                <p>
                                    {siniestro.investigacion?.conclusiones}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div>
                        <span>[ALERTTRIANGLE]</span>
                        <div>
                            <p>
                                Requiere Investigación
                            </p>
                            <p>
                                Este siniestro aún no ha sido investigado.
                                Complete el formulario a continuación para
                                cumplir con el PESV.
                            </p>
                        </div>
                    </div>
                    <InvestigacionSiniestroForm siniestroId={siniestro.id} />
                </div>
            )}
        </div>
    );
}
