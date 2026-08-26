"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, X, FileText, ExternalLink, ArrowLeft, Check, UploadCloud, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DOC_TYPES = [
    { id: "LICENCIA_TRANSITO", label: "Licencia de Tránsito", required: true },
    { id: "SOAT", label: "SOAT", required: true },
    { id: "REVISION_TECNOMECANICA", label: "Revisión Tecnomecánica", required: true },
    { id: "TARJETA_OPERACION", label: "Tarjeta de Operación", required: true },
    { id: "POLIZA_RESPONSABILIDAD_CIVIL", label: "Póliza de Responsabilidad Civil Contractual y Extra Contractual", required: true },
    { id: "SIMIT", label: "Estado de Cuenta SIMIT", required: false },
];

interface DocumentsStepProps {
    files: Record<string, File>;
    expiryDates: Record<string, string>;
    onFileChange: (type: string, file: File | null) => void;
    onDateChange: (type: string, date: string) => void;
    onBack: () => void;
    onSave: () => void;
    isSaving: boolean;
}

export function DocumentsStep({
    files,
    expiryDates,
    onFileChange,
    onDateChange,
    onBack,
    onSave,
    isSaving,
}: DocumentsStepProps) {
    const [preview, setPreview] = useState<{ url: string; name: string; type: string } | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (preview && dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, [preview]);

    const handlePreview = (type: string) => {
        const file = files[type];
        if (!file) return;
        
        const url = URL.createObjectURL(file);
        setPreview({ url, name: file.name, type: file.type });
    };

    const closePreview = () => {
        if (preview) {
            URL.revokeObjectURL(preview.url);
        }
        setPreview(null);
        dialogRef.current?.close();
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="h-10 w-10 bg-slate-50 flex items-center justify-center">
                    <UploadCloud className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Repositorio Documental</h3>
                   <p className="text-[11px] font-medium text-slate-900">Cargue los archivos binarios (PDF/JPG) para la validación legal de la unidad.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DOC_TYPES.map((doc) => {
                    const hasFile = !!files[doc.id];
                    return (
                        <div
                            key={doc.id}
                            className={cn(
                                "p-5 border transition-all duration-300 group relative",
                                hasFile ? "border-emerald-500 bg-emerald-50/10 shadow-sm" : "border-slate-100 hover:border-slate-400"
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1 group-hover:text-slate-900 transition-colors">
                                        {doc.label}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {hasFile ? (
                                            <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 uppercase tracking-tighter">CARGADO</span>
                                        ) : (
                                            <span className="text-[9px] font-black bg-slate-100 text-slate-900 px-2 py-0.5 uppercase tracking-tighter">PENDIENTE</span>
                                        )}
                                    </div>
                                </div>
                                {hasFile && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-none hover:bg-emerald-500 hover:text-white transition-colors"
                                        onClick={() => handlePreview(doc.id)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center h-10 border border-dashed border-slate-200 hover:border-slate-800 transition-all cursor-pointer bg-white overflow-hidden pl-3 pr-1">
                                    <span className="text-[10px] font-bold text-slate-900 flex-1 truncate uppercase tracking-tight">
                                        {hasFile ? files[doc.id].name : "Seleccionar Archivo..."}
                                    </span>
                                    <div className="h-8 w-8 bg-slate-100 flex items-center justify-center shrink-0">
                                        <UploadCloud className="h-3.5 w-3.5 text-slate-900" />
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => onFileChange(doc.id, e.target.files?.[0] || null)}
                                        accept=".pdf,image/*"
                                    />
                                </label>
                                
                                {doc.id !== "SIMIT" && (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-slate-900 shrink-0">
                                            <Calendar className="h-3 w-3" />
                                            <span className="text-[9px] font-black uppercase tracking-tighter">Vencimiento:</span>
                                        </div>
                                        <input
                                            type="date"
                                            value={expiryDates[doc.id] || ""}
                                            onChange={(e) => onDateChange(doc.id, e.target.value)}
                                            className="flex-1 h-8 bg-slate-50 border-none outline-none text-xs font-black uppercase tracking-tighter px-3 focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between pt-10 border-t border-slate-100 items-end">
                <Button 
                    type="button" 
                    variant="outline"
                    onClick={onBack} 
                    disabled={isSaving}
                    className="h-12 rounded-none px-8 text-[10px] font-black uppercase tracking-[0.2em] gap-3 group border-slate-200"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    REVISAR TRÁNSITO
                </Button>
                
                <Button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    className="h-14 rounded-none bg-emerald-600 hover:bg-emerald-700 px-12 text-[11px] font-black uppercase tracking-[0.2em] gap-3 group shadow-xl ring-offset-2 hover:ring-2 ring-emerald-500 transition-all"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            PROCESANDO EXPEDIENTE...
                        </>
                    ) : (
                        <>
                            <Check className="h-5 w-5" />
                            FINALIZAR REGISTRO DE UNIDAD
                        </>
                    )}
                </Button>
            </div>

            {/* Modal de Previsualización Moderno */}
            <dialog
                ref={dialogRef}
                onClose={closePreview}
                className="p-0 border-none bg-transparent outline-none backdrop:bg-slate-900/80 backdrop:backdrop-blur-sm"
            >
                {preview && (
                    <div className="w-[90vw] max-w-5xl h-[85vh] bg-white border border-slate-200 shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="h-20 shrink-0 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-8">
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                    <FileText className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1">Previsualización Técnica</div>
                                    <div className="text-sm font-black uppercase tracking-tighter text-slate-900 truncate max-w-md">{preview.name}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <a
                                    href={preview.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 px-6 bg-white border border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 hover:bg-slate-900 hover:text-white transition-all"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    ABRIR ORIGINAL
                                </a>
                                <Button
                                    onClick={closePreview}
                                    variant="secondary"
                                    className="h-10 w-10 p-0 rounded-none bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 hover:border-red-600 transition-all"
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-hidden bg-slate-100 p-8 flex items-center justify-center">
                            {preview.type.startsWith("image/") ? (
                                <img
                                    src={preview.url}
                                    alt="Vista previa"
                                    className="max-w-full max-h-full object-contain border border-white shadow-2xl shadow-slate-400/50"
                                />
                            ) : (
                                <iframe
                                    src={preview.url}
                                    title="PDF Preview"
                                    className="w-full h-full border-none bg-white shadow-2xl shadow-slate-400/50"
                                />
                            )}
                        </div>
                    </div>
                )}
            </dialog>
        </div>
    );
}
