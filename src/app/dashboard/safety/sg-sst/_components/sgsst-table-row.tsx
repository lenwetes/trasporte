/**
 * SG-SST Table Row - Refactored with Tailwind CSS
 */
import { format, differenceInDays, isPast } from "date-fns";
import { es } from "date-fns/locale";
import {
    Clock,
    Package,
    Stethoscope,
    ShieldAlert,
    ChevronRight,
    UserCircle,
    BadgeAlert,
    CheckCircle2,
    CalendarCheck
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SGSSTUser } from "./types";
import { cn } from "@/lib/utils";

interface SGSSTTableRowProps {
    user: SGSSTUser;
}

export function SGSSTTableRow({ user }: SGSSTTableRowProps) {
    const latestExam = user.examenesMedicos?.[0];
    const latestPPE = user.entregasDotacion?.[0];

    let statusStyles = {
        text: "text-slate-600",
        bg: "bg-slate-50",
        border: "border-slate-200",
        label: "Pendiente",
        dot: "bg-slate-400",
    };

    let isExpired = false;
    let daysToWait = 0;

    if (latestExam && latestExam.fechaVencimiento) {
        const vencDate = new Date(latestExam.fechaVencimiento);
        isExpired = isPast(vencDate);
        daysToWait = differenceInDays(vencDate, new Date());

        if (isExpired) {
            statusStyles = {
                text: "text-red-700",
                bg: "bg-red-50/50",
                border: "border-red-100",
                label: "Vencido",
                dot: "bg-red-500",
            };
        } else if (daysToWait < 30) {
            statusStyles = {
                text: "text-amber-700",
                bg: "bg-amber-50/50",
                border: "border-amber-100",
                label: "Próximo",
                dot: "bg-amber-500",
            };
        } else {
            statusStyles = {
                text: "text-emerald-700",
                bg: "bg-emerald-50/50",
                border: "border-emerald-100",
                label: "Vigente",
                dot: "bg-emerald-500",
            };
        }
    }

    return (
        <tr className="hover:bg-slate-50/50 transition-colors group">
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden group-hover:border-slate-300 transition-colors">
                        <span className="text-[10px] font-black text-slate-400">
                            {(user.nombres[0] || "").toUpperCase()}
                            {(user.apellidos[0] || "").toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                            {user.nombres} {user.apellidos}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <UserCircle className="h-3 w-3" />
                            CC {user.numeroDocumento}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                {latestExam ? (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest truncate max-w-[120px]">
                                {latestExam.tipo.replace("_", " ")}
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 pl-5 uppercase">
                            {format(new Date(latestExam.fechaRealizacion), "dd MMM, yyyy", { locale: es })}
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-slate-300">
                        <BadgeAlert className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">SISTEMA SIN DATOS</span>
                    </div>
                )}
            </td>

            <td className="px-6 py-4 text-center">
                {latestExam?.fechaVencimiento ? (
                    <div className={cn(
                        "inline-flex flex-col items-center px-4 py-2 rounded-xl border w-full max-w-[140px]",
                        statusStyles.bg, statusStyles.border
                    )}>
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className={cn("h-1.5 w-1.5 rounded-full shadow-sm animate-pulse", statusStyles.dot)} />
                            <span className={cn("text-[9px] font-black uppercase tracking-[0.1em]", statusStyles.text)}>
                                {statusStyles.label}
                            </span>
                        </div>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">
                            {format(new Date(latestExam.fechaVencimiento), "dd MMM, yyyy", { locale: es })}
                        </span>
                    </div>
                ) : (
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                        <Clock className="h-4 w-4 text-slate-200" />
                    </div>
                )}
            </td>

            <td className="px-6 py-4 text-center">
                {latestExam?.fechaVencimiento ? (
                    <div>
                        {isExpired ? (
                            <span className="text-[9px] font-black bg-red-600 text-white px-2 py-1 rounded-md shadow-md shadow-red-100 uppercase tracking-widest">
                                EXPIRADO
                            </span>
                        ) : (
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest",
                                daysToWait < 30 ? "text-amber-600" : "text-emerald-600"
                            )}>
                                {daysToWait} Días
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-slate-200">--</span>
                )}
            </td>

            <td className="px-6 py-4">
                {latestPPE ? (
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-emerald-50 flex items-center justify-center rounded-lg border border-emerald-100 shadow-sm">
                            <Package className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-900 block leading-tight">
                                {format(new Date(latestPPE.fechaEntrega), "dd MMM", { locale: es })}
                            </span>
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-1">
                                <CalendarCheck className="h-2.5 w-2.5" /> Entregado
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 opacity-30 grayscale">
                        <Package className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">S/E</span>
                    </div>
                )}
            </td>

            <td className="px-6 py-4 text-right">
                <Link href={`/dashboard/safety/sg-sst/${user.id}`}>
                    <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg bg-slate-50 hover:bg-slate-900 hover:text-white transition-all group/btn">
                        <span className="text-[9px] font-black uppercase tracking-widest mr-2">Expediente</span>
                        <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </Link>
            </td>
        </tr>
    );
}

