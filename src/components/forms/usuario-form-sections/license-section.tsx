import {
    FileText,
    Upload,
    Loader2,
    Check,
    X,
    ShieldCheck,
    Plus,
    Trash2,
    Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useFieldArray } from "react-hook-form";
import {
    CategoriaLicenciaSchema,
    ServicioLicenciaSchema,
} from "@/lib/validations";
import { UsuarioFormSectionProps } from "./types";
import { uploadFile } from "@/actions";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function LicenseSection({ form }: UsuarioFormSectionProps) {
    const {
        register,
        control,
        setValue,
        watch,
        formState: { errors },
    } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "licencias",
    });

    const [uploadingState, setUploadingState] = useState<Record<number, boolean>>({});

    const handleFileUpload = async (index: number, file: File) => {
        if (!file) return;

        setUploadingState((prev) => ({ ...prev, [index]: true }));
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await uploadFile(formData);
            if (res.success && res.data) {
                setValue(`licencias.${index}.archivoId`, res.data.id);
                alert("Documento de licencia sincronizado");
            } else {
                alert("Error en la sincronización");
            }
        } catch (error) {
            console.error(error);
            alert("Error al transmitir archivo");
        } finally {
            setUploadingState((prev) => ({ ...prev, [index]: false }));
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-none border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-none bg-primary/10 text-primary flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="m-0 text-lg font-black text-primary uppercase tracking-widest">
                            Credenciales de Conducción
                        </h3>
                        <p className="m-0 text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Validación de Categorías y Vigencias
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="default"
                    className="rounded-none font-bold uppercase tracking-widest gap-2 bg-brand hover:bg-brand/90 text-white"
                    onClick={() => append({
                        categoria: "A1",
                        servicio: "PARTICULAR",
                        fechaVencimiento: new Date(),
                        archivoId: null,
                    })}
                >
                    <Plus size={16} />
                    Anexar Categoría
                </Button>
            </div>

            <div className="mb-6 max-w-md">
                <FormField
                    label="Número Nacional de Licencia"
                    placeholder="12345678"
                    icon={<FileText size={16} />}
                    error={errors.numeroLicencia?.message as string}
                    {...register("numeroLicencia")}
                />
            </div>

            <div className="grid gap-6">
                {fields.map((field, index) => {
                    const archivoId = watch(`licencias.${index}.archivoId`);

                    return (
                        <div
                            key={field.id}
                            className="p-6 border border-slate-200 rounded-none bg-slate-50 relative group"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                <div className="md:col-span-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase mb-2 tracking-widest">
                                        Categoría
                                    </label>
                                    <select
                                        {...register(`licencias.${index}.categoria` as const)}
                                        className="w-full h-10 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white"
                                    >
                                        {CategoriaLicenciaSchema.options.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase mb-2 tracking-widest">
                                        Servicio
                                    </label>
                                    <select
                                        {...register(`licencias.${index}.servicio` as const)}
                                        className="w-full h-10 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white"
                                    >
                                        {ServicioLicenciaSchema.options.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-3">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase mb-2 tracking-widest">
                                        Vencimiento
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900">
                                            <Calendar size={16} />
                                        </div>
                                        <input
                                            type="date"
                                            {...register(`licencias.${index}.fechaVencimiento` as const)}
                                            className="w-full h-10 pl-10 pr-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-3 lg:col-span-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase mb-2 tracking-widest">
                                        Certificación
                                    </label>
                                    <div className="flex items-center h-10 w-full">
                                        {archivoId ? (
                                            <div className="flex items-center gap-1.5 text-brand text-[10px] font-black uppercase tracking-widest bg-brand/10 px-3 h-full border border-brand/20 w-full truncate">
                                                <Check size={14} className="shrink-0" />
                                                <span className="truncate">Sincronizado</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setValue(`licencias.${index}.archivoId`, null)}
                                                    className="ml-auto text-red-500 hover:text-red-700 transition-colors shrink-0"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center w-full h-full">
                                                <input
                                                    type="file"
                                                    id={`file-${field.id}`}
                                                    className="hidden"
                                                    accept="image/*,application/pdf"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleFileUpload(index, file);
                                                    }}
                                                    disabled={uploadingState[index]}
                                                />
                                                <label
                                                    htmlFor={`file-${field.id}`}
                                                    className="flex items-center justify-center gap-2 px-3 w-full h-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                                                >
                                                    {uploadingState[index] ? <Loader2 size={14} className="animate-spin text-brand shrink-0" /> : <Upload size={14} className="text-slate-900 shrink-0" />}
                                                    <span className="truncate">{uploadingState[index] ? "Cargando" : "Adjuntar"}</span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-12 lg:col-span-1 flex lg:justify-end items-center lg:items-end h-full">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="mt-6 lg:mt-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                                        title="Eliminar Categoría"
                                    >
                                        <Trash2 size={16} /> 
                                        <span className="lg:hidden">Remover esta categoría</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {fields.length === 0 && (
                    <div className="text-center p-12 border-2 border-dashed border-slate-200 bg-white text-slate-900 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 flex items-center justify-center border border-slate-100">
                            <ShieldCheck size={32} className="text-slate-900" />
                        </div>
                        <p className="m-0 text-xs font-black uppercase tracking-widest">Esperando Datos de Habilitación</p>
                    </div>
                )}
            </div>
        </div>
    );
}
