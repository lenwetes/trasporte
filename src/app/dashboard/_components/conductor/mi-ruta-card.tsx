"use client";

import {
    MapPin,
    Navigation,
    Calendar,
    FileText,
    CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MiRutaCardProps {
    fuec:
        | {
              consecutivo: string;
              fechaFin: Date | string;
              ruta: { origen: string; destino: string };
              contrato?: { cliente?: string | null } | null;
          }
        | null
        | undefined;
}

export function MiRutaCard({ fuec }: MiRutaCardProps) {
    if (!fuec) {
        return (
            <div>
                <div></div>

                <div>
                    <div>
                        <div>
                            <Navigation />
                        </div>
                        <div>
                            <h3>
                                Estado de Ruta
                            </h3>
                            <p>
                                Sin asignar
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2>
                            Sin FUEC Vigente
                        </h2>
                        <p>
                            No se detectó planilla de viaje activa. Genere una
                            para iniciar su recorrido legalmente.
                        </p>
                    </div>

                    <Link href="/dashboard/fuec/nueva" >
                        <Button>
                            Generar Planilla FUEC
                            <span>[CHECK]</span>
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const ruta = fuec.ruta;

    return (
        <div>
            {/* Decorative background */}
            <div></div>
            <div></div>

            <div>
                <div>
                    <div>
                        <div>
                            <span>[CHECK]</span>
                        </div>
                        <div>
                            <p>
                                Ruta Autorizada
                            </p>
                            <h3>
                                {fuec.consecutivo}
                            </h3>
                        </div>
                    </div>
                    <Link href={`/dashboard/fuec`}> <Button
                            variant="ghost"
                            
                        >
                            <span>[FILETEXT]</span>
                        </Button>
                    </Link>
                </div>

                <div>
                    <div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <div>
                        <div>
                            <p>
                                Origen Operativo
                            </p>
                            <p>
                                {ruta.origen}
                            </p>
                        </div>
                        <div>
                            <p>
                                Destino Final
                            </p>
                            <p>
                                {ruta.destino}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <div>
                            <span>[CALENDAR]</span>
                            <p>
                                Vencimiento
                            </p>
                        </div>
                        <p>
                            {format(new Date(fuec.fechaFin), "d MMM, yyyy", {
                                locale: es,
                            })}
                        </p>
                    </div>
                    <div>
                        <div>
                            <MapPin />
                            <p>
                                Contratante
                            </p>
                        </div>
                        <p>
                            {fuec.contrato?.cliente || "Ocasional"}
                        </p>
                    </div>
                </div>

                <Link href="/dashboard/fuec" >
                    <Button>
                        Ver Extracto Digital
                    </Button>
                </Link>
            </div>
        </div>
    );
}
