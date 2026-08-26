"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ExamenMedicoCreateSchema,
    ExamenMedicoCreate,
} from "@/lib/validations/safety";
import { createExamenMedico, uploadFile } from "@/actions";
import { useState } from "react";
import { toast } from "sonner";
import { 
    Loader2, 
    FileCheck, 
    Upload, 
    Stethoscope, 
    Calendar, 
    Save,
    ShieldCheck,
    AlertCircle,
    Building2,
    FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MedicalExamFormProps {
    conductorId: string;
    onSuccess: () => void;
}

export function MedicalExamForm({
    conductorId,
    onSuccess,
}: MedicalExamFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const form = useForm<ExamenMedicoCreate>({
        resolver: zodResolver(ExamenMedicoCreateSchema),
        defaultValues: {
            conductorId,
            tipo: "PERIODICO",
            concepto: "APTO",
            fechaRealizacion: new Date(),
        },
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const result = await uploadFile(formData);

            if (result.success && result.data) {
                form.setValue("archivoId", (result.data as { id: string }).id);
                setFileName(file.name);
                toast.success("Certificado sincronizado");
            }
        } catch {
            toast.error("Fallo en la sincronización de archivos");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data: ExamenMedicoCreate) => {
        setIsSubmitting(true);
        try {
            const result = await createExamenMedico(data);
            if (result.success) {
                toast.success("Registro clínico guardado exitosamente");
                onSuccess();
            } else {
                toast.error(result.error || "Error en el registro técnico");
            }
        } catch {
            toast.error("Error de comunicación con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-1 animate-in fade-in duration-500"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">
                        Clasificaci&oacute;n de Evaluación
                    </Label>
                    <Select 
                        value={form.watch("tipo")} 
                        onValueChange={(v) => form.setValue("tipo", v as any)}
                    >
                        <SelectTrigger className="h-11 rounded-none border-primary/10 bg-slate-50/50 font-black text-xs uppercase">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none font-bold uppercase">
                            <SelectItem value="INGRESO">Ingreso (Pre-empleo)</SelectItem>
                            <SelectItem value="PERIODICO">Periódico (Control)</SelectItem>
                            <SelectItem value="EGRESO">Egreso (Retiro)</SelectItem>
                            <SelectItem value="POST_INCAPACIDAD">Post Incapacidad</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">
                        Concepto Resolutivo
                    </Label>
                    <Select 
                        value={form.watch("concepto")} 
                        onValueChange={(v) => form.setValue("concepto", v as any)}
                    >
                        <SelectTrigger className="h-11 rounded-none border-primary/10 bg-slate-50/50 font-black text-xs uppercase group">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className={cn("h-4 w-4", form.watch("concepto") === "APTO" ? "text-emerald-500" : "text-amber-500")} />
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-none font-bold uppercase">
                            <SelectItem value="APTO">APTO (SISTEMA_OK)</SelectItem>
                            <SelectItem value="APTO_CON_RESTRICCION">APTO CON RESTRICCIÓN</SelectItem>
                            <SelectItem value="NO_APTO">NO APTO (BLOQUEO)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">
                        Fecha Realización
                    </Label>
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20 group-focus-within:text-accent transition-colors" />
                        <Input
                            type="date"
                            {...form.register("fechaRealizacion")}
                            className="h-11 pl-10 rounded-none border-primary/10 bg-slate-50/50 font-black text-xs"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">
                        Siguiente Evaluación
                    </Label>
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20 group-focus-within:text-accent transition-colors" />
                        <Input
                            type="date"
                            {...form.register("fechaVencimiento")}
                            className="h-11 pl-10 rounded-none border-primary/10 bg-slate-50/50 font-black text-xs"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">
                    Centro Médico Especializado (IPS)
                </Label>
                <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20 group-focus-within:text-accent transition-colors" />
                    <Input
                        {...form.register("entidadMedica")}
                        placeholder="NOMBRE DE LA ENTIDAD PRESTADORA DE SALUD..."
                        className="h-11 pl-10 rounded-none border-primary/10 bg-slate-50/50 font-black text-xs uppercase"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">
                    Restricciones / Recomendaciones Cr&iacute;ticas
                </Label>
                <Textarea
                    {...form.register("restricciones")}
                    placeholder="Especifique requerimientos como uso de lentes, límites de carga o recomendaciones ergonómicas..."
                    className="rounded-none border-primary/10 bg-slate-50/50 font-medium text-xs min-h-[100px] resize-none focus-visible:ring-accent/20"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">
                    Resguardo Escaneado (Certificado PDF)
                </Label>
                <div className="relative">
                    <input
                        id="document-upload"
                        type="file"
                        hidden
                        accept="application/pdf,image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="document-upload"
                        className={cn(
                            "flex items-center gap-4 p-6 border-2 border-dashed transition-all duration-300 group cursor-pointer",
                            isUploading ? "bg-slate-50 border-primary/5 cursor-wait" : 
                            fileName ? "bg-emerald-50 border-emerald-200" : "bg-white border-primary/5 hover:border-accent/40"
                        )}
                    >
                        {isUploading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-primary/20" />
                        ) : fileName ? (
                            <FileCheck className="h-6 w-6 text-emerald-600" />
                        ) : (
                            <Upload className="h-6 w-6 text-primary/10 group-hover:text-accent transition-colors" />
                        )}
                        <div className="flex-1">
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                fileName ? "text-emerald-700" : "text-primary/30 group-hover:text-primary/50"
                            )}>
                                {fileName || "Haga clic para sincronizar soporte digital"}
                            </span>
                        </div>
                    </label>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full h-14 bg-primary hover:bg-primary/95 text-white rounded-none font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 gap-3 transition-all duration-300"
            >
                {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Save className="h-4 w-4 text-accent" />
                )}
                {isSubmitting ? "Sincronizando..." : "Validar y Oficializar Evaluación"}
            </Button>
        </form>
    );
}
