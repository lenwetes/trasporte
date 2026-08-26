"use client";

import { useState } from "react";
import { generateCV } from "@/lib/pdf-generator-cv";
import { getConfiguracionGlobal } from "@/actions";
import Link from "next/link";
import { UsuarioWithRelations } from "@/types";
import { 
    FileText, 
    Eye, 
    Edit, 
    Download, 
    Mail, 
    Phone, 
    MapPin, 
    ShieldCheck, 
    HeartPulse,
    Activity,
    UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface GeneralTabProps {
    conductor: UsuarioWithRelations;
}

interface GlobalConfig {
    nombreEmpresa?: string | null;
    colorPrimario?: string | null;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null;
    logoLocalPath?: string | null;
    logoUrl?: string | null;
}

export function GeneralTab({ conductor }: GeneralTabProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const hv = conductor.hojaVida;

    const getCVData = async () => {
        const configRes = await getConfiguracionGlobal();
        const config = configRes.success ? (configRes.data as GlobalConfig) : null;
        return {
            config,
            usuario: {
                id: conductor.id,
                nombres: conductor.nombres,
                apellidos: conductor.apellidos,
                email: conductor.email,
                telefono: conductor.telefono,
                direccion: conductor.direccion,
                numeroDocumento: conductor.numeroDocumento,
                tipoDocumento: conductor.tipoDocumento,
                fechaNacimiento: conductor.fechaNacimiento,
                lugarNacimiento: conductor.lugarNacimiento,
                estadoCivil: conductor.estadoCivil,
                municipio: conductor.municipio,
                fotoPerfil: conductor.fotoPerfil,
            },
            licencias: conductor.licencias,
            hojaVida: conductor.hojaVida,
            certificados: conductor.certificados,
            experienciasLaborales: conductor.experienciasLaborales,
            referenciasPersonales: conductor.referenciasPersonales,
        };
    };

    const handlePreview = async () => {
        setIsPreviewing(true);
        try {
            const data = await getCVData();
            const url = await generateCV(data, true);
            if (url) {
                setPreviewUrl(url as string);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsPreviewing(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = await getCVData();
            await generateCV(data, false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Intel Bar: Management Overview */}
            <div className="bg-slate-50 border-b border-primary/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="h-14 w-14 bg-white border border-primary/10 flex items-center justify-center text-primary shadow-sm">
                        <FileText className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-primary uppercase tracking-tight">Expediente Maestro</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Sincronización de Hoja de Vida y Seguridad Social</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        disabled={isPreviewing}
                        className="h-12 rounded-none border-primary/10 font-bold text-[10px] uppercase tracking-widest px-6" 
                        onClick={handlePreview}
                    >
                        {isPreviewing ? <Activity className="h-4 w-4 mr-2 text-primary/40 animate-spin" /> : <Eye className="h-4 w-4 mr-2 text-primary/40" />} 
                        {isPreviewing ? "CARGANDO..." : "Vista Previa"}
                    </Button>
                    <Link href={`/dashboard/usuarios/${conductor.id}/editar`} className="contents">
                        <Button variant="outline" className="h-12 rounded-none border-primary/10 font-bold text-[10px] uppercase tracking-widest px-6">
                            <Edit className="h-4 w-4 mr-2 text-primary/40" /> Editar Registro
                        </Button>
                    </Link>
                    <Button 
                        onClick={handleExport} 
                        disabled={isExporting}
                        className="h-12 rounded-none bg-accent hover:bg-accent/90 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-lg shadow-accent/20"
                    >
                        <Download className="h-4 w-4 mr-2" /> {isExporting ? "PROCESANDO..." : "EXPENDER PDF"}
                    </Button>
                </div>
            </div>

            <Dialog open={!!previewUrl} onOpenChange={(open) => {
                if (!open && previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }
            }}>
                <DialogContent className="max-w-4xl h-[90vh] bg-slate-50 border-primary/10 rounded-none p-0 flex flex-col pt-12">
                    <DialogHeader className="px-6 py-2 border-b border-primary/5 bg-white shrink-0">
                        <DialogTitle className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <FileText className="w-4 h-4 text-brand" /> Expediente PDF (Vista Previa)
                        </DialogTitle>
                        <DialogDescription className="sr-only">Previsualización de documento maestro del conductor</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 w-full bg-slate-100 relative">
                        {previewUrl && (
                            <iframe 
                                src={previewUrl} 
                                className="absolute inset-0 w-full h-full border-0" 
                                title="Previsualización CV"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Data Card */}
                <Card className="rounded-none border-primary/10 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-primary/5 py-4">
                        <CardTitle className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                            <UserCircle className="h-4 w-4 text-emerald-600" /> Datos de Identidad y Contacto
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <InfoRow 
                            icon={Mail} 
                            label="Correo Institucional" 
                            value={conductor.email || "NO REPORTADO"} 
                        />
                        <InfoRow 
                            icon={Phone} 
                            label="Terminal Telefónico" 
                            value={conductor.telefono || "NO DISPONIBLE"} 
                        />
                        <InfoRow 
                            icon={MapPin} 
                            label="Domicilio Registrado" 
                            value={`${conductor.municipio || "S.M."}, ${conductor.direccion || "N/A"}`} 
                        />
                    </CardContent>
                </Card>

                {/* Social Security Tracking */}
                <Card className="rounded-none border-primary/10 shadow-sm overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-primary/5 py-4">
                        <CardTitle className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Estatus de Seguridad Social
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-2 gap-6">
                            <MetricBox label="EPS" value={hv?.eps || "PENDIENTE"} />
                            <MetricBox label="ARL" value={hv?.arl || "PENDIENTE"} />
                            <MetricBox label="Fondo Pensión" value={hv?.fondoPensiones || "PENDIENTE"} />
                            <div className="bg-emerald-50 border border-emerald-100 p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-1">Grupo Sangre</span>
                                <p className="text-2xl font-black text-emerald-700">{hv?.rh || "N/A"}</p>
                            </div>
                        </div>

                        <Separator className="my-8 bg-primary/5" />

                        <div className="flex items-center gap-4 p-4 border border-dashed border-primary/10 bg-slate-50/50">
                            <HeartPulse className="h-10 w-10 text-red-600" />
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase">Validación Médica</p>
                                <p className="text-[11px] text-muted-foreground font-medium uppercase mt-1 leading-relaxed">
                                    El sujeto operativo cuenta con exámenes de aptitud vigentes cargados en la base documental.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-start gap-4 group">
            <div className="h-10 w-10 bg-slate-50 border border-primary/5 flex items-center justify-center text-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[9px] font-black text-primary/80 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-bold text-primary truncate max-w-[300px]">{value}</p>
            </div>
        </div>
    );
}

function MetricBox({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-slate-50/80 border border-primary/5 p-4 space-y-1">
            <span className="text-[9px] font-black text-primary/80 uppercase tracking-[0.1em]">{label}</span>
            <p className="text-sm font-black text-primary uppercase truncate">{value}</p>
        </div>
    );
}
