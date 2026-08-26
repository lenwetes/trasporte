import * as React from "react";
import Image from "next/image";
import { FileText, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LicenciaSupportViewProps {
    displayFile: {
        nombreUnico?: string | null;
        creadoEn?: Date | string | null;
    } | null | undefined;
    handleDeleteSoporte: () => Promise<void>;
    isDeletingFile: boolean;
}

export function LicenciaSupportView({
    displayFile,
    handleDeleteSoporte,
    isDeletingFile,
}: LicenciaSupportViewProps) {
    if (!displayFile || !displayFile.nombreUnico) return null;

    return (
        <div className="mx-8 border border-primary/10 rounded-none overflow-hidden shadow-sm group hover:border-primary/20 transition-all">
            <div className="bg-slate-50 border-b border-primary/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />
                    <h5 className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Soporte Digital Autorizado</h5>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="rounded-none text-[9px] font-black uppercase text-primary/40">SINC: {displayFile.creadoEn ? new Date(displayFile.creadoEn).toLocaleDateString() : 'N/A'}</Badge>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDeleteSoporte}
                        disabled={isDeletingFile}
                        className="h-8 border-transparent text-red-600/60 hover:text-red-600 hover:bg-red-50 hover:border-red-100 font-black text-[9px] uppercase tracking-widest px-3 rounded-none transition-all"
                    >
                        <Trash2 className="h-3 w-3 mr-2" /> {isDeletingFile ? "ELIMINANDO..." : "Desvincular"}
                    </Button>
                </div>
            </div>
            <div className="h-[500px] w-full bg-slate-100 flex items-center justify-center p-4">
                {displayFile.nombreUnico.toLowerCase().endsWith(".pdf") ? (
                    <iframe 
                        src={`/api/files/${displayFile.nombreUnico}`} 
                        className="w-full h-full border-none shadow-inner bg-white" 
                    />
                ) : (
                    <div className="relative w-full h-full shadow-inner bg-white">
                        <Image 
                            src={`/api/files/${displayFile.nombreUnico}`} 
                            alt="Licencia" 
                            fill 
                            className="object-contain p-4" 
                            unoptimized 
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
