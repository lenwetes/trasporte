import { prisma } from "@/lib/prisma";
import {
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    MapPin,
    Truck,
    Calendar,
    User,
    Clock,
    type LucideIcon,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function ValidarFuecPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;

    const fuec = await prisma.planillaFUEC.findUnique({
        where: { tokenQR: token },
        include: {
            vehiculo: true,
            conductor1: true,
            conductor2: true,
            conductor3: true,
            contrato: true,
        },
    });

    const isValid =
        fuec &&
        fuec.estado === "ACTIVO" &&
        new Date(fuec.fechaFin) >= new Date();

    // Casting de ruta para evitar errores de tipo en runtime
    const routes = (fuec?.ruta || []) as unknown as {
        origen: string;
        destino: string;
    }[];
    const displayRuta =
        routes.length > 0
            ? `${routes[0].origen} - ${routes[routes.length - 1].destino}`
            : "N/A";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans tracking-tight">
            {/* Header / Brand */}
            <div className="w-full max-w-2xl bg-white border border-primary/10 relative shadow-2xl p-0">
                
                {/* Visual Status Bar */}
                <div 
                    className={`h-2 w-full transition-colors duration-500`} 
                    style={{ backgroundColor: isValid ? "#10b981" : "#ef4444" }} 
                />
                
                <div className="p-8 md:p-12 space-y-8">
                    {/* Header Público */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-primary/5">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-slate-50 border border-primary/5 flex items-center justify-center">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-primary uppercase tracking-tighter">Validación FUEC</h1>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] mt-1">
                                    Coopetraes SGIT / MinTransporte
                                </p>
                            </div>
                        </div>

                        {/* Status Stamp */}
                        {isValid ? (
                            <div className="flex flex-col items-end">
                                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none bg-emerald-50 px-3 py-1 border border-emerald-500/20">
                                    CERTIFICADO VIGENTE
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-end">
                                <p className="text-[10px] font-black uppercase text-red-600 tracking-widest leading-none bg-red-50 px-3 py-1 border border-red-500/20">
                                    CERTIFICADO INVÁLIDO
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Banner de Estado */}
                    <div className={`
                        p-6 border 
                        ${isValid 
                            ? "bg-emerald-50 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                            : "bg-red-50 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                        }
                    `}>
                        {isValid ? (
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 bg-white flex items-center justify-center border border-emerald-500/20 shrink-0">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-emerald-800 uppercase tracking-widest">
                                        DOCUMENTO VERIFICADO AUTÉNTICO
                                    </h2>
                                    <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-[0.1em] mt-1 max-w-[400px]">
                                        EL SISTEMA DETECTÓ ACTIVO Y CON REQUISITOS TÉCNICOS CUMPLIDOS A LA PLANILLA CONSULTADA.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 bg-white flex items-center justify-center border border-red-500/20 shrink-0">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-red-800 uppercase tracking-widest">
                                        VIOLACIÓN DE INTEGRIDAD
                                    </h2>
                                    <p className="text-[10px] font-bold text-red-600/70 uppercase tracking-[0.1em] mt-1 max-w-[400px]">
                                        DOCUMENTO FUEC ANULADO, CADUCADO O NO ENCONTRADO EN LA BASE DE DATOS CRIPTOGRÁFICA.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {fuec ? (
                        <div className="space-y-6">
                            {/* Cabecera Info */}
                            <div className="flex justify-between p-6 bg-slate-50 border border-primary/5">
                                <div>
                                    <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1">CÓDIGO SECUENCIAL FUEC</p>
                                    <p className="text-2xl font-black text-primary font-mono tracking-tighter leading-none">{fuec.consecutivo}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1">EMISIÓN VECTORIAL</p>
                                    <p className="text-xs font-bold text-primary uppercase leading-none">
                                        {format(new Date(fuec.creadoEn), "MMM d, yyyy", { locale: es })}
                                    </p>
                                </div>
                            </div>

                            {/* Detalle */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoRow
                                    icon={Truck}
                                    label="Matrícula del Vehículo"
                                    value={fuec.vehiculo.placa}
                                    subValue={`${fuec.vehiculo.marca || ""} ${fuec.vehiculo.modelo || ""}`}
                                />
                                <InfoRow
                                    icon={User}
                                    label="Primer Conductor"
                                    value={`${fuec.conductor1.nombres} ${fuec.conductor1.apellidos}`}
                                    subValue={`FOLIO #${fuec.conductor1.numeroDocumento}`}
                                />
                                <div className="sm:col-span-2">
                                    <InfoRow
                                        icon={MapPin}
                                        label="Ruta Operacional"
                                        value={displayRuta}
                                        subValue={`CONTRATO - CLIENTE: ${fuec.contrato.cliente}`}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <InfoRow
                                        icon={Calendar}
                                        label="Umbral de Caducidad"
                                        value={format(new Date(fuec.fechaFin), "PPP", { locale: es })}
                                        subValue="EXPIRACIÓN AL CORTAR EL DÍA MARÍTIMO 23:59:59"
                                        urgent={!isValid}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-primary/5 flex gap-4">
                                <AlertCircle className="h-6 w-6 text-primary/20 shrink-0" />
                                <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest leading-relaxed">
                                    LA EMISIÓN DE ESTA PLANILLA CONFIRMA QUE EN LA FECHA EXPEDIDA EL ACTIVO MÓVIL Y EL RECURSO HUMANO CUBIERTO CUMPLÍAN LAS CONDICIONES TÉCNICO-MECÁNICAS Y APROBARON CONTROL DE ALCOHOLEMIA Y ESTADO PREOPERACIONAL SGIT. MINTRENSPORTE.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4 border border-dashed border-primary/20 bg-slate-50">
                            <Clock className="h-10 w-10 text-primary/20 animate-pulse-slow" />
                            <div className="text-center space-y-1">
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                                    DATOS NO ALCANZADOS
                                </h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase max-w-[200px] leading-relaxed mx-auto">
                                    La base de datos central no reconoce el TOKEN provisto.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-950 text-white text-center py-4 border-t border-primary/10">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50">
                        © {new Date().getFullYear()} COOPETRAES PLATAFORMA CORE. PROTOCOLOS DE SEGURIDAD ACTIVOS.
                    </p>
                </div>
            </div>
        </div>
    );
}

interface InfoRowProps {
    icon: LucideIcon;
    label: string;
    value: string;
    subValue: string | null;
    urgent?: boolean;
}

function InfoRow({ icon: Icon, label, value, subValue, urgent }: InfoRowProps) {
    return (
        <div className={`p-4 border ${urgent ? 'border-red-500/20 bg-red-50/10' : 'border-primary/5 bg-slate-50'} flex gap-4 min-h-[90px]`}>
            <div className={`h-10 w-10 ${urgent ? 'bg-red-50 text-red-600' : 'bg-white text-primary/60 border border-primary/10'} flex items-center justify-center shrink-0`}>
                <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${urgent ? 'text-red-700/60' : 'text-primary/40'}`}>
                    {label}
                </p>
                <p className={`text-xs font-bold uppercase tracking-tight truncate ${urgent ? 'text-red-700' : 'text-primary'}`}>
                    {value}
                </p>
                {subValue && (
                    <p className={`text-[9px] mt-1 font-bold uppercase tracking-wider truncate ${urgent ? 'text-red-600/70' : 'text-muted-foreground'}`}>
                        {subValue}
                    </p>
                )}
            </div>
        </div>
    );
}
