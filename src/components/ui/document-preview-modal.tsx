"use client";

import * as React from "react";

export interface PreviewArchivo {
    id?: string;
    nombreUnico: string;
    nombreOriginal: string;
    url?: string;
}

interface DocumentPreviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    archivo: PreviewArchivo | null;
    label: string;
}

export function DocumentPreviewModal({
    open,
    onOpenChange,
    archivo,
    label,
}: DocumentPreviewModalProps) {
    if (!open || !archivo) return null;

    const fileUrl = archivo.url || `/api/files/${archivo.nombreUnico}`;
    const isPDF = archivo.nombreUnico.toLowerCase().endsWith(".pdf") || 
                  archivo.nombreOriginal.toLowerCase().endsWith(".pdf");

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
            <div className="bg-white border border-slate-200 shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Technical Header */}
                <div className="bg-white border-b border-slate-100 p-6 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-slate-900 flex items-center justify-center text-white shadow-xl shrink-0">
                            {isPDF ? "PDF" : "IMG"}
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-3">
                                {label}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mt-1 truncate max-w-md">
                                <span className="text-cyan-600 mr-2">DOC_REF:</span>
                                {archivo.nombreOriginal}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <a 
                            href={fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hidden sm:flex h-11 items-center gap-3 bg-slate-50 border border-slate-200 px-6 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-white hover:border-cyan-200 transition-all"
                        >
                            Ver Original
                        </a>
                        <button 
                            onClick={() => onOpenChange(false)}
                            className="h-11 w-11 flex items-center justify-center bg-slate-100 text-slate-900 hover:bg-red-50 hover:text-red-500 transition-all group"
                        >
                            <span className="text-2xl font-light transform group-hover:rotate-90 transition-transform">×</span>
                        </button>
                    </div>
                </div>

                {/* Secure Content Viewer */}
                <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center group">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <h2 className="text-6xl font-black uppercase tracking-[1em] text-slate-900">COOPETRAES</h2>
                    </div>
                    
                    <div className="w-full h-full relative z-10 flex items-center justify-center">
                        {isPDF ? (
                            <iframe
                                src={`${fileUrl}#toolbar=0&navpanes=0`}
                                className="w-full h-full border-none bg-white shadow-inner"
                                title={label}
                                loading="lazy"
                            />
                        ) : (
                            <div className="p-8 h-full w-full flex items-center justify-center overflow-auto">
                                <img
                                    src={fileUrl}
                                    alt={label}
                                    className="max-w-full max-h-full object-contain shadow-2xl border-8 border-white"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Footer */}
                <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.3em]">
                         Protocolo de Visualización Segura v4.1
                    </p>
                    <div className="flex items-center gap-5">
                         <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none">Cifrado de Canal Activo</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
