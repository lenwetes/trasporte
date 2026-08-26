import Image from "next/image";
import { UsuarioWithRelations } from "@/types";
import { cn } from "@/lib/utils";

export function CVHeader({ usuario }: { usuario: UsuarioWithRelations }) {
    const defaultImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    
    return (
        <div className="border border-slate-900 grid grid-cols-12 mb-10 print:mb-6">
            {/* Logo Section */}
            <div className="col-span-3 border-r border-slate-900 p-6 flex flex-col items-center justify-center gap-4 bg-slate-50">
                <div className="relative w-32 h-32 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group">
                    {usuario.fotoPerfil ? (
                        <Image
                            src={`/api/files/${usuario.fotoPerfil.nombreUnico}`}
                            alt="Foto Perfil"
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all"
                            priority
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                            FOTO_MISSING
                        </div>
                    )}
                </div>
                <div className="text-[14px] font-black lowercase tracking-widest text-slate-900 border-b-2 border-brand pb-1">
                    COOPETRAES
                </div>
            </div>

            {/* Title Section */}
            <div className="col-span-6 border-r border-slate-900 p-8 flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-slate-900 leading-tight">
                    Gestión de Talento Humano
                </h1>
                <div className="h-1 w-20 bg-brand mt-4 mb-2" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.5em] text-cyan-600">
                    Modelo Hoja de Vida
                </h2>
            </div>

            {/* Control Info Section */}
            <div className="col-span-3 p-6 flex flex-col justify-center gap-3">
                <TechnicalTag label="CÓDIGO" value="TH-FTO-002" />
                <TechnicalTag label="VERSIÓN" value="01" />
                <TechnicalTag label="VIGENCIA" value="2026_EST" />
                <TechnicalTag label="ESTADO" value="DIGITAL_SIG" color="text-emerald-600" />
            </div>
        </div>
    );
}

function TechnicalTag({ label, value, color }: { label: string; value: string; color?: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 tracking-widest uppercase">{label}</span>
            <span className={cn("text-[11px] font-black text-slate-900 tracking-wider uppercase", color)}>{value}</span>
        </div>
    );
}
