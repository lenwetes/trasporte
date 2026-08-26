"use client";
import React from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn, useWatch } from "react-hook-form";
import { ExperienciasFormValues } from "./schema";
import { Trash2, Building2, Briefcase, User as UserIcon, Phone, Calendar, Clock, AlertCircle, FileText, Eye, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { uploadFile } from "@/actions";
import { toast } from "sonner";
import { DocumentPreviewModal, PreviewArchivo } from "@/components/ui/document-preview-modal";

interface ExperienciaFormItemProps {
    index: number;
    form: UseFormReturn<ExperienciasFormValues>;
    remove: (index: number) => void;
    showRemove: boolean;
}

const inputCls = (error?: string) =>
    cn(
        "w-full h-11 px-3 rounded-none border text-sm bg-white transition-colors uppercase placeholder:normal-case placeholder:text-slate-900",
        "focus:outline-none focus:ring-1",
        error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-slate-200 focus:border-brand focus:ring-brand/20",
    );

const labelCls = "text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1.5 flex items-center gap-2";

export function ExperienciaFormItem({
    index,
    form,
    remove,
    showRemove,
}: ExperienciaFormItemProps) {
    const [uploading, setUploading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [archivo, setArchivo] = useState<PreviewArchivo | null>(null);

    const archivoId = useWatch({
        control: form.control,
        name: `experiencias.${index}.archivoId`
    });
    const empresaValue = useWatch({
        control: form.control,
        name: `experiencias.${index}.empresa`
    });

    const cargoValue = useWatch({
        control: form.control,
        name: `experiencias.${index}.cargo`
    });

    const fechaInicio = useWatch({
        control: form.control,
        name: `experiencias.${index}.fechaInicio`
    });

    const fechaFin = useWatch({
        control: form.control,
        name: `experiencias.${index}.fechaFin`
    });

    React.useEffect(() => {
        if (!fechaInicio || !fechaFin) return;

        const start = new Date(fechaInicio);
        const end = new Date(fechaFin);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return;
        if (end < start) return;

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        const parts = [];
        if (years > 0) parts.push(`${years} ${years === 1 ? "AÑO" : "AÑOS"}`);
        if (months > 0) parts.push(`${months} ${months === 1 ? "MES" : "MESES"}`);
        
        const result = parts.length > 0 ? parts.join(", ") : "MENOS DE 1 MES";
        form.setValue(`experiencias.${index}.tiempoLaborado`, result);
    }, [fechaInicio, fechaFin, index, form]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const result = await uploadFile(formData);

            if (result.success && result.data) {
                const uploaded = result.data as PreviewArchivo;
                setArchivo(uploaded);
                form.setValue(`experiencias.${index}.archivoId`, uploaded.id);
                toast.success("Certificado laboral cargado correctamente.");
            } else {
                toast.error("Error al subir el archivo.");
            }
        } catch (error) {
            toast.error("Error inesperado en la subida.");
        } finally {
            setUploading(false);
        }
    };

    const removeFile = () => {
        setArchivo(null);
        form.setValue(`experiencias.${index}.archivoId`, null);
    };

    return (
        <div className="bg-white border border-slate-200 p-6 relative group mb-2 animate-in slide-in-from-right-2 duration-300">
            {showRemove && (
                <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 text-white flex items-center justify-center border-2 border-white shadow-lg hover:bg-black transition-colors z-20"
                >
                    <Trash2 size={14} />
                </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                    control={form.control}
                    name={`experiencias.${index}.empresa`}
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className={labelCls}>
                                <Building2 size={14} className="text-brand" />
                                Empresa o Razón Social
                            </FormLabel>
                            <FormControl>
                                <input 
                                    placeholder="Ej: TRANSPORTES S.A.S"
                                    className={cn(
                                        inputCls(),
                                        !empresaValue && "border-amber-300 bg-amber-50/10"
                                    )}
                                    {...field}
                                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
                                />
                            </FormControl>
                            {!empresaValue && (
                                <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700">
                                    <AlertCircle size={10} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Advertencia: Empresa no definida
                                    </span>
                                </div>
                            )}
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`experiencias.${index}.cargo`}
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className={labelCls}>
                                <Briefcase size={14} className="text-brand" />
                                Cargo Desempeñado
                            </FormLabel>
                            <FormControl>
                                <input 
                                    placeholder="Ej: CONDUCTOR DE LÍNEA"
                                    className={cn(
                                        inputCls(),
                                        !cargoValue && "border-amber-300 bg-amber-50/10"
                                    )}
                                    {...field}
                                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
                                />
                            </FormControl>
                            {!cargoValue && (
                                <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700">
                                    <AlertCircle size={10} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Advertencia: Cargo no definido
                                    </span>
                                </div>
                            )}
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                    control={form.control}
                    name={`experiencias.${index}.jefeInmediato`}
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className={labelCls}>
                                <UserIcon size={14} className="text-brand" />
                                Jefe Inmediato
                            </FormLabel>
                            <FormControl>
                                <input 
                                    placeholder="Ej: CARLOS PÉREZ"
                                    className={inputCls()}
                                    {...field}
                                    value={field.value || ""}
                                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`experiencias.${index}.telefonoJefe`}
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className={labelCls}>
                                <Phone size={14} className="text-brand" />
                                Teléfono de Contacto
                            </FormLabel>
                            <FormControl>
                                <input 
                                    placeholder="Ej: 300 000 0000"
                                    className={inputCls()}
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name={`experiencias.${index}.fechaInicio`}
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className={labelCls}>
                                <Calendar size={14} className="text-brand" />
                                Inicio
                            </FormLabel>
                            <FormControl>
                                <input
                                    type="date"
                                    className={inputCls()}
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`experiencias.${index}.fechaFin`}
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className={labelCls}>
                                <Calendar size={14} className="text-brand" />
                                Finalización
                            </FormLabel>
                            <FormControl>
                                <input
                                    type="date"
                                    className={inputCls()}
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`experiencias.${index}.tiempoLaborado`}
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className={labelCls}>
                                <Clock size={14} className="text-brand" />
                                Período
                            </FormLabel>
                            <FormControl>
                                <input
                                    placeholder="Ej: 2 AÑOS"
                                    className={inputCls()}
                                    {...field}
                                    value={field.value || ""}
                                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />
            </div>

            {/* Certificado Digital Section */}
            <div className="mt-8 pt-6 border-t border-slate-100">
                <FormField
                    control={form.control}
                    name={`experiencias.${index}.archivoId`}
                    render={() => (
                        <FormItem className="space-y-3">
                            <FormLabel className={labelCls}>
                                <FileText size={14} className="text-brand" />
                                Certificado Laboral Digital (Imagen/PDF)
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    {!archivoId ? (
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                id={`exp-upload-${index}`}
                                                className="hidden"
                                                accept="image/*,.pdf"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor={`exp-upload-${index}`}
                                                className={cn(
                                                    "flex items-center justify-center gap-3 h-12 border-2 border-dashed border-slate-200 cursor-pointer transition-all uppercase text-[10px] font-black tracking-widest hover:border-brand hover:bg-brand/5 hover:text-brand",
                                                    uploading && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                {uploading ? (
                                                    "Subiendo..."
                                                ) : (
                                                    <>
                                                        <Upload size={14} /> 
                                                        Cargar Certificación Laboral
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between h-12 px-4 bg-brand/5 border border-brand/20">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="bg-brand/10 p-2">
                                                    <FileText size={16} className="text-brand" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-wider truncate text-brand">
                                                    {archivo?.nombreOriginal || "Certificado Cargado"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    type="button" 
                                                    className="p-2 text-brand hover:bg-brand/10 transition-colors"
                                                    onClick={() => setShowPreview(true)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="p-2 text-red-500 hover:bg-red-50 transition-colors"
                                                    onClick={removeFile}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold" />
                        </FormItem>
                    )}
                />
            </div>

            <DocumentPreviewModal
                open={showPreview}
                onOpenChange={setShowPreview}
                archivo={archivo || null}
                label="Previsualización de Experiencia Laboral"
            />
        </div>
    );
}
