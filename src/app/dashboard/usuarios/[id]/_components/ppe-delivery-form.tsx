"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    EntregaDotacionCreateSchema,
    EntregaDotacionCreate,
} from "@/lib/validations/safety";
import { createEntregaDotacion } from "@/actions";
import { useState, useRef } from "react";
import { SignaturePad, SignaturePadRef } from "@/components/signature-pad";
import { toast } from "sonner";
import { 
    Loader2, 
    Package, 
    Plus, 
    Trash2, 
    PenTool, 
    Save, 
    ClipboardCheck, 
    ShieldCheck, 
    ChevronRight,
    Search,
    AlertCircle,
    CheckCircle2,
    Calendar
} from "lucide-react";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PPEDeliveryFormProps {
    conductorId: string;
    onSuccess: () => void;
}

export function PPEDeliveryForm({
    conductorId,
    onSuccess,
}: PPEDeliveryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signature, setSignature] = useState<string>("");
    const signaturePadRef = useRef<SignaturePadRef>(null);

    const form = useForm<EntregaDotacionCreate>({
        resolver: zodResolver(EntregaDotacionCreateSchema),
        defaultValues: {
            conductorId,
            fechaEntrega: new Date(),
            items: [{ item: "", cantidad: 1, estado: "Nuevo" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const onSubmit = async (data: EntregaDotacionCreate) => {
        if (!signature || signaturePadRef.current?.isEmpty()) {
            toast.error("Requiere firma digital del receptor");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createEntregaDotacion({
                ...data,
                firmaDigital: signature,
            });
            if (result.success) {
                toast.success("Dotación oficializada");
                onSuccess();
            } else {
                toast.error(result.error || "Error en el registro técnico");
            }
        } catch {
            toast.error("Error de comunicación institucional");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-12 p-1 pb-24 animate-in fade-in duration-500"
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-primary/5 pb-8">
                <div className="flex items-center gap-4 py-2 border-b border-primary/5">
                    <div className="h-10 w-1 bg-accent" />
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                        Par&aacute;metros de Despacho
                    </h4>
                </div>
                <div className="flex gap-4">
                    <div className="w-full md:w-48 space-y-2">
                        <Label className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">
                            Sincronizaci&oacute;n de Entrega
                        </Label>
                        <div className="relative group">
                             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary/20 transition-colors" />
                             <Input
                                type="date"
                                {...form.register("fechaEntrega")}
                                className="h-10 pl-10 rounded-none border-primary/10 bg-slate-50/50 font-black text-xs transition-all focus-visible:ring-accent/20"
                            />
                        </div>
                    </div>
                    
                    <div className="w-full md:w-48 space-y-2">
                        <Label className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">
                            Costo Contable (Egresos)
                        </Label>
                        <div className="relative group">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 font-bold">$</span>
                             <Input
                                type="number"
                                {...form.register("valorTotal", { valueAsNumber: true })}
                                placeholder="0"
                                className="h-10 pl-8 rounded-none border-primary/10 bg-slate-50/50 font-black text-xs transition-all focus-visible:ring-accent/20"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50/50 border border-primary/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-full w-2 shadow-inner bg-accent/10" />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary text-white flex items-center justify-center shadow-2xl relative">
                            <Package className="h-6 w-6" />
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-accent flex items-center justify-center text-primary font-bold text-[8px]">
                                EPP
                            </div>
                        </div>
                        <div>
                             <h3 className="text-[12px] font-black text-primary uppercase tracking-tight">
                                Elementos de Protecci&oacute;n Personal
                            </h3>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">
                                Auditor&iacute;a de dotaci&oacute;n y equipos operacionales
                            </p>
                        </div>
                    </div>
                    
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ item: "", cantidad: 1, estado: "Nuevo" })}
                        className="rounded-none h-11 border-primary/10 bg-white font-black text-[10px] uppercase tracking-widest gap-3 shadow-sm hover:bg-slate-100 transition-all duration-300"
                    >
                        <Plus className="h-4 w-4" /> A&Ntilde;ADIR ÍTEM
                    </Button>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white border border-primary/5 p-5 shadow-sm group/item flex items-center transition-all duration-300 hover:border-accent"
                        >
                            <div className="md:col-span-1 flex items-center justify-center text-primary/10 font-black text-xs">
                                #0{index + 1}
                            </div>
                            
                            <div className="md:col-span-5 space-y-2">
                                <Label className="text-[8px] font-black text-primary/30 uppercase tracking-widest uppercase ml-1">Referencia / Descripci&oacute;n</Label>
                                <Input
                                    {...form.register(`items.${index}.item`)}
                                    placeholder="NOMBRE DEL EPP / DOTACIÓN..."
                                    className="h-10 rounded-none border-primary/5 bg-slate-50/20 font-black text-xs uppercase focus-visible:ring-accent/20"
                                />
                            </div>
                            
                            <div className="md:col-span-2 space-y-2">
                                <Label className="text-[8px] font-black text-primary/30 uppercase tracking-widest uppercase ml-1">Cantidad</Label>
                                <Input
                                    type="number"
                                    {...form.register(`items.${index}.cantidad`, { valueAsNumber: true })}
                                    className="h-10 rounded-none border-primary/5 bg-slate-50/20 font-black text-xs focus-visible:ring-accent/20"
                                />
                            </div>
                            
                            <div className="md:col-span-3 space-y-2">
                                <Label className="text-[8px] font-black text-primary/30 uppercase tracking-widest uppercase ml-1">Calificaci&oacute;n</Label>
                                <Select
                                    value={form.watch(`items.${index}.estado`)}
                                    onValueChange={(v) => form.setValue(`items.${index}.estado`, v)}
                                >
                                    <SelectTrigger className="h-10 rounded-none border-primary/5 bg-slate-50/20 font-black text-xs uppercase focus:ring-accent/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none font-bold uppercase">
                                        <SelectItem value="Nuevo">NUEVO (STOCK)</SelectItem>
                                        <SelectItem value="Bueno">BUENO (FUNCIONAL)</SelectItem>
                                        <SelectItem value="Regular">REGULAR (REGLAMENTARIO)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-1 flex justify-center">
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="h-10 w-10 text-red-600/30 hover:text-red-600 hover:bg-red-50 rounded-none transition-all duration-300"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <Label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-1">
                    Notas T&eacute;cnicas de Garant&iacute;a / Observaciones
                </Label>
                <Textarea
                    {...form.register("observaciones")}
                    placeholder="Especifique tallas, marcas certificadas o registros de garantía adicionales..."
                    className="rounded-none border-primary/10 bg-slate-50/50 font-medium text-xs min-h-[100px] shadow-inner focus-visible:ring-accent/20 resize-none"
                />
            </div>

            {/* Signature Block */}
            <div className="bg-white border-2 border-primary/5 p-10 relative group">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-1 w-8 bg-primary" />
                    <h4 className="text-[12px] font-black text-primary uppercase tracking-tight flex items-center gap-2">
                        <PenTool className="h-5 w-5 text-accent" /> Consentimiento y Firma Digital Receptor
                    </h4>
                </div>
                
                <p className="text-[11px] font-medium text-muted-foreground uppercase leading-relaxed mb-10 border-l-2 border-accent/20 pl-6">
                    Al estampar su r&uacute;brica digital, el conductor certifica haber recibido satisfactoriamente los elementos descritos arriba para su uso laboral reglamentario y se compromete a su cuidado bajo normativas de SST.
                </p>
                
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-slate-50 p-4 border border-primary/5 shadow-inner relative">
                        <SignaturePad
                            ref={signaturePadRef}
                            width={400}
                            height={200}
                            onSignatureChange={setSignature}
                        />
                        {/* Decorative Guidelines */}
                        <div className="absolute top-0 right-0 h-4 w-4 border-t border-r border-primary/10" />
                        <div className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-primary/10" />
                    </div>
                    
                    <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                            signaturePadRef.current?.clear();
                            setSignature("");
                        }}
                        className="text-[9px] font-black uppercase text-primary/40 hover:text-red-500 rounded-none py-0 h-auto"
                    >
                        [ LIMPIAR REGISTRO ]
                    </Button>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 bg-primary hover:bg-black text-white rounded-none font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 gap-4 transition-all duration-300"
            >
                {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                )}
                {isSubmitting ? "OFICIALIZANDO..." : "VALIDAR Y REGISTRAR DESPACHO"}
            </Button>
        </form>
    );
}
