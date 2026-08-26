import { DocumentoForm } from "@/components/forms/documento-form";
import { getVehiculoById } from "@/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { VehiculoWithRelations } from "@/types";

interface NuevoDocumentoPageProps {
    params: Promise<{ id: string }>;
}

export default async function NuevoDocumentoPage({
    params,
}: NuevoDocumentoPageProps) {
    const { id } = await params;
    const result = await getVehiculoById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const vehiculo = result.data as VehiculoWithRelations;

    return (
        <div>
            <div>
                <Link href={`/dashboard/vehiculos/${id}`}>
                    <Button variant="ghost" size="icon">
                        <span>[BACK]</span>
                    </Button>
                </Link>
                <div>
                    <div>
                        <div>
                            <span>[FILE]</span>
                        </div>
                        <h1>
                            Nuevo Documento{" "}
                            <span>
                                {vehiculo.placa}
                            </span>
                        </h1>
                    </div>
                    <p>
                        Carga archivos legales y configura fechas de vencimiento
                    </p>
                </div>
            </div>

            <div>
                <div>
                    <div>
                        <span>[CAR]</span>
                    </div>
                    <div>
                        <p> Vehículo Destino </p>
                        <p> {vehiculo.marca} - {vehiculo.placa} </p>
                    </div>
                </div>

                <DocumentoForm vehiculoId={id} />
            </div>
        </div>
    );
}
