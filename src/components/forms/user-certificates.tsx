"use client";

import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

// Internal parts
import {
    useCertificates,
    Certificado,
} from "./user-certificates/hooks/use-certificates";
import { CertificateItem } from "./user-certificates/components/certificate-item";
import { CertificateForm } from "./user-certificates/components/certificate-form";

interface UserCertificatesProps {
    usuarioId: string;
    initialCertificados: Certificado[];
    defaultCategory?: "ESTUDIO" | "LEGAL" | "OTRO";
    title?: string;
}

export function UserCertificates({
    usuarioId,
    initialCertificados,
    defaultCategory = "OTRO",
    title = "Certificados y Cursos",
}: UserCertificatesProps) {
    const {
        certificados,
        isAdding,
        setIsAdding,
        isLoading,
        newCert,
        setNewCert,
        setSelectedFile,
        handleAdd,
        handleDelete,
    } = useCertificates({
        usuarioId,
        initialCertificados,
        defaultCategory,
    });

    const filteredCertificados = certificados.filter(
        (c) =>
            c.categoria === defaultCategory ||
            (!c.categoria && defaultCategory === "OTRO"),
    );

    return (
        <div>
            <div>
                <h3>
                    <Award />
                    {title}
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAdding(!isAdding)}
                >
                    {isAdding ? (
                        "Cancelar"
                    ) : (
                        <>
                            <span>[PLUS]</span> Añadir
                        </>
                    )}
                </Button>
            </div>

            {isAdding && (
                <CertificateForm
                    newCert={newCert}
                    setNewCert={setNewCert}
                    setSelectedFile={setSelectedFile}
                    onAdd={handleAdd}
                    isLoading={isLoading}
                />
            )}

            <div>
                {filteredCertificados.length === 0 ? (
                    <div>
                        <Award />
                        <p>
                            No hay {title.toLowerCase()} registrados
                        </p>
                    </div>
                ) : (
                    filteredCertificados.map((cert) => (
                        <CertificateItem
                            key={cert.id}
                            cert={cert}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
