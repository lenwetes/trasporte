import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { useState } from "react";
import {
    CategoriaLicenciaSchema,
    ServicioLicenciaSchema,
} from "@/lib/validations";
import { cn } from "@/lib/utils";
import { 
    Upload, 
    Trash2, 
    Plus, 
    FileText, 
    Eye, 
    X,
    Image as ImageIcon
} from "lucide-react";
import { uploadFile } from "@/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DocumentPreviewModal, PreviewArchivo } from "@/components/ui/document-preview-modal";

interface LicenciaFormItem {
    categoria: string;
    servicio: string;
    fechaVencimiento: string;
    archivoId?: string | null;
}

export function BasicInfoLicenseFields() {
    const { register, control, setValue, formState: { errors } } = useFormContext();
    const [uploading, setUploading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [archivo, setArchivo] = useState<PreviewArchivo | null>(null);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "licencias",
    });

    const currentRol = useWatch({
        control,
        name: "rol",
    });

    const licenciasData = useWatch({
        control,
        name: "licencias"
    });

    if (currentRol !== "CONDUCTOR") {
        return null;
    }

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
                
                // Asignar a todas las licencias
                const updatedLicencias = ((licenciasData as LicenciaFormItem[]) || []).map((lic) => ({
                    ...lic,
                    archivoId: uploaded.id
                }));
                setValue("licencias", updatedLicencias);
                
                toast.success("Documento de licencia cargado.");
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
        const updatedLicencias = ((licenciasData as LicenciaFormItem[]) || []).map((lic) => ({
            ...lic,
            archivoId: null
        }));
        setValue("licencias", updatedLicencias);
    };

    const inputCls = (error?: string) =>
        cn(
            "w-full h-11 px-3 rounded-none border text-sm bg-white transition-colors uppercase placeholder:normal-case",
            "focus:outline-none focus:ring-1",
            error
                ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:border-brand focus:ring-brand/20",
        );

    const labelCls = "text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1.5 block";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header section with Global Upload */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-brand h-full" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                            Identificación de Tránsito (RUNT)
                        </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className={labelCls}>Número de Licencia</label>
                            <input
                                placeholder="Ej: 1102928374"
                                className={inputCls(errors.numeroLicencia?.message as string)}
                                {...register("numeroLicencia")}
                                onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
                            />
                            {errors.numeroLicencia && (
                                <p className="text-[10px] uppercase font-bold text-red-500 mt-1">
                                    {String(errors.numeroLicencia.message)}
                                </p>
                            )}
                        </div>

                        {/* File Upload Box */}
                        <div className="space-y-1.5">
                            <label className={labelCls}>Documento Digital (Imagen/PDF)</label>
                            {!archivo ? (
                                <div className="relative group">
                                    <input
                                        type="file"
                                        id="license-upload"
                                        className="hidden"
                                        accept="image/*,.pdf"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                    <label
                                        htmlFor="license-upload"
                                        className={cn(
                                            "flex items-center justify-center gap-3 h-11 border-2 border-dashed border-slate-200 cursor-pointer transition-all uppercase text-[10px] font-black tracking-widest hover:border-brand hover:bg-brand/5",
                                            uploading && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {uploading ? "Subiendo..." : <><Upload size={14} /> Cargar Licencia</>}
                                    </label>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between h-11 px-3 bg-brand/5 border border-brand/20">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="bg-brand/10 p-1.5">
                                            <FileText size={12} className="text-brand" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider truncate text-brand">
                                            {archivo.nombreOriginal}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button 
                                            type="button" 
                                            className="p-1.5 text-brand hover:bg-brand/10 transition-colors"
                                            onClick={() => setShowPreview(true)}
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button 
                                            type="button" 
                                            className="p-1.5 text-red-500 hover:bg-red-50 transition-colors"
                                            onClick={removeFile}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={() => append({
                        categoria: "",
                        servicio: "PARTICULAR",
                        fechaVencimiento: "",
                        archivoId: archivo?.id // Hereda el archivo cargado si existe
                    })}
                    className="h-11 rounded-none border-2 border-slate-900 bg-white text-slate-900 hover:bg-slate-900 hover:text-white font-black text-[10px] uppercase tracking-widest px-6 gap-2 transition-all shrink-0"
                >
                    <Plus size={16} />
                    Agregar Categoría
                </Button>
            </div>

            {/* Categories List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {fields.map((field, index) => (
                    <div 
                        key={field.id} 
                        className="bg-white border border-slate-200 p-5 space-y-5 relative group hover:border-brand/30 transition-colors"
                    >
                        <div className="flex justify-between items-center bg-slate-50 -mx-5 -mt-5 px-5 py-2.5 border-b border-slate-200">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
                                Categoría Operativa #{index + 1}
                            </span>
                            <button
                                type="button"
                                className="text-red-400 hover:text-red-700 transition-colors"
                                onClick={() => remove(index)}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className={labelCls}>Tipo de Categoría</label>
                                <select 
                                    {...register(`licencias.${index}.categoria`)}
                                    className={inputCls((errors.licencias as any)?.[index]?.categoria?.message)}
                                >
                                    <option value="">SELECCIONE...</option>
                                    {CategoriaLicenciaSchema.options.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className={labelCls}>Servicio</label>
                                <select 
                                    {...register(`licencias.${index}.servicio`)}
                                    className={inputCls((errors.licencias as any)?.[index]?.servicio?.message)}
                                >
                                    <option value="">SELECCIONE...</option>
                                    {ServicioLicenciaSchema.options.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelCls}>Fecha de Vencimiento</label>
                            <input
                                type="date"
                                {...register(`licencias.${index}.fechaVencimiento`)}
                                className={inputCls((errors.licencias as any)?.[index]?.fechaVencimiento?.message)}
                            />
                        </div>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="lg:col-span-2 border-2 border-dashed border-slate-100 p-12 text-center bg-slate-50/50">
                        <div className="w-12 h-12 bg-white border border-slate-200 rounded-none flex items-center justify-center mx-auto mb-4 text-slate-900">
                            <ImageIcon size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                            No se han registrado categorías operativas
                        </p>
                        <p className="text-[9px] font-bold text-slate-900 uppercase tracking-wider mt-1">
                            Use el botón superior para agregar una nueva categoría
                        </p>
                    </div>
                )}
            </div>

            <DocumentPreviewModal
                open={showPreview}
                onOpenChange={setShowPreview}
                archivo={archivo}
                label="Previsualización de Licencia"
            />
        </div>
    );
}
