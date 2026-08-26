"use client";

import { useState } from "react";
import type { ElementType } from "react";
import { ConductorDocumentUploadCard } from "@/app/dashboard/conductores/[id]/_components/document-upload-card";
import { UsuarioWithRelations } from "@/types";
import { DocumentPreviewModal, type PreviewArchivo } from "@/components/ui/document-preview-modal";
import { 
    FolderOpen, 
    ShieldCheck, 
    CreditCard, 
    Stethoscope, 
    Eye, 
    ChevronRight,
    FileText,
    Activity,
    Lock,
    AlertCircle,
    Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentsTabProps {
    conductor: UsuarioWithRelations;
    isAdmin: boolean;
}

const CONDUCTOR_DOC_CONFIG: Record<
    string,
    {
        label: string;
        icon: ElementType;
        color: string;
        obligatorio: boolean;
        description: string;
        categoria: string;
        sinVencimiento?: boolean;
        recomendacion?: string;
    }
> = {
    CEDULA: {
        label: "Cédula de Ciudadanía",
        icon: FileText,
        color: "#2563eb",
        obligatorio: true,
        description: "Documento de identidad (ambas caras)",
        categoria: "IDENTIFICACION",
        sinVencimiento: true,
    },
    ANTECEDENTES_POLICIA: {
        label: "Antecedentes Policía",
        icon: ShieldCheck,
        color: "#059669",
        obligatorio: true,
        description: "Certificado vigente de antecedentes judiciales",
        categoria: "ANTECEDENTES",
        sinVencimiento: true,
        recomendacion: "Expedición no mayor a 3 meses",
    },
    ANTECEDENTES_PROCURADURIA: {
        label: "Antecedentes Procuraduría",
        icon: ShieldCheck,
        color: "#059669",
        obligatorio: true,
        description: "Certificado vigente de la Procuraduría",
        categoria: "ANTECEDENTES",
        sinVencimiento: true,
        recomendacion: "Expedición no mayor a 3 meses",
    },
    ANTECEDENTES_CONTRALORIA: {
        label: "Antecedentes Contraloría",
        icon: ShieldCheck,
        color: "#059669",
        obligatorio: true,
        description: "Certificado vigente de la Contraloría",
        categoria: "ANTECEDENTES",
        sinVencimiento: true,
        recomendacion: "Expedición no mayor a 3 meses",
    },
    SEGURIDAD_SOCIAL: {
        label: "Seguridad Social",
        icon: Activity,
        color: "#e11d48",
        obligatorio: true,
        description: "Último pago de EPS, ARL y Fondos",
        categoria: "SEGURIDAD_SOCIAL",
        sinVencimiento: true,
    },
    CAPACITACION_SEGURIDAD_VIAL: {
        label: "Cursos Seguridad Vial",
        icon: FolderOpen,
        color: "#d97706",
        obligatorio: false,
        description: "Certificados de capacitaciones adicionales",
        categoria: "CAPACITACION",
        sinVencimiento: true,
    },
    MEDIDAS_CORRECTIVAS: {
        label: "Medidas Correctivas",
        icon: AlertCircle,
        color: "#eab308",
        obligatorio: true,
        description: "Certificado de medidas correctivas vigentes",
        categoria: "ANTECEDENTES",
        sinVencimiento: true,
        recomendacion: "Expedición reciente",
    },
};

export function DocumentsTab({ conductor, isAdmin }: DocumentsTabProps) {
    const [previewArchivo, setPreviewArchivo] = useState<PreviewArchivo | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isAddingCustom, setIsAddingCustom] = useState(false);
    const [customLabel, setCustomLabel] = useState("");
    const [customCardsList, setCustomCardsList] = useState<string[]>([]);

    const handleAddCustom = () => {
        if (!customLabel.trim()) return;
        const key = customLabel.toUpperCase().replace(/\s/g, "_");
        if (!customCardsList.includes(key)) {
            setCustomCardsList(prev => [...prev, key]);
        }
        setCustomLabel("");
        setIsAddingCustom(false);
    };

    const openPreview = (nombreUnico: string, label: string) => {
        setPreviewArchivo({ nombreUnico, nombreOriginal: label });
        setIsPreviewOpen(true);
    };

    // Tipo de fila que espera ConductorDocumentUploadCard
    type CertificadoRow = {
        id: string;
        nombre: string;
        categoria: string;
        creadoEn?: string | Date;
        fechaVencimiento?: string | Date | null;
        archivo?: {
            nombreUnico: string;
            nombreOriginal?: string | null;
        } | null;
        [key: string]: unknown;
    };

    const certificadosPorTipo = (conductor.certificados || []).reduce(
        (acc: Record<string, CertificadoRow[]>, certObj: unknown) => {
            const cert = certObj as CertificadoRow;
            const matchingKey = Object.keys(CONDUCTOR_DOC_CONFIG).find(
                (key) =>
                    cert.nombre.toUpperCase() === key ||
                    (cert.categoria === CONDUCTOR_DOC_CONFIG[key].categoria &&
                        cert.nombre.toUpperCase() ===
                            CONDUCTOR_DOC_CONFIG[key].label.toUpperCase()),
            );

            const key = matchingKey || cert.nombre.toUpperCase().replace(/\s/g, "_");

            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(cert);
            return acc;
        },
        {} as Record<string, CertificadoRow[]>,
    );

    const tiposOrdenados = Object.keys(CONDUCTOR_DOC_CONFIG);

    const tiposOtros = Object.keys(certificadosPorTipo).filter(
        (key) => !CONDUCTOR_DOC_CONFIG[key]
    );

    const allCustomKeys = Array.from(new Set([...tiposOtros, ...customCardsList]));

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Intel Bar: Document Context */}
            <div className="bg-emerald-900 border-b border-white/5 p-10 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex items-center gap-8">
                    <div className="h-16 w-16 bg-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl border border-white/10">
                        <FolderOpen className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter pt-1">Centro de Gestión Documental</h3>
                            {isAdmin && (
                                <Badge className="rounded-none bg-accent text-white font-black text-[9px] px-2 py-0.5 border-none">AUDITOR</Badge>
                            )}
                        </div>
                        <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                            <Lock className="h-3 w-3" /> Expediente digital unificado bajo estándares ISO 39001 & PESV
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-4 bg-white/5 p-4 backdrop-blur-sm border border-white/10">
                    <div className="text-center px-6 border-r border-white/10">
                        <p className="text-[9px] font-black text-white/30 uppercase mb-1">Cargados</p>
                        <p className="text-2xl font-black text-white">{(conductor.certificados || []).length}</p>
                    </div>
                    <div className="text-center px-6">
                        <p className="text-[9px] font-black text-white/30 uppercase mb-1">Habilitación</p>
                        <p className="text-2xl font-black text-accent uppercase">OK</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-4 py-2 border-b border-primary/5 mb-6">
                        <div className="h-1 w-8 bg-accent" />
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Documentación Requerida</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tiposOrdenados.map((tipoKey) => {
                            const config = CONDUCTOR_DOC_CONFIG[tipoKey];
                            const docs = certificadosPorTipo[tipoKey] || [];
                            return (
                                <ConductorDocumentUploadCard
                                    key={tipoKey}
                                    tipo={tipoKey}
                                    label={config.label}
                                    icon={config.icon}
                                    color={config.color}
                                    usuarioId={conductor.id}
                                    description={config.description}
                                    categoria={config.categoria}
                                    documents={docs}
                                    isAdmin={isAdmin}
                                    sinVencimiento={config.sinVencimiento}
                                    recomendacion={config.recomendacion}
                                />
                            );
                        })}
                    </div>

                    {/* CUSTOM DOCUMENTS */}
                    <div className="flex items-center justify-between py-2 border-b border-primary/5 mb-6 mt-10">
                        <div className="flex items-center gap-4">
                            <div className="h-1 w-8 bg-accent" />
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Otros Documentos Cursos y Anexos</h4>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-none border-primary/20 bg-white text-[9px] font-black uppercase tracking-widest text-primary hover:bg-slate-50 transition-colors"
                            onClick={() => setIsAddingCustom(!isAddingCustom)}
                        >
                            <Plus className="h-3 w-3 mr-2" /> Añadir Documento
                        </Button>
                    </div>

                    {isAddingCustom && (
                        <div className="p-5 bg-slate-50 border border-primary/10 mb-6 flex flex-col md:flex-row md:items-end gap-4 animate-in fade-in duration-300">
                            <div className="flex-1 space-y-1.5">
                                <label className="text-[8px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">
                                    Nombre del Nuevo Documento / Curso
                                </label>
                                <input
                                    type="text"
                                    value={customLabel}
                                    onChange={(e) => setCustomLabel(e.target.value)}
                                    placeholder="Ej: Curso de Manejo Defensivo..."
                                    className="w-full h-10 px-3 text-xs font-bold text-primary border border-primary/10 bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleAddCustom();
                                    }}
                                />
                            </div>
                            <Button
                                className="h-10 rounded-none bg-primary text-white font-black text-[9px] uppercase tracking-widest px-6"
                                onClick={handleAddCustom}
                            >
                                Crear Espacio
                            </Button>
                        </div>
                    )}

                    {(!allCustomKeys || allCustomKeys.length === 0) && !isAddingCustom ? (
                        <div className="py-10 border border-dashed border-primary/10 bg-slate-50/50 flex flex-col items-center justify-center">
                            <FileText className="h-8 w-8 text-primary/10 mb-2" />
                            <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Sin documentos adicionales</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {allCustomKeys.map((tipoKey) => {
                                const docs = certificadosPorTipo[tipoKey] || [];
                                const displayLabel = docs.length > 0 ? docs[0].nombre : tipoKey.replace(/_/g, " ");

                                return (
                                    <ConductorDocumentUploadCard
                                        key={tipoKey}
                                        tipo={tipoKey}
                                        label={displayLabel}
                                        icon={FileText}
                                        color="#3b82f6"
                                        usuarioId={conductor.id}
                                        description="Documento personalizado, curso o anexo no listado"
                                        categoria="OTRO"
                                        documents={docs}
                                        isAdmin={isAdmin}
                                        sinVencimiento={false}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Sidebar Monitoring */}
                <div className="space-y-8">
                    {/* License Status Widget */}
                    <Card className="rounded-none border-primary/10 shadow-sm overflow-hidden bg-white group">
                        <CardHeader className="bg-slate-50 py-4 border-b border-primary/5 flex flex-row items-center justify-between">
                            <CardTitle className="text-[10px] font-black text-primary/40 uppercase tracking-widest flex items-center gap-3">
                                <CreditCard className="h-4 w-4 text-emerald-600" /> Estado de Licencia
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {conductor.licencias && conductor.licencias.filter((l: { activo: boolean }) => l.activo).length > 0 ? (
                                    conductor.licencias.filter((l: { activo: boolean }) => l.activo).map((lic: { categoria: string; fechaVencimiento: Date | string; archivoId?: string | null; archivo?: { nombreUnico?: string | null } | null; [key: string]: unknown }, idx: number) => (
                                        <div key={idx} className="p-4 bg-slate-50 border border-primary/5 hover:border-accent transition-all duration-300">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-[11px] font-black text-primary uppercase">Categor&iacute;a {lic.categoria}</p>
                                                <Badge className="bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-none">VIGENTE</Badge>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                                    Vence: {new Date(lic.fechaVencimiento).toLocaleDateString()}
                                                </p>
                                                {lic.archivoId && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 hover:bg-white text-primary/30 hover:text-primary transition-all duration-300"
                                                        onClick={() => openPreview(lic.archivo?.nombreUnico ?? "", `Licencia ${lic.categoria}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center border border-dashed border-primary/10 bg-slate-50/50">
                                        <p className="text-[10px] font-black text-primary/20 uppercase tracking-widest italic">Sin licencias registradas</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medical Health Widget */}
                    <Card className="rounded-none border-primary/10 shadow-sm overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50 py-4 border-b border-primary/5 flex flex-row items-center justify-between">
                            <CardTitle className="text-[10px] font-black text-primary/40 uppercase tracking-widest flex items-center gap-3">
                                <Stethoscope className="h-4 w-4 text-emerald-600" /> Historial Médico
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {conductor.examenesMedicos && conductor.examenesMedicos.length > 0 ? (
                                    conductor.examenesMedicos.slice(0, 3).map((ex: { tipo: string; concepto: string; archivoId?: string | null; archivo?: { nombreUnico?: string | null } | null; [key: string]: unknown }, idx: number) => (
                                        <div key={idx} className="p-4 bg-slate-50 border border-primary/5 transition-all duration-300">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-[11px] font-black text-primary uppercase truncate pr-4">{ex.tipo}</p>
                                                <Badge className="bg-blue-100 text-blue-700 text-[8px] font-black rounded-none">ACTO</Badge>
                                            </div>
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary/5">
                                                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{ex.concepto}</span>
                                                {ex.archivoId && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 hover:bg-white text-primary/30 hover:text-primary transition-all duration-300"
                                                        onClick={() => openPreview(ex.archivo?.nombreUnico ?? "", `Examen ${ex.tipo}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center border border-dashed border-primary/10 bg-slate-50/50">
                                        <p className="text-[10px] font-black text-primary/20 uppercase tracking-widest italic">Sin registros médicos</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <DocumentPreviewModal
                open={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
                archivo={previewArchivo}
                label={previewArchivo?.nombreOriginal ?? "Documento"}
            />
        </div>
    );
}
