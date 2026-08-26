"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CertificateFormProps {
    newCert: {
        nombre: string;
        institucion: string;
        fechaEmision: string;
        fechaVencimiento: string;
        categoria: string;
    };
    setNewCert: (cert: CertificateFormProps["newCert"]) => void;
    setSelectedFile: (file: File | null) => void;
    onAdd: () => Promise<void>;
    isLoading: boolean;
}

export function CertificateForm({
    newCert,
    setNewCert,
    setSelectedFile,
    onAdd,
    isLoading,
}: CertificateFormProps) {
    return (
        <div>
            <div>
                <div>
                    <label>
                        Nombre del Curso/Certificado
                    </label>
                    <Input
                        value={newCert.nombre}
                        onChange={(e) => setNewCert({
                                ...newCert,
                                nombre: e.target.value,
                            })
                        }
                        placeholder="Ej: Curso de Seguridad Vial"
                        
                    />
                </div>
                <div>
                    <label>
                        Institución
                    </label>
                    <Input
                        value={newCert.institucion}
                        onChange={(e) => setNewCert({
                                ...newCert,
                                institucion: e.target.value,
                            })
                        }
                        placeholder="Ej: SENA"
                        
                    />
                </div>
                <div>
                    <label>
                        Fecha Emisión
                    </label>
                    <Input
                        type="date"
                        value={newCert.fechaEmision}
                        onChange={(e) => setNewCert({
                                ...newCert,
                                fechaEmision: e.target.value,
                            })
                        }
                        
                    />
                </div>
                <div>
                    <label>
                        Fecha Vencimiento
                    </label>
                    <Input
                        type="date"
                        value={newCert.fechaVencimiento}
                        onChange={(e) => setNewCert({
                                ...newCert,
                                fechaVencimiento: e.target.value,
                            })
                        }
                        
                    />
                </div>
                <div>
                    <label>
                        Adjuntar PDF/Imagen
                    </label>
                    <Input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)
                        }
                        
                        accept="application/pdf,image/*"
                    />
                </div>
            </div>
            <Button onClick={onAdd}
                disabled={isLoading }>{isLoading  ? (<span>[LOADER2]</span>
                ) : (
                    "Guardar Certificado"
                )}
            </Button>
        </div>
    );
}
