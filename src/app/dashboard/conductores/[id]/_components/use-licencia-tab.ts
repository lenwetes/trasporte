import { useState, useRef } from "react";
import { toast } from "sonner";
import { LicenciaTabProps, TabLicencia, TempCategory } from "./licencia-tab.types";

export function useLicenciaTab({ conductor }: LicenciaTabProps) {
    const activeLicense = conductor.licencias?.find((l: TabLicencia) => l.activo);
    const anyLicenseWithFile = conductor.licencias?.find((l: TabLicencia) => l.archivo?.nombreUnico);
    const displayFile = activeLicense?.archivo || anyLicenseWithFile?.archivo;

    const [isDeletingFile, setIsDeletingFile] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDigitizeModalOpen, setIsDigitizeModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [numLicencia, setNumLicencia] = useState(conductor.numeroLicencia || "");
    const [tempCategories, setTempCategories] = useState<TempCategory[]>([]);
    const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startWizard = () => {
        setNumLicencia(conductor.numeroLicencia || "");
        setTempCategories(
            conductor.licencias
                ?.filter((l: TabLicencia) => l.activo)
                .map((l: TabLicencia) => ({
                    id: crypto.randomUUID(),
                    categoria: l.categoria,
                    servicio: l.servicio,
                    fechaVencimiento: l.fechaVencimiento
                        ? new Date(l.fechaVencimiento).toISOString().split("T")[0]
                        : "",
                })) || [],
        );
        setStep(1);
        setIsDigitizeModalOpen(true);
    };

    const addTempCategory = () => {
        setTempCategories([...tempCategories, { id: crypto.randomUUID(), categoria: "", servicio: "PÚBLICO", fechaVencimiento: "" }]);
    };

    const removeTempCategory = (index: number) => {
        setTempCategories(tempCategories.filter((_, i) => i !== index));
    };

    const updateTempCategory = (index: number, field: string, value: string) => {
        const newCats = [...tempCategories];
        // @ts-ignore - dynamic field update
        newCats[index] = { ...newCats[index], [field]: value };
        setTempCategories(newCats);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
            if (!uploadRes.ok) throw new Error("Error al subir");
            const uploadData = await uploadRes.json();
            setUploadedFileId(uploadData.id);
            toast.success("Archivo precargado con éxito");
        } catch (error) {
            console.error(error);
            toast.error("Falla en la carga del soporte");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteSoporte = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar este soporte digitalizado?")) return;
        setIsDeletingFile(true);
        try {
            const { eliminarSoporteLicencia } = await import("@/actions/licencias");
            const result = await eliminarSoporteLicencia(conductor.id);
            if (result.success) {
                toast.success("Soporte eliminado correctamente");
            } else {
                toast.error(result.error || "No se pudo eliminar el soporte");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error imprevisto en la desvinculación");
        } finally {
            setIsDeletingFile(false);
        }
    };

    const handleFinalSync = async () => {
        if (!numLicencia) {
            setStep(1);
            return;
        }
        setIsUploading(true);
        try {
            const { sincronizarHabilitacionCompleta } = await import("@/actions/licencias");
            const result = await sincronizarHabilitacionCompleta({
                usuarioId: conductor.id,
                numeroLicencia: numLicencia,
                categorias: tempCategories.map((c) => ({
                    ...c,
                    fechaVencimiento: new Date(`${c.fechaVencimiento}T12:00:00Z`),
                })),
                archivoId: uploadedFileId || undefined,
            });

            if (result.success) {
                setIsDigitizeModalOpen(false);
                toast.success("Sincronización maestra completada");
            } else {
                toast.error(result.error || "No se pudo sincronizar");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error crítico de sincronización");
        } finally {
            setIsUploading(false);
        }
    };

    return {
        displayFile,
        isDeletingFile,
        isUploading,
        isDigitizeModalOpen,
        setIsDigitizeModalOpen,
        step,
        setStep,
        numLicencia,
        setNumLicencia,
        tempCategories,
        addTempCategory,
        removeTempCategory,
        updateTempCategory,
        fileInputRef,
        handleFileUpload,
        handleDeleteSoporte,
        handleFinalSync,
        startWizard,
        uploadedFileId
    };
}
