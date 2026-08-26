"use client";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Paperclip } from "lucide-react";

interface FileUploadProps {
    archivoId: string | null;
    nombreArchivo: string | null;
    uploading: boolean;
    onFileChange: (file: File) => Promise<void>;
    onRemove: () => void;
}

/**
 * Upload de soporte/factura para el movimiento de caja.
 */
export function CashMovementFileUpload({
    archivoId,
    nombreArchivo,
    uploading,
    onFileChange,
    onRemove,
}: FileUploadProps) {
    return (
        <div>
            <FormLabel
                htmlFor="cash-movement-file"
                
            >
                <div />
                Evidencia / Soporte Digital v2.0
            </FormLabel>
            {!archivoId ? (
                <Button id="cash-movement-file-btn"
                    type="button"
                    variant="outline"
                    disabled={uploading }>{uploading  ? (<span>[LOADER2]</span>
                    ) : (
                        <Paperclip />
                    )}
                    <span>
                        {uploading
                            ? "Sincronizando Archivo..."
                            : "Vincular Factura o Recibo Digital"}
                    </span>
                    <input
                        id="cash-movement-file"
                        name="file"
                        type="file"
                        
                        accept=".pdf,.jpg,.jpeg,.png,.xml"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) await onFileChange(file);
                        }}
                    />
                </Button>
            ) : (
                <div>
                    <div>
                        <div>
                            <span>[FILETEXT]</span>
                        </div>
                        <div>
                            <span>
                                {nombreArchivo}
                            </span>
                            <div>
                                <span />
                                <span>
                                    Documento Validado por Sistema
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onRemove}>
 <span>[X]</span>
                    </Button>
                </div>
            )}
        </div>
    );
}
