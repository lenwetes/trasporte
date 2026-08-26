"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SignatureViewer } from "@/components/signature-viewer";
import { generateSafetyArchive, ExpedienteData } from "@/lib/archive-generator";
import { getExpedienteDigital, getEntregaDotacionById } from "@/actions/safety";
import { generateEntregaDotacionPDF } from "@/lib/pdf-generator-safety";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { MedicalExamForm } from "./medical-exam-form";
import { PPEDeliveryForm } from "./ppe-delivery-form";
import { 
    Download, 
    Stethoscope, 
    ShieldCheck, 
    Package, 
    Plus, 
    FileDown, 
    AlertCircle, 
    ChevronRight,
    Activity,
    ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export type ExamenMedicoDisplay = {
    id: string;
    tipo: string;
    fechaRealizacion: Date | string;
    concepto: string;
    restricciones?: string | null;
    archivoId?: string | null;
    archivo?: { nombreUnico: string } | null;
};

export type EntregaDotacionDisplay = {
    id: string;
    fechaEntrega: Date | string;
    items: Array<{ item: string; cantidad: number; estado: string }>;
    observaciones?: string | null;
    firmaDigital?: string | null;
};

interface SafetySectionClientProps {
    conductorId: string;
    conductorNombre: string;
    initialExamenes: ExamenMedicoDisplay[];
    initialEntregas: EntregaDotacionDisplay[];
    isAdmin: boolean;
    companyConfig?: import("@prisma/client").ConfiguracionGlobal | null;
}

export function SafetySectionClient({
    conductorId,
    conductorNombre,
    initialExamenes,
    initialEntregas,
    isAdmin,
    companyConfig,
}: SafetySectionClientProps) {
    const router = useRouter();
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadingItems, setDownloadingItems] = useState<Record<string, boolean>>({});

    // States for New Record Modals
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [isPPEModalOpen, setIsPPEModalOpen] = useState(false);

    const handleDownloadPPE = async (id: string) => {
        setDownloadingItems((prev) => ({ ...prev, [id]: true }));
        try {
            const res = await getEntregaDotacionById(id);
            if (res.success && res.data) {
                await generateEntregaDotacionPDF({
                    ...res.data,
                    config: companyConfig,
                } as import("@/lib/pdf-generator-safety").EntregaDotacionPDFData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDownloadingItems((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleDownloadExpediente = async () => {
        setIsDownloading(true);
        try {
            const res = await getExpedienteDigital(conductorId);
            if (res.success && res.data) {
                await generateSafetyArchive(
                    conductorNombre,
                    res.data as ExpedienteData,
                    companyConfig,
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Consolidated Export Banner */}
            <div className="bg-primary/95 backdrop-blur-sm border border-primary/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/5 to-transparent skew-x-12 transform translate-x-32" />
                
                <div className="relative z-10 flex items-center gap-6">
                    <div className="h-14 w-14 bg-white/10 flex items-center justify-center border border-white/5">
                        <FileDown className="h-7 w-7 text-accent" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-1">
                            Expediente Digital Consolidado
                        </h4>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest max-w-md">
                            Generaci&oacute;n de archivo maestro con ex&aacute;menes m&eacute;dicos, actas de dotaci&oacute;n y certificaciones validadas.
                        </p>
                    </div>
                </div>

                {isAdmin && (
                    <Button 
                        onClick={handleDownloadExpediente}
                        disabled={isDownloading}
                        className="relative z-10 h-12 rounded-none bg-white text-primary hover:bg-slate-100 font-black text-[10px] uppercase tracking-widest px-8 shadow-2xl transition-all duration-300"
                    >
                        {isDownloading ? (
                            <span className="flex items-center gap-2">
                                <Activity className="h-4 w-4 animate-pulse" /> Sincronizando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Download className="h-4 w-4" /> Descargar Todo
                            </span>
                        )}
                    </Button>
                )}
            </div>

            <Tabs defaultValue="examenes" className="w-full">
                <TabsList className="bg-transparent h-auto p-0 gap-6 mb-10 border-b border-primary/5 w-full justify-start rounded-none">
                    <TabsTrigger 
                        value="examenes"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-2 p-4 text-xs font-black uppercase tracking-widest text-muted-foreground data-[state=active]:text-primary transition-all duration-300"
                    >
                        <Stethoscope className="h-4 w-4 mr-2" /> Medicina Preventiva
                    </TabsTrigger>
                    <TabsTrigger 
                        value="dotacion"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-2 p-4 text-xs font-black uppercase tracking-widest text-muted-foreground data-[state=active]:text-primary transition-all duration-300"
                    >
                        <Package className="h-4 w-4 mr-2" /> Dotaci&oacute;n & EPP
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="examenes" className="mt-0 space-y-8 animate-in fade-in duration-300">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-primary/5 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-1 bg-accent" />
                            <div>
                                <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Registro Cronol&oacute;gico</h4>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Historial cl&iacute;nico ocupacional validado</p>
                            </div>
                        </div>
                        {isAdmin && (
                            <Button 
                                variant="outline" 
                                className="rounded-none border-primary/10 h-10 font-bold text-[9px] uppercase tracking-widest gap-2 bg-slate-50 hover:bg-primary hover:text-white transition-all duration-300"
                                onClick={() => setIsExamModalOpen(true)}
                            >
                                <Plus className="h-3 w-3" /> Registrar Examen
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {initialExamenes.length > 0 ? (
                            initialExamenes.map((exam) => (
                                <Card key={exam.id} className="rounded-none border-primary/5 shadow-sm hover:border-emerald-200 transition-all duration-300 group">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-black text-primary uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                                                    {exam.tipo.replace("_", " ")}
                                                </p>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                                    <ChevronRight className="h-2 w-2 text-accent" /> Realizado el {format(new Date(exam.fechaRealizacion), "PP", { locale: es })}
                                                </p>
                                            </div>
                                            <Badge className="rounded-none bg-emerald-50 text-emerald-700 border-emerald-100 text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                                                {exam.concepto.replace(/_/g, " ")}
                                            </Badge>
                                        </div>
                                        
                                        {exam.restricciones ? (
                                            <div className="p-4 bg-amber-50/50 border-l-2 border-amber-400 flex items-start gap-4">
                                                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-amber-800 uppercase tracking-widest">Restricciones / Observaciones</p>
                                                    <p className="text-[10px] text-amber-900 leading-relaxed font-medium">{exam.restricciones}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-emerald-50/30 border-l-2 border-emerald-400 flex items-center gap-4 text-emerald-800">
                                                <ShieldCheck className="h-4 w-4 shrink-0" />
                                                <p className="text-[10px] font-bold uppercase tracking-widest">Sin restricciones operativas</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-24 border border-dashed border-primary/10 bg-slate-50/50 flex flex-col items-center justify-center space-y-4">
                                <div className="h-16 w-16 bg-white border border-primary/5 flex items-center justify-center text-primary/10">
                                    <Stethoscope className="h-8 w-8" />
                                </div>
                                <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em]">Sin ex&aacute;menes registrados</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="dotacion" className="mt-0 space-y-8 animate-in fade-in duration-300">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-primary/5 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-1 bg-accent" />
                            <div>
                                <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Reporte de Entregas de EPP</h4>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Seguimiento de equipo de protecci&oacute;n personal</p>
                            </div>
                        </div>
                        {isAdmin && (
                            <Button 
                                variant="outline" 
                                className="rounded-none border-primary/10 h-10 font-bold text-[9px] uppercase tracking-widest gap-2 bg-slate-50 hover:bg-primary hover:text-white transition-all duration-300"
                                onClick={() => setIsPPEModalOpen(true)}
                            >
                                <Plus className="h-3 w-3" /> Nueva Entrega
                            </Button>
                        )}
                    </div>

                    <div className="space-y-10">
                        {initialEntregas.length > 0 ? (
                            initialEntregas.map((entrega) => (
                                <Card key={entrega.id} className="rounded-none border-none shadow-none bg-transparent">
                                    <CardHeader className="p-0 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-primary text-white flex items-center justify-center relative shadow-xl">
                                                <ClipboardCheck className="h-6 w-6" />
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-accent flex items-center justify-center text-primary font-bold text-[8px]">
                                                    ID
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-primary uppercase tracking-tight">Acta de Entrega N&deg; {entrega.id.slice(-6).toUpperCase()}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sincronizado: {format(new Date(entrega.fechaEntrega), "PP", { locale: es })}</p>
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={() => handleDownloadPPE(entrega.id)}
                                            disabled={downloadingItems[entrega.id]}
                                            size="sm"
                                            className="rounded-none h-11 bg-slate-100 hover:bg-accent hover:text-white text-primary font-black text-[10px] uppercase tracking-widest border border-primary/5 px-8 transition-all duration-300"
                                        >
                                            {downloadingItems[entrega.id] ? "GENERANDO..." : "EXPEDIR PDF"}
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {Array.isArray(entrega.items) && entrega.items.map((item, idx) => (
                                                    <div key={idx} className="p-4 bg-white border border-primary/5 flex items-center justify-between group hover:border-accent transition-all duration-300">
                                                        <div>
                                                            <p className="text-[10px] font-black text-primary uppercase tracking-tight">{item.item}</p>
                                                            <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">SST-VALIDADO</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[14px] font-black text-primary">{item.cantidad}</p>
                                                            <p className="text-[8px] font-black text-accent uppercase">{item.estado}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {entrega.observaciones && (
                                                <div className="p-4 bg-slate-50 border-l-2 border-primary/10 italic text-[11px] text-muted-foreground leading-relaxed">
                                                    {entrega.observaciones}
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-slate-50 border border-primary/5 p-6 flex flex-col items-center justify-center space-y-4 min-h-[160px]">
                                            {entrega.firmaDigital ? (
                                                <div className="w-full space-y-4">
                                                    <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em] text-center border-b border-primary/5 pb-2">Validaci&oacute;n Digital</p>
                                                    <div className="bg-white p-2 border border-primary/5 shadow-inner">
                                                        <SignatureViewer 
                                                            signatureData={entrega.firmaDigital} 
                                                            label="FIRMA RECEPCI&Oacute;N" 
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center opacity-25 grayscale scale-75">
                                                    <AlertCircle className="h-8 w-8 mb-2 mx-auto" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">Sin firma digital</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <div className="my-10 border-b border-primary/5 border-dashed" />
                                </Card>
                            ))
                        ) : (
                            <div className="py-24 border border-dashed border-primary/10 bg-slate-50/50 flex flex-col items-center justify-center space-y-4">
                                <div className="h-16 w-16 bg-white border border-primary/5 flex items-center justify-center text-primary/10">
                                    <Package className="h-8 w-8" />
                                </div>
                                <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em]">Sin registros de dotaci&oacute;n</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Modal de Registro: Examen Médico */}
            <Dialog open={isExamModalOpen} onOpenChange={setIsExamModalOpen}>
                <DialogContent className="max-w-2xl max-h-[95vh] p-0 rounded-none border-none flex flex-col overflow-hidden bg-white shadow-2xl">
                    <div className="bg-primary p-8 text-white">
                        <DialogHeader className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-accent text-primary flex items-center justify-center font-black text-xl shadow-lg">
                                    M
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-black uppercase tracking-tighter">Evaluación Médica Operacional</DialogTitle>
                                    <DialogDescription className="text-white/40 font-bold uppercase text-[9px] tracking-widest mt-1">
                                        Registro oficial de aptitud física y medicina del trabajo
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>
                    <div className="p-10 overflow-y-auto flex-1">
                        <MedicalExamForm 
                            conductorId={conductorId} 
                            onSuccess={() => {
                                setIsExamModalOpen(false);
                                router.refresh();
                            }} 
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal de Registro: Entrega Dotación */}
            <Dialog open={isPPEModalOpen} onOpenChange={setIsPPEModalOpen}>
                <DialogContent className="max-w-4xl max-h-[95vh] p-0 rounded-none border-none flex flex-col overflow-hidden bg-white shadow-2xl">
                    <div className="bg-primary p-8 text-white">
                        <DialogHeader className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-accent text-primary flex items-center justify-center font-black text-xl shadow-lg">
                                    D
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-black uppercase tracking-tighter">Acta de Entrega: Dotación & EPP</DialogTitle>
                                    <DialogDescription className="text-white/40 font-bold uppercase text-[9px] tracking-widest mt-1">
                                        Control de inventario y resguardo oficial con firma digital
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>
                    <div className="p-10 overflow-y-auto flex-1">
                        <PPEDeliveryForm 
                            conductorId={conductorId} 
                            onSuccess={() => {
                                setIsPPEModalOpen(false);
                                router.refresh();
                            }} 
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
