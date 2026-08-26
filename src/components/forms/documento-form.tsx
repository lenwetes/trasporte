"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    DocumentoVehiculoCreateSchema,
    DocumentoVehiculoUpdateSchema,
    DocumentoVehiculoCreate,
    DocumentoVehiculoUpdate,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createDocumentoVehiculo, updateDocumentoVehiculo } from "@/actions";
import { useRouter } from "next/navigation";
import { FileUpload } from "./file-upload";
import { FormErrorModal } from "@/components/ui/form-error-modal";

interface DocumentoFormProps {
    vehiculoId: string;
    initialData?: DocumentoVehiculoUpdate;
    documentId?: string;
    onSuccess?: () => void;
}

export function DocumentoForm({
    vehiculoId,
    initialData,
    documentId,
    onSuccess,
}: DocumentoFormProps) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    const isEdit = !!documentId;

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<DocumentoVehiculoCreate | DocumentoVehiculoUpdate>({
        defaultValues:
            initialData ||
            ({
                vehiculoId,
            } as DocumentoVehiculoCreate),
    });

    const onSubmit = async (
        values: DocumentoVehiculoCreate | DocumentoVehiculoUpdate,
    ) => {
        setLoading(true);
        setErrorMsg(null);
        clearErrors();

        // 1. Manual Validation
        const schema = isEdit
            ? DocumentoVehiculoUpdateSchema
            : DocumentoVehiculoCreateSchema;
        const validation = schema.safeParse({ ...values, vehiculoId });

        if (!validation.success) {
            validation.error.issues.forEach((issue) => {
                const path = issue.path[0] as keyof (
                    | DocumentoVehiculoCreate
                    | DocumentoVehiculoUpdate
                );
                setError(path, {
                    type: "manual",
                    message: issue.message,
                });
            });
            setShowErrorModal(true);
            setLoading(false);
            return;
        }

        try {
            // 2. File Upload if exists
            let finalArchivoId = values.archivoId;

            if (file) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", file);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                if (!uploadResponse.ok) {
                    throw new Error("Error al subir el archivo adjunto");
                }

                const uploadData = await uploadResponse.json();
                finalArchivoId = uploadData.id;
            }

            // 3. Save Document
            let result;
            const finalData = {
                ...validation.data,
                archivoId: finalArchivoId,
            } as DocumentoVehiculoCreate;

            if (isEdit && documentId) {
                result = await updateDocumentoVehiculo({
                    id: documentId,
                    ...(finalData as DocumentoVehiculoUpdate),
                });
            } else {
                result = await createDocumentoVehiculo(finalData);
            }

            if (result.success) {
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push(`/dashboard/vehiculos/${vehiculoId}`);
                    router.refresh();
                }
            } else {
                setErrorMsg(
                    result.error ||
                        `Error al ${isEdit ? "actualizar" : "guardar"} el documento`,
                );
                setShowErrorModal(true);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error inesperado",
            );
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <FormErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                errors={
                    errorMsg
                        ? { server: { message: errorMsg }, ...errors }
                        : errors
                }
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div>
                        <label>
                            <span>[FILETEXT]</span> Tipo de Documento
                        </label>
                        <select {...register("tipo")}>
                            <option value="">Seleccione...</option>
                            <option value="SOAT">SOAT</option>
                            <option value="LICENCIA_TRANSITO"> Licencia de Tránsito </option>
                            <option value="REVISION_TECNOMECANICA"> Revisión Tecnomecánica </option>
                            <option value="TARJETA_OPERACION"> Tarjeta de Operación </option>
                            <option value="POLIZA_RESPONSABILIDAD_CIVIL"> Póliza Responsabilidad Civil Contractual y Extracontractual </option>
                        </select>
                        {errors.tipo && (
                            <p>{errors.tipo.message as string}</p>
                        )}
                    </div>

                    <div>
                        <label>
                            <span>[CALENDAR]</span> Fecha de Vencimiento
                        </label>
                        <Input
                            type="date"
                            {...register("fechaVencimiento")}
                        />
                        {errors.fechaVencimiento && (
                            <p>{errors.fechaVencimiento.message as string}</p>
                        )}
                    </div>
                </div>

                <div>
                    <FileUpload
                        label="Soporte Digital del Documento (PDF o Imagen)"
                        onFileSelect={setFile}
                        accept={["application/pdf", "image/jpeg", "image/png"]}
                        maxSizeMB={10}
                    />
                </div>

                <div>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <span>[LOADER2]</span>
                                Procesando...
                            </>
                        ) : (
                            <>
                                {isEdit ? (
                                    <span>[SAVE]</span>
                                ) : (
                                    <span>[PLUS]</span>
                                )}
                                {isEdit
                                    ? "Guardar Cambios"
                                    : "Agregar Documento"}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
}
