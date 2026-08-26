"use client";

import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Certificado } from "../hooks/use-certificates";

interface CertificateItemProps {
    cert: Certificado;
    onDelete: (id: string) => Promise<void>;
}

export function CertificateItem({ cert, onDelete }: CertificateItemProps) {
    return (
        <div>
            <div>
                <div>
                    <Award />
                </div>
                <div>
                    <h4>
                        {cert.nombre}
                    </h4>
                    <p>
                        {cert.institucion || "Sin institución"} •
                        {cert.fechaEmision
                            ? format(new Date(cert.fechaEmision), " MMM yyyy", {
                                  locale: es,
                              })
                            : " S/F"}
                    </p>
                </div>
            </div>
            <div>
                {cert.archivo && (
                    <a
                        href={`/api/files/${cert.archivo.nombreUnico}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        
                    >
                        <ExternalLink />
                    </a>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(cert.id)}
                >
                    <Trash2 />
                </Button>
            </div>
        </div>
    );
}
