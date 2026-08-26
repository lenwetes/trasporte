"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition, ReactNode } from "react";
import { registerExpenseAction } from "@/actions/finance";
import { toast } from "sonner";
import { 
    Receipt, 
    DollarSign, 
    FileText, 
    Link, 
    FileUp, 
    Zap, 
    ChevronDown, 
    CheckCircle2,
    Download,
    Loader2,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { $Enums } from "@prisma/client";
const MetodoPago = $Enums.MetodoPago;
type MetodoPago = $Enums.MetodoPago;
import { PDFDownloadLink } from "@react-pdf/renderer";
import { VoucherDocument } from "../_components/voucher-document";
import { TransaccionWithRelations } from "@/types";

const schema = z.object({
    descripcion: z
        .string()
        .min(5, "La descripción debe tener al menos 5 caracteres"),
    monto: z.coerce.number().min(100, "El monto mínimo es $100"),
    categoria: z.enum(["PERSONAL", "SERVICIOS", "MANTENIMIENTO", "DIVERSOS"]),
    metodoPago: z.nativeEnum(MetodoPago),
    soporteUrl: z.string().optional(),
    terceroId: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof schema>;

interface FormConfig {
    nombreEmpresa: string;
    nit: string;
    direccion: string;
}

export function ExpenseForm() {
    const [isPending, startTransition] = useTransition();
    const [supportMode, setSupportMode] = useState<"url" | "file">("url");
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [lastTransaction, setLastTransaction] = useState<TransaccionWithRelations | null>(null);
    const [config] = useState<FormConfig>({
        nombreEmpresa: "COOPETRAES",
        nit: "900.000.000-1",
        direccion: "Sincelejo, Sucre",
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            descripcion: "",
            monto: 0,
            categoria: "DIVERSOS",
            metodoPago: MetodoPago.EFECTIVO,
            soporteUrl: "",
            terceroId: "",
        },
    });

    const onSubmit = (data: ExpenseFormValues) => {
        setLastTransaction(null);
        startTransition(async () => {
            const result = await registerExpenseAction(data);

            if (result.success && result.data) {
                toast.success("Erogación registrada exitosamente en ledger maestro.");
                setLastTransaction(result.data as TransaccionWithRelations);
                reset();
                setUploadedFileName(null);
            } else {
                toast.error(result.error || "Fallo en la sincronización del registro.");
            }
        });
    };

    const Label = ({ children, className }: { children: ReactNode, className?: string }) => (
        <label className={cn("block text-[10px] font-black text-primary/70 uppercase tracking-[0.2em] mb-2 leading-none", className)}>
            {children}
        </label>
    );

    const InputClass = "h-12 w-full rounded-none border-2 border-primary/10 bg-white px-4 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-0 transition-all placeholder:text-primary focus:shadow-[0_0_10px_rgba(0,0,0,0.05)]";

    const metodoPagoValue = watch("metodoPago");

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Maestro */}
            <div className="space-y-2 border-b-2 border-primary/5 pb-6">
                <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-accent animate-pulse" />
                    <h1 className="text-[16px] font-black text-primary uppercase tracking-[0.3em]">Registro de Egresos</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-2 border-primary/10 overflow-hidden">
                    {/* Sección A: Identificación */}
                    <div className="space-y-6 bg-slate-50/50 p-8 border-b-2 lg:border-b-0 lg:border-r-2 border-primary/10 h-full">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-[12px] font-black bg-primary text-white h-8 w-8 flex items-center justify-center tracking-tighter">01</span>
                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Identificación</span>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Concepto de Erogación</Label>
                                <div className="relative group">
                                    <FileText size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" />
                                    <input
                                        {...register("descripcion")}
                                        disabled={isPending}
                                        placeholder="EJ: PAGO SERVICIOS..."
                                        className={cn(InputClass, "pl-12")}
                                    />
                                    {errors.descripcion && <p className="text-[9px] font-black text-red-500 uppercase mt-1 tracking-widest">{errors.descripcion.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección B: Cuantía y Canal */}
                    <div className="space-y-6 p-8 border-b-2 lg:border-b-0 lg:border-r-2 border-primary/10 h-full bg-white">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-[12px] font-black bg-primary text-white h-8 w-8 flex items-center justify-center tracking-tighter">02</span>
                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Cuantía y Canal</span>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label>Monto Total ($)</Label>
                                <div className="relative group">
                                    <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={watch("monto") ? new Intl.NumberFormat("es-CO").format(watch("monto")) : ""}
                                        onChange={(e) => {
                                            const val = Number(e.target.value.replace(/\D/g, ""));
                                            setValue("monto", val, { shouldValidate: true });
                                        }}
                                        disabled={isPending}
                                        className={cn(InputClass, "pl-12 text-[16px] text-emerald-600")}
                                    />
                                    {errors.monto && <p className="text-[9px] font-black text-red-500 uppercase mt-1 tracking-widest">{errors.monto.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Canal de Fondos</Label>
                                <div className="relative group">
                                    <Receipt size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" />
                                    <select
                                        {...register("metodoPago")}
                                        disabled={isPending}
                                        className={cn(InputClass, "pl-12 appearance-none cursor-pointer")}
                                    >
                                        <option value={MetodoPago.EFECTIVO}>Caja General</option>
                                        <option value={MetodoPago.TRANSFERENCIA}>Bancos / QR</option>
                                        <option value={MetodoPago.CHEQUE}>Título Valor</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección C: Soporte y Evidencia */}
                    <div className="p-8 bg-primary/[0.03] h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[12px] font-black bg-primary text-white h-8 w-8 flex items-center justify-center tracking-tighter">03</span>
                                <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Soporte</h3>
                            </div>
                            <div className="flex bg-white ring-1 ring-primary/10">
                                <button 
                                    type="button"
                                    onClick={() => setSupportMode("url")}
                                    className={cn(
                                        "px-4 py-2 text-[8px] font-black uppercase tracking-widest transition-all",
                                        supportMode === "url" ? "bg-primary text-white shadow-lg" : "text-primary/60 hover:text-primary"
                                    )}
                                >
                                    <Link size={10} className="inline mr-2" /> URL
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setSupportMode("file")}
                                    className={cn(
                                        "px-4 py-2 text-[8px] font-black uppercase tracking-widest transition-all",
                                        supportMode === "file" ? "bg-primary text-white shadow-lg" : "text-primary/60 hover:text-primary"
                                    )}
                                >
                                    <FileUp size={10} className="inline mr-2" /> Digital
                                </button>
                            </div>
                        </div>

                        {supportMode === "url" ? (
                            <div className="relative group animate-in slide-in-from-left-2 duration-300">
                                <Link size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="soporteUrl"
                                    type="text"
                                    {...register("soporteUrl")}
                                    disabled={isPending}
                                    placeholder="HTTP://SOPORTE.CATALOGO..."
                                    className={cn(InputClass, "pl-12 border-primary/30 bg-white italic lowercase tracking-tight h-14")}
                                />
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center h-14 border-2 border-dashed border-primary/20 bg-white cursor-pointer hover:bg-slate-50 transition-all group animate-in slide-in-from-right-2 duration-300 relative overflow-hidden">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setUploadedFileName(e.target.files[0].name.toUpperCase());
                                            setValue("soporteUrl", `FILE://${e.target.files[0].name}`); // Mock value
                                        }
                                    }}
                                />
                                {uploadedFileName ? (
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                        <p className="text-[9px] font-black text-primary truncate max-w-[120px]">{uploadedFileName}</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <FileUp size={14} className="text-primary/60" />
                                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Carga Digital</p>
                                    </div>
                                )}
                            </label>
                        )}
                    </div>
                </div>

                <div className="pt-6 border-t border-primary/5 flex flex-col gap-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className={cn(
                            "w-full h-14 rounded-none bg-primary text-white hover:bg-slate-900 transition-all text-[11px] font-black uppercase tracking-[0.4em] gap-4 shadow-xl shadow-primary/20",
                            isPending && "opacity-50"
                        )}
                    >
                        {isPending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Sincronizando con Ledger...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={18} className="text-accent" />
                                Consolidar Egreso Maestro
                            </>
                        )}
                    </Button>

                    {lastTransaction && (
                        <PDFDownloadLink
                            document={<VoucherDocument transaction={lastTransaction} config={config} actor={{ nombres: "ADMIN", apellidos: "OP" }} />}
                            fileName={`Comprobante_${lastTransaction.numeroComprobante || lastTransaction.id.slice(0, 8)}.pdf`}
                        >
                            {(props) => (
                                <Button
                                    type="button"
                                    className="w-full h-12 rounded-none bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-black uppercase tracking-[.2em] gap-2"
                                    disabled={props.loading}
                                >
                                    <Download size={14} />
                                    {props.loading ? "Generando PDF..." : "Descargar Soporte PDF"}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            </form>
        </div>
    );
}
