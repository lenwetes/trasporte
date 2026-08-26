"use client";

import { useState, useRef } from "react";
import { createCertificado, deleteCertificado } from "@/actions/hoja-vida";
import { CertificadoCreate } from "@/lib/validations";
import {
    DocumentPreviewModal,
    type PreviewArchivo,
} from "@/components/ui/document-preview-modal";
import { 
    FileText, 
    Upload, 
    Eye, 
    Trash2, 
    History, 
    Calendar, 
    ShieldCheck, 
    AlertCircle,
    ChevronDown,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ConductorDocumentUploadCardProps {
    tipo: string;
    label: string;
    icon: any; // Lucide Icon component
    color: string;
    usuarioId: string;
    description?: string;
    categoria: string;
    documents: {
        id: string;
        creadoEn?: Date | string;
        fechaVencimiento?: Date | string | null;
        archivo?: {
            nombreUnico: string;
            nombreOriginal?: string | null;
        } | null;
    }[];
    isAdmin: boolean;
    sinVencimiento?: boolean;
    recomendacion?: string;
}

export function ConductorDocumentUploadCard({
    label,
    icon: Icon,
    color,
    usuarioId,
    description,
    categoria,
    documents,
    isAdmin,
    sinVencimiento,
    recomendacion,
}: ConductorDocumentUploadCardProps) {
    const sortedDocs = [...documents].sort(
        (a, b) => new Date(b.creadoEn || 0).getTime() - new Date(a.creadoEn || 0).getTime(),
    );

    const currentDoc = sortedDocs[0];
    const historyDocs = sortedDocs.slice(1);

    const [isEditing, setIsEditing] = useState(!currentDoc);
    const [file, setFile] = useState<File | null>(null);
    const [fechaVencimiento, setFechaVencimiento] = useState<string>(
        currentDoc?.fechaVencimiento
            ? new Date(currentDoc.fechaVencimiento).toISOString().split("T")[0]
            : "",
    );
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [previewArchivo, setPreviewArchivo] = useState<PreviewArchivo | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isExpired =
        currentDoc?.fechaVencimiento &&
        new Date(currentDoc.fechaVencimiento) < new Date();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 10 * 1024 * 1024) {
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSave = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
            if (!uploadRes.ok) throw new Error("Error al subir archivo");
            const uploadData = await uploadRes.json();

            const certData: CertificadoCreate = {
                usuarioId,
                nombre: label,
                categoria: categoria,
                fechaVencimiento: fechaVencimiento ? new Date(`${fechaVencimiento}T12:00:00Z`) : null,
                fechaEmision: new Date(),
                archivoId: uploadData.id,
                institucion: "CARGA_DIRECTA",
            };

            const result = await createCertificado(certData);
            if (result.success) {
                toast.success("Documento cargado correctamente");
                setIsEditing(false);
                setFile(null);
            } else {
                toast.error(result.error || "No se pudo cargar el documento");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error imprevisto al procesar");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setDeleting(true);
        try {
            const result = await deleteCertificado({ id, usuarioId });
            if (result.success) {
                toast.success("Documento eliminado correctamente");
            } else {
                toast.error(result.error || "No se pudo eliminar el documento");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error imprevisto al procesar");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Card className={cn(
            "rounded-none border-primary/5 shadow-sm overflow-hidden group hover:border-primary/10 transition-all duration-300",
            isExpired && "border-red-200"
        )}>
            {/* Header Content */}
            <CardHeader className="p-5 flex flex-row items-start justify-between bg-white border-b border-primary/5">
                <div className="flex gap-4">
                    <div className="h-10 w-10 bg-slate-50 border border-primary/5 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-[11px] font-black text-primary uppercase tracking-tight leading-none pt-1">
                            {label}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                            {currentDoc ? (
                                <Badge 
                                    variant="outline" 
                                    className={cn(
                                        "rounded-none text-[8px] font-black uppercase tracking-widest px-2 py-0 border-none",
                                        sinVencimiento ? "bg-emerald-50 text-emerald-700" : (isExpired ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700")
                                    )}
                                >
                                    {sinVencimiento ? "VALIDADO" : (isExpired ? "CADUCADO" : "VIGENTE")}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="rounded-none text-[8px] font-black uppercase tracking-widest px-2 py-0 bg-slate-50 text-slate-400 border-none">FALTANTE</Badge>
                            )}
                        </div>
                        {recomendacion && !currentDoc && (
                            <p className="text-[9px] font-bold text-amber-600 uppercase mt-2 italic">
                                * {recomendacion}
                            </p>
                        )}
                    </div>
                </div>

                {!isEditing && currentDoc?.archivo && (
                    <div className="flex gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-slate-50 text-primary/30 hover:text-primary rounded-none"
                            onClick={() => {
                                setPreviewArchivo({
                                    nombreUnico: currentDoc.archivo!.nombreUnico,
                                    nombreOriginal: currentDoc.archivo!.nombreOriginal ?? label,
                                });
                                setIsPreviewOpen(true);
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:bg-red-50 text-primary/30 hover:text-red-500 rounded-none"
                                onClick={() => handleDelete(currentDoc.id)}
                                disabled={deleting}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </CardHeader>

            {/* Editing / Active State */}
            <CardContent className="p-5 bg-slate-50/50">
                {isEditing ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        {file ? (
                            <div className="border border-primary/10 bg-white p-2 relative group">
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    className="absolute -top-3 -right-3 h-6 w-6 rounded-full shadow-lg z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                                {file.type.includes("image") ? (
                                    <div className="relative h-32 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                                        <img src={URL.createObjectURL(file)} alt="Preview" className="object-contain h-full w-full" />
                                    </div>
                                ) : (
                                    <div className="h-32 w-full bg-slate-50 flex flex-col items-center justify-center text-primary/40">
                                        <FileText className="h-10 w-10 mb-2 text-accent" />
                                        <p className="text-[10px] font-black uppercase max-w-[80%] truncate text-center">{file.name}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div 
                                className="border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 bg-white group/upload border-primary/5 hover:border-accent/40"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input type="file" ref={fileInputRef} hidden accept="application/pdf,image/*" onChange={handleFileSelect} />
                                <Upload className="h-6 w-6 mx-auto mb-2 transition-colors text-primary/10 group-hover/upload:text-accent" />
                                <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest">
                                    Subir Soporte Digital
                                </p>
                            </div>
                        )}
                        
                        {!sinVencimiento && (
                            <div className="space-y-1.5">
                                <Label className="text-[8px] font-black text-primary/30 uppercase tracking-[0.2em] ml-1">Vencimiento</Label>
                                <Input 
                                    type="date" 
                                    defaultValue={fechaVencimiento} 
                                    onChange={(e) => setFechaVencimiento(e.target.value)}
                                    className="h-9 rounded-none border-primary/5 bg-white text-xs font-bold focus-visible:ring-accent/20"
                                />
                            </div>
                        )}

                        <div className="flex gap-2">
                            {currentDoc && (
                                <Button 
                                    variant="outline" 
                                    className="flex-1 h-10 rounded-none border-primary/5 text-[9px] font-black uppercase tracking-widest bg-white"
                                    onClick={() => setIsEditing(false)}
                                >
                                    DESCARTAR
                                </Button>
                            )}
                            <Button 
                                className="flex-1 h-10 rounded-none bg-primary text-white font-black text-[9px] uppercase tracking-widest gap-2 shadow-lg shadow-primary/20" 
                                onClick={handleSave} 
                                disabled={loading || !file}
                            >
                                {loading ? "..." : <><ShieldCheck className="h-3 w-3" /> GUARDAR</>}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between animate-in fade-in duration-300">
                        <div className="space-y-0.5">
                            <p className="text-[8px] font-black text-primary/20 uppercase tracking-[0.2em]">
                                {sinVencimiento ? "Estatus Permanente" : "Expiración"}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase">
                                <Calendar className="h-3 w-3 text-accent" />
                                {sinVencimiento ? "SIEMPRE VIGENTE" : (currentDoc?.fechaVencimiento ? new Date(currentDoc.fechaVencimiento).toLocaleDateString() : "INDEFINIDO")}
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 rounded-none border-primary/20 bg-slate-100 text-primary font-black text-[9px] uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-none" 
                                onClick={() => setIsEditing(true)}
                            >
                                ACTUALIZAR
                            </Button>
                            {historyDocs.length > 0 && (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 shadow-sm rounded-none border-primary/5 bg-white font-black text-[8px] uppercase tracking-widest hover:bg-slate-100 transition-all duration-300" 
                                    onClick={() => setShowHistory(true)}
                                >
                                    <History className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>

            {/* History Sheet / Overlay */}
            {showHistory && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[2000] flex justify-end animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-primary/10">
                        <div className="p-8 bg-primary text-white flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <History className="h-6 w-6 text-accent" />
                                <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white hover:bg-white/10 rounded-none h-8 w-8">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <div>
                                <h4 className="text-lg font-black uppercase tracking-tighter">Historial de Resguardo</h4>
                                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-1">{label}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-4">
                            {historyDocs.map((doc, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 border border-primary/5 relative group hover:border-accent transition-all duration-300">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black text-primary uppercase">Registro #{historyDocs.length - idx}</p>
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                                <Calendar className="h-3 w-3" /> Sincronizado: {new Date(doc.creadoEn || "").toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 bg-white border border-primary/5 text-primary/30 hover:text-primary rounded-none"
                                            onClick={() => {
                                                setPreviewArchivo({
                                                    nombreUnico: doc.archivo!.nombreUnico,
                                                    nombreOriginal: doc.archivo?.nombreOriginal ?? label,
                                                });
                                                setIsPreviewOpen(true);
                                            }}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="absolute top-0 right-0 h-1 w-0 bg-accent group-hover:w-full transition-all duration-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <DocumentPreviewModal
                open={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
                archivo={previewArchivo}
                label={label}
            />
        </Card>
    );
}
