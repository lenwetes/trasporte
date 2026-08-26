"use client";

import { useFormContext } from "react-hook-form";
import { SignaturePad, SignaturePadRef } from "@/components/signature-pad";
import { PreoperacionalCreate } from "@/lib/validations/safety";
import { Info, PenTool, ArrowLeft, Loader2, ShieldCheck, BadgeCheck, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PreoperacionalStepThreeProps {
    prevStep: () => void;
    isSubmitting: boolean;
    signatureRef: React.RefObject<SignaturePadRef | null>;
    setSignature: (sig: string) => void;
}

export function PreoperacionalStepThree({
    prevStep,
    isSubmitting,
    signatureRef,
    setSignature,
}: PreoperacionalStepThreeProps) {
    const { register } = useFormContext<PreoperacionalCreate>();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header Identity */}
            <div className="bg-primary/[0.03] border border-primary/5 p-6 flex items-center gap-6">
                <div className="h-16 w-16 bg-primary/5 flex items-center justify-center text-slate-900 shrink-0">
                    <PenTool className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Cierre de Protocolo</h3>
                    <p className="text-2xl font-black text-primary uppercase tracking-tighter">Certificación de Inspección</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Observations Section */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                        Notas Adicionales de Bitácora
                    </label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-4 h-4 w-4 text-primary/20" />
                        <Textarea
                            {...register("observaciones")}
                            placeholder="Describa cualquier hallazgo no contemplado en la lista o detalles relevantes del entorno..."
                            className="w-full min-h-[120px] pl-10 bg-white border-2 border-primary/10 rounded-none focus-visible:border-primary transition-all text-xs font-medium"
                        />
                    </div>
                </div>

                {/* Legal / Certification Statement */}
                <div className="bg-primary p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45 pointer-events-none" />
                    <div className="flex gap-4 items-start relative z-10">
                        <BadgeCheck className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Declaración Responsable</p>
                            <p className="text-[11px] text-white leading-relaxed font-bold uppercase tracking-tight">
                                Certifico bajo gravedad de juramento que la información suministrada es verídica y que he ejecutado 
                                la inspección de acuerdo al plan estratégico de seguridad vial (PESV) de la entidad.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Signature Pad Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between pl-1">
                        <div className="flex items-center gap-2">
                            <PenTool className="h-4 w-4 text-slate-900" />
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                Firma Digital del Operador
                            </label>
                        </div>
                        <span className="text-[9px] font-black text-accent border border-accent/20 px-2 py-0.5 uppercase">Identidad Validada</span>
                    </div>
                    
                    <div className="border-2 border-primary/10 bg-white shadow-inner flex justify-center p-4">
                        <div className="max-w-full overflow-hidden">
                            <SignaturePad
                                ref={signatureRef}
                                width={500}
                                height={250}
                                onSignatureChange={setSignature}
                            />
                        </div>
                    </div>
                    <p className="text-[9px] text-muted-foreground text-center font-bold uppercase tracking-widest">
                        Utilice el mouse o pantalla táctil para realizar su rúbrica legal.
                    </p>
                </div>
            </div>

            {/* Navigation & Submission Footer */}
            <div className="pt-10 border-t border-primary/5 flex justify-between items-center bg-white sticky bottom-0 z-20 pb-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="h-12 px-6 rounded-none border-primary/10 font-bold text-xs uppercase tracking-widest text-primary/60 hover:bg-primary/5"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> REVISAR LISTA
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                        "h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-none gap-3 shadow-2xl transition-all",
                        isSubmitting && "opacity-50 grayscale"
                    )}
                >
                    {isSubmitting ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> PROCESANDO RECOLECCIÓN...</>
                    ) : (
                        <>FINALIZAR Y TRANSMITIR REPORTE <Send className="h-5 w-5" /></>
                    )}
                </Button>
            </div>
        </div>
    );
}
