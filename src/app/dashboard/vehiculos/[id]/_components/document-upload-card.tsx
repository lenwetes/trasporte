"use client";

import { useState, useRef } from "react";
import { createDocumentoVehiculo } from "@/actions/documentos";
import { DocumentoVehiculoCreate } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { SuperDeleteDocumentDialog } from "@/components/modules/fleet/super-delete-document-dialog";
import { DocumentPreviewModal } from "./document-preview-modal";
import { 
    FileText, 
    History, 
    Eye, 
    Trash2, 
    UploadCloud, 
    Save, 
    RefreshCw, 
    Calendar,
    ChevronDown,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VehicleDocument {
    id: string;
    tipo: string;
    fechaVencimiento: Date | null;
    archivo?: {
        rutaAbsoluta: string;
        nombreUnico: string;
        nombreOriginal: string;
    } | null;
    creadoEn: Date;
}

interface DocumentUploadCardProps {
    tipo: string;
    label: string;
    icon?: any;
    color: string;
    vehiculoId: string;
    description?: string;
    documents: VehicleDocument[];
}

export function DocumentUploadCard({
    tipo,
    label,
    icon,
    color,
    vehiculoId,
    description,
    documents,
}: DocumentUploadCardProps) {
    const sortedDocs = [...documents].sort(
        (a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime(),
    );

    const currentDoc = sortedDocs[0];
    const historyDocs = sortedDocs.slice(0, 3);

    const router = useRouter();
    const [isEditing, setIsEditing] = useState(!currentDoc);
    const [file, setFile] = useState<File | null>(null);
    const [fechaVencimiento, setFechaVencimiento] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<{ nombreUnico: string; nombreOriginal: string } | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState<{ id: string; label: string } | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isExpired = currentDoc?.fechaVencimiento ? new Date(currentDoc.fechaVencimiento) < new Date() : false;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error("El archivo no debe superar los 10MB");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSave = async () => {
        if (!file) { toast.error("Debes seleccionar un archivo"); return; }
        if (!fechaVencimiento) { toast.error("Debes seleccionar una fecha de vencimiento"); return; }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
            if (!uploadRes.ok) throw new Error("Error al subir archivo");
            const uploadData = await uploadRes.json();

            const docData: DocumentoVehiculoCreate = {
                vehiculoId, tipo,
                fechaVencimiento: new Date(fechaVencimiento),
                archivoId: uploadData.id,
            };

            const result = await createDocumentoVehiculo(docData);
            if (result.success) {
                toast.success("Documento cargado exitosamente");
                setIsEditing(false);
                setFile(null);
                setFechaVencimiento("");
                router.refresh();
            } else {
                toast.error(result.error || "Error al guardar documento");
            }
        } catch (error) {
            toast.error("Error inesperado al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn(
            "border rounded-none overflow-hidden transition-all duration-300 group",
            !currentDoc ? "bg-slate-50/50 border-slate-200" : isExpired ? "bg-red-50/30 border-red-100 shadow-sm shadow-red-50" : "bg-white border-slate-200 hover:shadow-lg"
        )}>
            <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className={cn(
                        "h-12 w-12 flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105",
                        !currentDoc ? "bg-white border-slate-200 text-slate-300" : isExpired ? "bg-white border-red-200 text-red-500" : "bg-white border-emerald-100 text-emerald-600"
                    )}>
                        <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1">{label}</h4>
                        {description && <p className="text-[9px] font-black uppercase text-slate-400 tracking-tight leading-tight mb-2">{description}</p>}
                        <div>
                            <Badge className={cn(
                                "rounded-none border-none text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest",
                                isExpired ? "bg-red-100 text-red-600" : currentDoc ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                            )}>
                                {isExpired ? "Expirado" : currentDoc ? "ACTIVO / VIGENTE" : "PENDIENTE"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {historyDocs.length > 0 && (
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)} 
                        className="h-8 rounded-none border border-slate-100 text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-slate-50"
                    >
                        <History className="h-3 w-3 text-slate-400" />
                        {showHistory ? "Cerrar" : `Historial (${historyDocs.length})`}
                    </Button>
                )}
            </div>

            {showHistory && (
                <div className="border-t border-slate-100 p-4 bg-slate-50/50 space-y-2 animate-in slide-in-from-top-2 duration-300">
                    {historyDocs.map((doc) => (
                        <div key={doc.id} className="p-3 bg-white border border-slate-100 flex justify-between items-center shadow-sm">
                            <div>
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Registro {new Date(doc.creadoEn).toLocaleDateString()}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    Exp: {doc.fechaVencimiento ? new Date(doc.fechaVencimiento).toLocaleDateString() : "Indefinido"}
                                </p>
                            </div>
                            <div className="flex gap-1">
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7 rounded-none hover:bg-slate-100"
                                    onClick={() => { setPreviewDoc(doc.archivo ?? null); setIsPreviewOpen(true); }}
                                >
                                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7 rounded-none hover:bg-red-50"
                                    onClick={() => { setDocToDelete({ id: doc.id, label: `${label} (${new Date(doc.creadoEn).toLocaleDateString()})` }); setDeleteDialogOpen(true); }}
                                >
                                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="px-5 pb-5">
                {isEditing ? (
                    <div className="space-y-4 pt-2">
                        <div 
                            onClick={() => fileInputRef.current?.click()} 
                            className={cn(
                                "border-2 border-dashed rounded-none p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2",
                                file ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-white hover:border-slate-300"
                            )}
                        >
                            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,image/*" onChange={handleFileSelect} />
                            {loading ? <Loader2 className="h-6 w-6 text-slate-300 animate-spin" /> : <UploadCloud className={cn("h-6 w-6", file ? "text-emerald-500" : "text-slate-300")} />}
                            <p className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                file ? "text-emerald-600" : "text-slate-400"
                            )}>
                                {file ? file.name : "Subir Soporte PDF/IMG"}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block">Vencimiento Administrativo</label>
                            <input 
                                type="date" 
                                value={fechaVencimiento} 
                                onChange={(e) => setFechaVencimiento(e.target.value)} 
                                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-none text-xs font-black uppercase tracking-tight focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                onClick={handleSave} 
                                disabled={loading || !file || !fechaVencimiento} 
                                className="flex-1 h-11 bg-slate-900 hover:bg-black text-white rounded-none text-[10px] font-black uppercase tracking-[0.15em] gap-3"
                            >
                                {loading ? "Procesando..." : <><Save className="h-4 w-4" /> Sincronizar Bóveda</>}
                            </Button>
                            {currentDoc && (
                                <Button 
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    className="h-11 rounded-none border-slate-200 text-[10px] font-black uppercase tracking-widest px-4"
                                >
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 pt-2">
                        <div 
                            onClick={() => { if (currentDoc?.archivo) { setPreviewDoc(currentDoc.archivo); setIsPreviewOpen(true); } }} 
                            className="flex items-center gap-4 p-4 bg-white border border-slate-100 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all"
                        >
                            <div className="h-8 w-8 bg-slate-50 flex items-center justify-center text-slate-400">
                                <Calendar className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Expiración</p>
                                <p className={cn(
                                    "text-[13px] font-black uppercase tracking-tighter",
                                    isExpired ? "text-red-600" : "text-slate-900"
                                )}>
                                    {currentDoc?.fechaVencimiento ? new Date(currentDoc.fechaVencimiento).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" }) : "PENDIENTE"}
                                </p>
                            </div>
                            <Eye className="h-4 w-4 text-slate-300" />
                        </div>
                        <Button 
                            variant="outline"
                            onClick={() => setIsEditing(true)} 
                            className="w-full h-11 rounded-none border-slate-200 text-[9px] font-black uppercase tracking-widest gap-3 hover:bg-slate-50"
                        >
                            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                            {isExpired ? "Sustituir por Nuevo" : "Renovación Anticipada"}
                        </Button>
                    </div>
                )}
            </div>

            {previewDoc && (
                <DocumentPreviewModal
                    open={isPreviewOpen}
                    onOpenChange={(v: boolean) => { setIsPreviewOpen(v); if (!v) setPreviewDoc(null); }}
                    archivo={previewDoc}
                    label={label}
                />
            )}

            {docToDelete && (
                <SuperDeleteDocumentDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    documentId={docToDelete.id}
                    documentLabel={docToDelete.label}
                />
            )}
        </div>
    );
}
