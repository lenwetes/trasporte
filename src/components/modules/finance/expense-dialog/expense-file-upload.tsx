"use client";

import { X, FileUp, Loader2, Plus, Paperclip, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpenseFileUploadProps {
    archivoNames: string[];
    removeArchivo: (index: number) => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploading: boolean;
}

export function ExpenseFileUpload({
    archivoNames,
    removeArchivo,
    handleFileUpload,
    uploading,
}: ExpenseFileUploadProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {archivoNames.map((name, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white border border-white/10 shadow-lg animate-in fade-in zoom-in-95 duration-200"
                    >
                        <FileCheck size={14} className="text-accent" />
                        <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[120px] italic">
                            {name}
                        </span>
                        <button
                            type="button"
                            onClick={() => removeArchivo(i)}
                            className="ml-2 h-5 w-5 flex items-center justify-center hover:bg-white/10 text-white hover:text-red-400 transition-colors"
                        >
                            <X size={12} strokeWidth={3} />
                        </button>
                    </div>
                ))}
                
                <label
                    htmlFor="expense-file-upload"
                    className={cn(
                        "flex flex-col items-center justify-center min-h-[56px] w-full border-2 border-dashed border-primary/10 bg-slate-50 cursor-pointer transition-all hover:bg-slate-100 group px-4",
                        uploading && "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                >
                    <input
                        type="file"
                        id="expense-file-upload"
                        name="file-upload"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                    {uploading ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Cargando Soporte...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 flex items-center justify-center bg-primary text-white group-hover:bg-slate-800 transition-colors">
                                <Plus size={14} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Carga de Soporte</span>
                                <span className="text-[8px] font-bold text-primary uppercase tracking-widest italic leading-none mt-1">Sertificación Digital (PDF/IMG/XML)</span>
                            </div>
                        </div>
                    )}
                </label>
            </div>
            {archivoNames.length > 0 && (
                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 ml-1 italic opacity-60">
                    <Paperclip size={10} /> {archivoNames.length} Soporte(s) Verificado(s) en Ledger Temporal
                </p>
            )}
        </div>
    );
}
