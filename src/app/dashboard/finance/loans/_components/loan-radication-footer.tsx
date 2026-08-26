"use client";

import { Button } from "@/components/ui/button";
import { FileCheck, Upload, Eye, X, ShieldAlert } from "lucide-react";
import { PrestamoWithRelations } from "@/types";

interface LoanRadicationFooterProps {
    loan: PrestamoWithRelations;
    loading: boolean;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPreview: (url: string) => void;
    onDeleteRadication: () => void;
    onDisburse: () => void;
}

export function LoanRadicationFooter({ loan, loading, onUpload, onPreview, onDeleteRadication, onDisburse }: LoanRadicationFooterProps) {
    return (
        <div className="p-8 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <ShieldAlert size={14} className="text-emerald-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Radicación Requerida</p>
                </div>
                <p className="text-[8px] text-slate-900 uppercase font-black tracking-tighter italic">Soporte Documental de Desembolso</p>
            </div>

            <div className="flex-1 w-full max-w-xl">
                {loan.documentoFirmadoUrl ? (
                    <div className="bg-white border border-emerald-500/20 p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-emerald-50 flex items-center justify-center">
                                <FileCheck size={20} className="text-emerald-600" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">CONTRATO RADICADO</p>
                                <p className="text-[8px] text-emerald-600 uppercase font-bold mt-1">✓ FIRMA VERIFICADA</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="h-9 rounded-none border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white transition-all text-[9px] font-black uppercase px-4"
                                onClick={() => onPreview(loan.documentoFirmadoUrl!)}
                            >
                                <Eye size={14} className="mr-2" /> Ver
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-9 w-9 p-0 text-slate-900 hover:text-red-500 hover:bg-red-50"
                                onClick={onDeleteRadication}
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="relative h-16 w-full">
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={onUpload}
                            accept=".pdf,.png,.jpg,.jpeg"
                        />
                        <div className="h-full border border-dashed border-slate-300 bg-white flex items-center justify-center gap-4 hover:border-emerald-500 transition-all">
                            <Upload className="h-5 w-5 text-slate-900" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-900 italic">Cargar Contrato Firmado</p>
                        </div>
                    </div>
                )}
            </div>

            <Button
                onClick={onDisburse}
                disabled={loading || !loan.documentoFirmadoUrl}
                className={`px-10 h-16 rounded-none font-black uppercase tracking-widest text-[10px] italic transition-all ${
                    loan.documentoFirmadoUrl
                        ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg"
                        : "bg-slate-200 text-slate-900 opacity-50"
                }`}
            >
                {loading ? "PROCESANDO..." : "AUTORIZAR DESEMBOLSO"}
            </Button>
        </div>
    );
}
