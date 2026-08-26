"use client";

import React, { useState } from "react";
import { useForm, FormProvider, Path } from "react-hook-form";
import { VehiculoCreate, VehiculoUpdate } from "@/lib/validations";
import {
    createVehiculo,
    updateVehiculo,
    uploadFile,
    createDocumentoVehiculo,
} from "@/actions";
import { useRouter } from "next/navigation";
import { RepositorioArchivo } from "@prisma/client";
import { TechnicalInfoSection } from "./vehiculo/technical-info-section";
import { TransitLicenseSection } from "./vehiculo/transit-license-section";
import { DocumentsSection } from "./vehiculo/documents-section";

interface VehiculoFormProps {
    initialData?: VehiculoUpdate;
    vehicleId?: string;
    ownerDisplayName?: string;
}

export function VehiculoForm({ initialData, vehicleId, ownerDisplayName }: VehiculoFormProps) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<Record<string, File>>({});
    const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});
    const router = useRouter();

    const isEdit = !!vehicleId;

    const methods = useForm<VehiculoCreate>({
        defaultValues: (initialData as unknown as VehiculoCreate) || {
            modalidad: "FLOTA_PROPIA",
            clase: "OTRO",
            anho: new Date().getFullYear(),
        },
    });

    const {
        handleSubmit,
        clearErrors,
        formState: { errors },
    } = methods;

    const handleFileChange = (type: string, file: File | null) => {
        if (file) {
            setFiles((prev) => ({ ...prev, [type]: file }));
        }
    };

    const handleDateChange = (type: string, date: string) => {
        setExpiryDates((prev) => ({ ...prev, [type]: date }));
    };

    const handleServerErrors = (errors: Record<string, unknown>) => {
        Object.entries(errors).forEach(([key, msgs]) => {
            const messages = msgs as string[];
            if (Array.isArray(messages) && messages.length > 0) {
                methods.setError(key as Path<VehiculoCreate>, {
                    type: "server",
                    message: messages[0],
                });
            }
        });
    };

    const processDocuments = async (vId: string) => {
        const uploadErrors: string[] = [];

        const uploadPromises = Object.entries(files).map(
            async ([type, file]) => {
                try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const uploadRes = await uploadFile(formData);

                    if (!uploadRes.success || !uploadRes.data) {
                        uploadErrors.push(`${type}: Error al subir archivo`);
                        return;
                    }

                    if (!expiryDates[type]) {
                        uploadErrors.push(
                            `${type}: Falta fecha de vencimiento`,
                        );
                        return;
                    }

                    const docRes = await createDocumentoVehiculo({
                        vehiculoId: vId,
                        tipo: type,
                        fechaVencimiento: new Date(expiryDates[type]),
                        archivoId: (uploadRes.data as RepositorioArchivo).id,
                    });

                    if (!docRes.success) {
                        uploadErrors.push(
                            `${type}: ${docRes.error || "Error al vincular"}`,
                        );
                    }
                } catch {
                    uploadErrors.push(`${type}: Error inesperado`);
                }
            },
        );

        await Promise.all(uploadPromises);
        return uploadErrors;
    };

    const onSubmit = async (values: VehiculoCreate) => {
        setLoading(true);
        setErrorMsg(null);
        clearErrors();

        try {
            const cleanedValues = Object.fromEntries(
                Object.entries(values).map(([key, value]) => [
                    key,
                    value === "" ? null : value,
                ]),
            ) as VehiculoCreate;

            const vehicleResult =
                isEdit && vehicleId
                    ? await updateVehiculo({ id: vehicleId, ...cleanedValues })
                    : await createVehiculo(cleanedValues);

            if (!vehicleResult.success || !vehicleResult.data) {
                const err = vehicleResult.error || "Error al procesar vehículo";
                setErrorMsg(err);
                if (vehicleResult.errors) handleServerErrors(vehicleResult.errors);
                alert(err);
                return;
            }

            const vehicleData = vehicleResult.data as { id: string };
            const uploadErrors = await processDocuments(vehicleData.id);

            if (uploadErrors.length > 0) {
                const err = `Vehículo guardado, con errores en documentos: ${uploadErrors.join(", ")}`;
                setErrorMsg(err);
                alert(err);
                return;
            }

            alert(isEdit ? "Vehículo actualizado exitosamente" : "Vehículo registrado exitosamente");
            router.push("/dashboard/vehiculos");
            router.refresh();
        } catch (err) {
            setErrorMsg("Ocurrió un error inesperado");
            alert("Error crítico en la operación");
        } finally {
            setLoading(false);
        }
    };

    const buttonStyle = {
        width: "100%",
        padding: "15px",
        backgroundColor: "#0f172a",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "30px",
        opacity: loading ? 0.7 : 1
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TechnicalInfoSection />
                    <TransitLicenseSection ownerDisplayName={ownerDisplayName} />
                    
                    {isEdit ? (
                        <div style={{ padding: "25px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "30px" }}>
                            <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                                <div style={{ fontSize: "24px" }}>📂</div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#0f172a" }}>Gestión Documental Operativa</h3>
                                    <p style={{ margin: "5px 0 15px 0", fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
                                        Para renovar documentos maestros (SOAT, T. Operación, Pólizas), ver el historial legal y gestionar alertas de vencimiento, accede directamente al expediente digital del vehículo.
                                    </p>
                                    <button 
                                        type="button" 
                                        onClick={() => router.push(`/dashboard/vehiculos/${vehicleId}?tab=documentos`)}
                                        style={{ padding: "8px 16px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                                    >
                                        Ir a Bóveda Digital del Vehículo
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <DocumentsSection
                            files={files}
                            expiryDates={expiryDates}
                            onFileChange={handleFileChange}
                            onDateChange={handleDateChange}
                        />
                    )}

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? "⌛ Procesando Transacción..." : (isEdit ? "💾 Sincronizar Cambios Maestros" : "➕ Finalizar Registro de Unidad")}
                    </button>
                    
                    {errorMsg && (
                        <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "8px", color: "#991b1b", fontSize: "13px", fontWeight: "bold" }}>
                            ⚠️ {errorMsg}
                        </div>
                    )}
                </form>
            </FormProvider>
        </div>
    );
}
