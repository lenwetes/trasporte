"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    UsuarioCreateSchema,
    UsuarioUpdateSchema,
    UsuarioCreate,
    UsuarioUpdate,
} from "@/lib/validations";
import { createUser, updateUser } from "@/actions";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/actions";
import { RepositorioArchivo } from "@prisma/client";
import { ActionResult } from "@/types";
import { Button } from "@/components/ui/button";

// Import sections
import { IdentitySection } from "./usuario-form-sections/identity-section";
import { PersonalInfoSection } from "./usuario-form-sections/personal-info-section";
import { ContactSection } from "./usuario-form-sections/contact-section";
import { AdditionalInfoSection } from "./usuario-form-sections/additional-info-section";
import { LicenseSection } from "./usuario-form-sections/license-section";

interface InitialUsuarioData extends UsuarioUpdate {
    fotoPerfil?: {
        nombreUnico: string;
    } | null;
}

interface UsuarioFormProps {
    initialData?: InitialUsuarioData;
    userId?: string;
    currentUserRole?: string;
}

export function UsuarioForm({
    initialData,
    userId,
    currentUserRole,
}: UsuarioFormProps) {
    const [serverErrors, setServerErrors] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<File | null | undefined>(undefined);
    const router = useRouter();

    const isEdit = !!userId;
    const canManageRoles = currentUserRole === "ADMIN";

    const form = useForm<UsuarioCreate | UsuarioUpdate>({
        defaultValues:
            initialData ||
            ({
                nombres: "",
                apellidos: "",
                rol: "CONDUCTOR",
                tipoDocumento: "CC",
                municipio: "Sincelejo",
                numeroLicencia: "",
                licencias: [],
                experiencias: [],
                certificados: [],
            } as UsuarioCreate),
    });

    const {
        handleSubmit,
        clearErrors,
        formState: { errors },
    } = form;

    const processProfilePhoto = async (currentId: string | null | undefined) => {
        if (profilePhoto instanceof File) {
            const photoFormData = new FormData();
            photoFormData.append("file", profilePhoto);
            const uploadResult = await uploadFile(photoFormData);
            if (uploadResult.success && uploadResult.data) {
                return (uploadResult.data as RepositorioArchivo).id;
            }
        } else if (profilePhoto === null) {
            return null;
        }
        return currentId;
    };

    const handleRedirect = () => {
        const pathName = window.location.pathname;
        if (pathName.includes("/perfil/editar")) {
            router.push("/dashboard/perfil");
        } else {
            router.push("/dashboard/usuarios");
        }
    };

    const onSubmit = async (values: UsuarioCreate | UsuarioUpdate) => {
        setLoading(true);
        setServerErrors({});
        clearErrors();

        try {
            const schema = isEdit ? UsuarioUpdateSchema : UsuarioCreateSchema;
            const validation = schema.safeParse(values);

            if (!validation.success) {
                setServerErrors({
                    validation: "Complete todos los campos requeridos correctamente",
                    details: validation.error.format()
                });
                alert("Por favor revise los campos del formulario");
                return;
            }

            const validatedData = validation.data;
            const photoId = await processProfilePhoto(initialData?.idFotoPerfil);

            let result;
            if (isEdit && userId) {
                const dataToUpdate = {
                    id: userId,
                    ...validatedData,
                    idFotoPerfil: photoId,
                } as { id: string } & UsuarioUpdate;
                if (!(dataToUpdate as any).password) delete (dataToUpdate as any).password;
                result = await updateUser(dataToUpdate);
            } else {
                result = await createUser({
                    ...validatedData,
                    idFotoPerfil: photoId,
                } as UsuarioCreate);
            }

            if (result.success) {
                alert(`Usuario ${isEdit ? "actualizado" : "creado"} correctamente`);
                handleRedirect();
                router.refresh();
            } else {
                setServerErrors((result as ActionResult).errors || { server: (result as ActionResult).error });
                alert(result.error || "Ocurrió un error al guardar");
            }
        } catch (err) {
            console.error(err);
            alert("Error inesperado en el sistema");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8">
                    <IdentitySection
                        form={form}
                        isEdit={isEdit}
                        initialData={initialData}
                        onPhotoSelect={setProfilePhoto}
                    />

                    <PersonalInfoSection
                        form={form}
                        isEdit={isEdit}
                        canManageRoles={canManageRoles}
                    />

                    <ContactSection form={form} isEdit={isEdit} />

                    <AdditionalInfoSection form={form} isEdit={isEdit} />

                    <div className="bg-slate-50 p-6 rounded-none border border-slate-200">
                        <LicenseSection form={form} isEdit={isEdit} />
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-200">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-none bg-primary hover:bg-primary/90 text-white font-bold tracking-widest uppercase transition-all"
                    >
                        {loading ? "⌛ Sincronizando Expediente..." : (isEdit ? "💾 Guardar Cambios en Perfil" : "👤 Finalizar Alta de Usuario")}
                    </Button>
                    
                    {Object.keys(serverErrors).length > 0 && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-none text-red-800 text-sm font-medium">
                            <strong>Se encontraron errores:</strong>
                            <ul className="mt-2 ml-5 list-disc space-y-1">
                                {Object.entries(serverErrors).map(([k, v]) => (
                                    <li key={k}>{typeof v === 'string' ? v : JSON.stringify(v)}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
