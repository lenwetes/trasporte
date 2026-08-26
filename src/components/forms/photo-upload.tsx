"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Upload, Camera } from "lucide-react";

interface PhotoUploadProps {
    initialPhotoUrl?: string;
    onPhotoSelect: (file: File | null) => void;
    label?: string;
    className?: string;
}

export const PhotoUpload = React.memo(function PhotoUpload({
    initialPhotoUrl,
    onPhotoSelect,
    label = "Foto de Perfil",
    className,
}: PhotoUploadProps) {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(
        initialPhotoUrl || null,
    );
    // Clean up memory
    React.useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Por favor seleccione un archivo de imagen válido.");
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onPhotoSelect(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const removePhoto = () => {
        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        onPhotoSelect(null);
    };

    return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
            <div className="relative group w-32 h-32 md:w-40 md:h-40 bg-slate-50 border border-slate-200 shadow-sm cursor-pointer hover:border-brand transition-colors overflow-hidden">
                {/* 
                   NATIVE INPUT LAYER - Z-INDEX 50 
                   This must remain PURE HTML without React event handlers interfering with the click 
                */}
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50 disabled:cursor-not-allowed"
                    onChange={handleChange}
                    title="Cambiar foto"
                    accept="image/*"
                />

                {/* VISUAL LAYER - Z-INDEX 0 */}
                <div className="w-full h-full">
                    {previewUrl ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={previewUrl as string}
                                alt="Preview"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            {/* Overlay icon only visible purely by CSS to avoid JS calc */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="text-white w-8 h-8" />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-900 group-hover:text-brand transition-colors">
                            <Camera className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">
                                Subir Foto
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {previewUrl && (
                <button
                    onClick={removePhoto}
                    type="button"
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                >
                    <span className="text-red-500 font-black">X</span> Eliminar Foto
                </button>
            )}

            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest text-center">
                {label} (JPG, PNG)
            </p>
        </div>
    );
});
