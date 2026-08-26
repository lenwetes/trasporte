"use client";

import { useFormContext } from "react-hook-form";
import { TipoDocumentoIdSchema } from "@/lib/validations";
import { User, FileText, Upload, CheckCircle, X, Loader2, CreditCard, Calendar, Scale, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { uploadFile } from "@/actions";
import { toast } from "sonner";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-red-500">{message}</p>;
}

function FieldLabel({
    children,
    icon: Icon,
    required,
}: {
    children: React.ReactNode;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    required?: boolean;
}) {
    return (
        <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
            {Icon && <Icon size={12} className="text-brand" />}
            {children}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
    );
}

const inputCls = (error?: string) =>
    cn(
        "w-full h-11 px-3 rounded-none border text-sm bg-white transition-colors uppercase placeholder:normal-case placeholder:text-slate-900",
        "focus:outline-none focus:ring-1",
        error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-slate-200 focus:border-brand focus:ring-brand/20",
    );

export function BasicInfoPersonalFields() {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();

    const fechaNacimiento = watch("fechaNacimiento");

    const calculateAge = (dateString?: string) => {
        if (!dateString) return null;
        const today = new Date();
        const birthDate = new Date(dateString);
        if (isNaN(birthDate.getTime())) return null;
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(fechaNacimiento);

    const [uploading, setUploading] = useState(false);
    const idDocumentoIdentidad = watch("idDocumentoIdentidad");
    const idFotoPerfil = watch("idFotoPerfil");
    const [docFileName, setDocFileName] = useState<string | null>(null);

    // Datalist de Colombia
    const { COLOMBIA_DATA } = require("@/lib/colombia");
    const cityList = Array.from(new Set((COLOMBIA_DATA as any[]).flatMap(dep => 
        dep.ciudades.map((city: string) => `${city}, ${dep.departamento}`)
    )));

    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPhoto(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const result = await uploadFile(fd);
            if (result.success && result.data) {
                const uploaded = result.data as { id: string };
                setValue("idFotoPerfil", uploaded.id, { shouldDirty: true });
                toast.success("Foto de perfil actualizada.");
            } else {
                toast.error("Error al cargar la foto.");
            }
        } catch {
            toast.error("Error inesperado.");
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const result = await uploadFile(fd);
            if (result.success && result.data) {
                const uploaded = result.data as { id: string; nombreOriginal?: string };
                setDocFileName(file.name);
                // Guardamos el archivoId del documento en el form
                setValue("idDocumentoIdentidad", uploaded.id, { shouldDirty: true });
                toast.success("Documento de identidad cargado correctamente.");
            } else {
                toast.error("Error al cargar el documento.");
            }
        } catch {
            toast.error("Error inesperado al cargar el archivo.");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveDoc = () => {
        setDocFileName(null);
        setValue("idDocumentoIdentidad", null, { shouldDirty: true });
    };

    return (
        <div className="space-y-4">
            {/* Foto de Perfil */}
            <div className="flex items-center gap-6 mb-8 p-4 bg-slate-50 border border-slate-200">
                <div className="relative group">
                    <div className={cn(
                        "w-20 h-20 rounded-none border-2 border-slate-300 flex items-center justify-center overflow-hidden bg-white ml-2",
                        idFotoPerfil && "border-brand shadow-sm shadow-brand/10"
                    )}>
                        {idFotoPerfil ? (
                            <div className="flex flex-col items-center justify-center gap-1 animate-in fade-in zoom-in duration-300">
                                <CheckCircle size={24} className="text-brand" />
                                <span className="text-[11px] font-black uppercase text-brand tracking-widest text-[8px]">FOTO OK</span>
                            </div>
                        ) : (
                            <User size={32} className="text-slate-200" />
                        )}
                        
                        {uploadingPhoto && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                <Loader2 size={16} className="animate-spin text-brand" />
                            </div>
                        )}
                    </div>
                    
                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-black text-white flex items-center justify-center cursor-pointer hover:bg-brand transition-colors">
                        <Camera size={14} />
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            disabled={uploadingPhoto}
                        />
                    </label>
                </div>

                <div className="flex-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700 leading-none">Foto de Perfil</h4>
                    <p className="text-[9px] font-bold text-slate-900 uppercase tracking-widest mt-1.5 leading-relaxed">
                        Formato JPEG o PNG. Se recomienda fondo claro para identificación.
                    </p>
                    {idFotoPerfil && (
                        <button
                            type="button"
                            onClick={() => setValue("idFotoPerfil", null, { shouldDirty: true })}
                            className="mt-2 text-[8px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                        >
                            Quitar Imagen
                        </button>
                    )}
                </div>
            </div>

            {/* Nombres + Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <FieldLabel icon={User} required>
                        Nombres
                    </FieldLabel>
                    <input
                        {...register("nombres")}
                        placeholder="Ej: JUAN CARLOS"
                        autoFocus
                        tabIndex={1}
                        className={inputCls(errors.nombres?.message as string)}
                        autoComplete="given-name"
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.value = el.value.toUpperCase();
                        }}
                    />
                    <FieldError message={errors.nombres?.message as string} />
                </div>
                <div>
                    <FieldLabel icon={User} required>
                        Apellidos
                    </FieldLabel>
                    <input
                        {...register("apellidos")}
                        placeholder="Ej: PÉREZ TORRES"
                        tabIndex={2}
                        className={inputCls(errors.apellidos?.message as string)}
                        autoComplete="family-name"
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.value = el.value.toUpperCase();
                        }}
                    />
                    <FieldError message={errors.apellidos?.message as string} />
                </div>
            </div>

            {/* Tipo + Número de Documento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <FieldLabel icon={FileText}>Tipo de Documento</FieldLabel>
                    <select
                        {...register("tipoDocumento")}
                        tabIndex={3}
                        className={inputCls(errors.tipoDocumento?.message as string)}
                    >
                        {TipoDocumentoIdSchema.options.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                    <FieldError message={errors.tipoDocumento?.message as string} />
                </div>
                <div>
                    <FieldLabel icon={FileText}>Número de Documento</FieldLabel>
                    <input
                        {...register("numeroDocumento")}
                        placeholder="Ej: 1234567890"
                        tabIndex={4}
                        className={inputCls(errors.numeroDocumento?.message as string)}
                        autoComplete="off"
                    />
                    <FieldError message={errors.numeroDocumento?.message as string} />
                </div>
            </div>

            {/* Fecha de Nacimiento + Edad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <FieldLabel icon={Calendar} required>Fecha de Nacimiento</FieldLabel>
                    <input
                        type="date"
                        {...register("fechaNacimiento")}
                        value={fechaNacimiento ? (typeof fechaNacimiento === "string" ? fechaNacimiento.split("T")[0] : new Date(fechaNacimiento).toISOString().split("T")[0]) : ""}
                        tabIndex={5}
                        className={inputCls(errors.fechaNacimiento?.message as string)}
                    />
                    <FieldError message={errors.fechaNacimiento?.message as string} />
                </div>
                <div>
                    <FieldLabel icon={User}>Lugar de Nacimiento</FieldLabel>
                    <input
                        {...register("lugarNacimiento")}
                        placeholder="Ej: SINCELEJO, SUCRE"
                        tabIndex={6}
                        list="colombia-cities"
                        className={inputCls(errors.lugarNacimiento?.message as string)}
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.value = el.value.toUpperCase();
                        }}
                    />
                    <datalist id="colombia-cities">
                        {cityList.map((city: string) => (
                            <option key={city} value={city} />
                        ))}
                    </datalist>
                    <FieldError message={errors.lugarNacimiento?.message as string} />
                </div>
            </div>

            <div className="flex items-end">
                <div className="flex items-center gap-3 h-11 px-4 w-full bg-slate-50 border border-slate-200">
                    <Scale size={16} className="text-brand" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 leading-none mb-1">Edad Calculada</span>
                        <span className="text-sm font-black text-slate-700 leading-none">
                            {age !== null ? `${age} AÑOS` : "DD/MM/AAAA pendiente"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Carga del documento de identidad */}
            <div>
                <FieldLabel icon={CreditCard}>
                    Documento de Identidad (Imagen o PDF)
                </FieldLabel>

                {idDocumentoIdentidad ? (
                    /* Archivo cargado — estado exitoso */
                    <div className="flex items-center justify-between h-11 px-4 border border-brand/30 bg-brand/5">
                        <div className="flex items-center gap-3 min-w-0">
                            <CheckCircle size={14} className="text-brand shrink-0" />
                            <span className="text-[11px] font-black uppercase tracking-wider text-brand truncate">
                                {docFileName || "DOCUMENTO DIGITALIZADO ✓"}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveDoc}
                            className="ml-3 text-slate-900 hover:text-red-500 transition-colors shrink-0"
                            title="Eliminar documento"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    /* Zona de carga */
                    <label
                        className={cn(
                            "flex items-center gap-3 h-11 px-4 border border-dashed border-slate-300 bg-slate-50 cursor-pointer",
                            "hover:border-brand hover:bg-brand/5 transition-colors",
                            uploading && "opacity-60 cursor-wait",
                        )}
                    >
                        {uploading ? (
                            <Loader2 size={14} className="animate-spin text-brand shrink-0" />
                        ) : (
                            <Upload size={14} className="text-slate-900 shrink-0" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                            {uploading ? "Cargando documento..." : "Seleccionar archivo (JPG, PNG, PDF)"}
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={handleDocUpload}
                            disabled={uploading}
                            tabIndex={7}
                        />
                    </label>
                )}
                <p className="mt-1.5 text-[10px] text-slate-900 font-bold uppercase tracking-wider">
                    Escaneo, fotografía o PDF de cédula, pasaporte o CE. Opcional.
                </p>
            </div>
        </div>
    );
}
