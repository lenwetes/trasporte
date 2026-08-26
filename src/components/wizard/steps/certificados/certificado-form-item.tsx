"use client";

import React from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, useWatch } from "react-hook-form";
import { CertificadosFormValues } from "./schema";
import { Trash2, Upload, FileText, Calendar, Building2, GraduationCap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CertificadoFormItemProps {
    index: number;
    form: UseFormReturn<CertificadosFormValues>;
    remove: (index: number) => void;
    showRemove: boolean;
    category: "ESTUDIO" | "LEGAL";
    file: File | string | null;
    onFileChange: (index: number, file: File | null) => void;
}

const CERTIFICATE_OPTIONS = [
    "ANTECEDENTES POLICÍA", "ANTECEDENTES PROCURADURÍA", "ANTECEDENTES CONTRALORÍA",
    "MEDIDAS CORRECTIVAS", "CERTIFICADO SIMIT", "RUNT", 
    "CURSO DE MANEJO DEFENSIVO", "EXAMEN MÉDICO OCUPACIONAL",
    "AFILIACIÓN EPS", "AFILIACIÓN ARL", "CURSO PRIMEROS AUXILIOS", 
    "MANIPULACIÓN DE ALIMENTOS", "BACHILLER TÉCNICO", "TECNÓLOGO", "PROFESIONAL"
];

const INSTITUTION_OPTIONS = [
    "POLICÍA NACIONAL", "PROCURADURÍA GENERAL DE LA NACIÓN", 
    "CONTRALORÍA GENERAL DE LA REPÚBLICA", "FEDERACIÓN COLOMBIANA DE MUNICIPIOS", 
    "RUNT", "CENTRO DE ENSEÑANZA AUTOMOVILÍSTICA", 
    "CENTRO DE RECONOCIMIENTO DE CONDUCTORES", "MINISTERIO DE TRANSPORTE", 
    "SENA", "SECRETARÍA DE MOVILIDAD"
];

const inputCls = (error?: unknown) =>
    cn(
        "w-full h-11 px-3 rounded-none border text-sm bg-white transition-colors uppercase placeholder:normal-case placeholder:text-slate-900",
        "focus:outline-none focus:ring-0",
        error
            ? "border-red-500 bg-red-50/10"
            : "border-slate-300 focus:border-black",
    );

const labelCls = "text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1.5 flex items-center gap-2";

export function CertificadoFormItem({
    index,
    form,
    remove,
    showRemove,
    category,
    file,
    onFileChange,
}: CertificadoFormItemProps) {
    const nombreValue = useWatch({
        control: form.control,
        name: `certificados.${index}.nombre`
    });

    const handleTabAutoFill = (e: React.KeyboardEvent<HTMLInputElement>, options: string[], field: { value?: string | null, onChange: (value: string) => void }) => {
        if (e.key === "Tab" && field.value) {
            const currentVal = field.value;
            const match = options.find(o => o.toUpperCase().startsWith(currentVal.toUpperCase()));
            if (match && currentVal.toUpperCase() !== match.toUpperCase()) {
                e.preventDefault(); // Stop default tab
                field.onChange(match);
                // After setting value, we might want to let the focus move on the NEXT tab press
                // or just stay there. The user said "al presionar tab me deje avanzar al siguiente campo vacio"
                // but usually if we fill the current one, it shouldn't necessarily jump 2 fields.
                // However, if we just changed the value, we can let the event bubble?
                // Actually, if we use e.preventDefault(), we stay in the field.
                // Let's try NOT using e.preventDefault() so it tab-jumps.
            }
        }
    };

    return (
        <div className="bg-white border border-black p-6 relative group mb-4">
            {showRemove && (
                <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-0 right-0 p-2 bg-black text-white hover:bg-neutral-800 transition-colors z-20"
                    title="Eliminar"
                >
                    <Trash2 size={16} />
                </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                    control={form.control}
                    name={`certificados.${index}.nombre`}
                    render={({ field, fieldState }) => (
                        <FormItem className="space-y-1.5 flex-1">
                            <FormLabel className={labelCls}>
                                <GraduationCap size={14} className="text-black" />
                                {category === "ESTUDIO"
                                    ? "Título / Diploma Obtenido"
                                    : "Denominación del Certificado"}
                            </FormLabel>
                            <FormControl>
                                <input 
                                    {...field}
                                    list={`cert-names-${index}`}
                                    placeholder={category === "ESTUDIO" ? "Ej: BACHILLER TÉCNICO" : "Ej: PASADO JUDICIAL"}
                                    className={inputCls(fieldState.error)}
                                    value={field.value || ""}
                                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
                                    onKeyDown={(e) => handleTabAutoFill(e, CERTIFICATE_OPTIONS, field)}
                                    autoComplete="off"
                                />
                            </FormControl>
                            <datalist id={`cert-names-${index}`}>
                                {CERTIFICATE_OPTIONS.map(opt => <option key={opt} value={opt} />)}
                            </datalist>
                             {!nombreValue && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700">
                                    <AlertCircle size={10} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        OPCIONAL (RECOMENDADO)
                                    </span>
                                </div>
                            )}
                            <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`certificados.${index}.institucion`}
                    render={({ field, fieldState }) => (
                        <FormItem className="space-y-1.5 flex-1">
                            <FormLabel className={labelCls}>
                                <Building2 size={14} className="text-black" />
                                {category === "ESTUDIO"
                                    ? "Centro Educativo / Universidad"
                                    : "Autoridad / Entidad Emisora"}
                            </FormLabel>
                            <FormControl>
                                <input 
                                    {...field}
                                    list={`inst-names-${index}`}
                                    placeholder={category === "ESTUDIO" ? "Ej: SENA" : "Ej: POLICÍA NACIONAL"}
                                    className={inputCls(fieldState.error)}
                                    value={field.value || ""}
                                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
                                    onKeyDown={(e) => handleTabAutoFill(e, INSTITUTION_OPTIONS, field)}
                                    autoComplete="off"
                                />
                            </FormControl>
                            <datalist id={`inst-names-${index}`}>
                                {INSTITUTION_OPTIONS.map(opt => <option key={opt} value={opt} />)}
                            </datalist>
                            <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                    control={form.control}
                    name={`certificados.${index}.fechaEmision`}
                    render={({ field, fieldState }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className={labelCls}>
                                <Calendar size={14} className="text-black" />
                                Fecha de Expedición
                            </FormLabel>
                            <FormControl>
                                <input
                                    type="date"
                                    className={inputCls(fieldState.error)}
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`certificados.${index}.fechaVencimiento`}
                    render={({ field, fieldState }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className={labelCls}>
                                <Calendar size={14} className="text-black" />
                                Límite de Vigencia
                            </FormLabel>
                            <FormControl>
                                <input
                                    type="date"
                                    className={inputCls(fieldState.error)}
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                        </FormItem>
                    )}
                />
            </div>

            <div className="mt-4 pt-6 border-t border-black">
                <label className={labelCls}>
                    <FileText size={14} className="text-black" />
                    Soporte Documental (PDF)
                </label>
                <div className="relative">
                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => onFileChange(index, e.target.files?.[0] || null)}
                        id={`file-${index}`}
                        className="hidden"
                    />
                    <label
                        htmlFor={`file-${index}`}
                        className="flex items-center gap-4 p-4 bg-white border border-black cursor-pointer transition-all hover:bg-neutral-50 overflow-hidden group/upload"
                    >
                        <div className="w-12 h-12 bg-black text-white flex items-center justify-center shrink-0">
                            <Upload size={20} />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest block text-neutral-500 leading-none mb-1">
                                {file ? "DOCUMENTO VINCULADO" : "PENDIENTE DE CARGA"}
                            </span>
                            <span className="text-xs font-bold text-black truncate block">
                                {file 
                                    ? (file instanceof File 
                                        ? file.name 
                                        : (typeof file === "string" ? "SOPORTE PREVIO (ID: " + (file as string).slice(0, 8) + "...)" : "ARCHIVO VINCULADO")
                                      ) 
                                    : "VINCULAR ARCHIVO PDF"}
                            </span>
                        </div>
                    </label>
                    {file && (
                        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-neutral-100 border border-black text-black">
                            <div className="w-1.5 h-1.5 rounded-full bg-black" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {file instanceof File ? "VERIFICACIÓN DE CARGA EXITOSA" : "DOCUMENTO PERSISTIDO EN BORRADOR"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
