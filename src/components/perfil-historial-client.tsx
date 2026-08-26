"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    calculateVehicleAlerts,
    AlertLevel,
    DocumentAlert,
} from "@/lib/alerts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { History, ShieldAlert, Bell, AlertTriangle } from "lucide-react";

import { UsuarioWithRelations, VehiculoWithRelations } from "@/types";
import { ReglaAlerta } from "@prisma/client";

interface PerfilHistorialProps {
    usuario: UsuarioWithRelations;
    alertRules: ReglaAlerta[];
}

export function PerfilHistorialClient({
    usuario,
    alertRules,
}: PerfilHistorialProps) {
    interface ActiveAlert extends DocumentAlert {
        placa: string;
        rol: string;
    }

    const activeAlerts: ActiveAlert[] = [];

    // Alertas de vehículos que conduce (vinculaciones activas)
    usuario.vinculaciones?.forEach((v) => {
        if (v.vehiculo && v.vehiculo.documentos) {
            const summary = calculateVehicleAlerts(v.vehiculo as VehiculoWithRelations, alertRules);
            summary.alerts.forEach((alert) => {
                if (alert.status !== "green") {
                    activeAlerts.push({
                        ...alert,
                        placa: v.vehiculo.placa,
                        rol: "Conductor",
                    });
                }
            });
        }
    });

    // Alertas de vehículos que posee
    usuario.vehiculosPropiedad?.forEach((veh) => {
        const summary = calculateVehicleAlerts(veh as unknown as VehiculoWithRelations, alertRules);
        summary.alerts.forEach((alert) => {
            if (alert.status !== "green") {
                // Evitar duplicados si también es conductor (aunque raro)
                if (
                    !activeAlerts.some((a) => a.documentId === alert.documentId)
                ) {
                    activeAlerts.push({
                        ...alert,
                        placa: veh.placa,
                        rol: "Propietario",
                    });
                }
            }
        });
    });

    const statusColors = {
        red: "bg-red-100 text-red-700 border-red-200",
        yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
        green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };

    return (
        <div className="space-y-8">
            {/* Alarmas Activas */}
            <Card className="rounded-none border border-slate-200 shadow-sm bg-white">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-3">
                        <div className="w-8 h-8 rounded-none bg-red-100 flex items-center justify-center text-red-600">
                            <Bell className="w-4 h-4" />
                        </div>
                        Alertas y Recordatorios ({activeAlerts.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {activeAlerts.length === 0 ? (
                        <div className="text-center p-8 bg-slate-50 border border-slate-100 text-slate-900 font-bold uppercase tracking-widest text-xs">
                            No hay alarmas activas para este perfil.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeAlerts.map((alert, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-slate-200 bg-white"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="m-0 text-sm font-black text-primary uppercase tracking-widest">
                                                {alert.tipo} -{" "}
                                                <span className="text-brand">
                                                    {alert.placa}
                                                </span>
                                            </p>
                                            <p className="m-0 mt-1 text-xs font-bold text-slate-900 uppercase">
                                                Vence el{" "}
                                                {format(
                                                    new Date(
                                                        alert.fechaVencimiento,
                                                    ),
                                                    "d 'de' MMMM, yyyy",
                                                    { locale: es },
                                                )}{" "}
                                                <span className="text-red-500">({alert.daysUntilExpiry} días)</span>
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="rounded-none uppercase tracking-widest shadow-none border-red-500 text-red-600 bg-red-50 font-bold px-3 py-1 text-[10px]"
                                    >
                                        {alert.status === "red"
                                            ? "Vencido"
                                            : "Por Vencer"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-8">
                {/* Historial de Siniestros */}
                <Card className="rounded-none border border-slate-200 shadow-sm bg-white">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                        <CardTitle className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-3">
                            <div className="w-8 h-8 rounded-none bg-orange-100 flex items-center justify-center text-orange-600">
                                <ShieldAlert className="w-4 h-4" />
                            </div>
                            Historial de Siniestros
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {!usuario.siniestrosAsociados ||
                        usuario.siniestrosAsociados.length === 0 ? (
                            <div className="text-center p-8 bg-slate-50 border border-slate-100 text-slate-900 font-bold uppercase tracking-widest text-xs">
                                No registra siniestros en el sistema.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {usuario.siniestrosAsociados.map(
                                    (siniestro) => (
                                        <div
                                            key={siniestro.id}
                                            className="p-4 border border-slate-200 bg-white"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                                    {format(
                                                        new Date(
                                                            siniestro.fecha,
                                                        ),
                                                        "dd/MM/yyyy",
                                                    )}
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="rounded-none bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-widest"
                                                >
                                                    {siniestro.vehiculo
                                                        ?.placa || "N/A"}
                                                </Badge>
                                            </div>
                                            <p className="m-0 text-sm font-bold text-primary mb-1 uppercase tracking-wider">
                                                {siniestro.lugar}
                                            </p>
                                            <p className="m-0 text-xs font-medium text-slate-600 italic">
                                                &quot;{siniestro.reporteHechos}
                                                &quot;
                                            </p>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Historial de Novedades */}
                <Card className="rounded-none border border-slate-200 shadow-sm bg-white">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                        <CardTitle className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-3">
                            <div className="w-8 h-8 rounded-none bg-blue-100 flex items-center justify-center text-blue-600">
                                <History className="w-4 h-4" />
                            </div>
                            Novedades / Multas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {!usuario.novedadesAsociadas ||
                        usuario.novedadesAsociadas.length === 0 ? (
                            <div className="text-center p-8 bg-slate-50 border border-slate-100 text-slate-900 font-bold uppercase tracking-widest text-xs">
                                No registra novedades recordadas.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {usuario.novedadesAsociadas.map((novedad) => (
                                    <div
                                        key={novedad.id}
                                        className="p-4 border border-slate-200 bg-white"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-3">
                                                <Badge className="rounded-none bg-brand text-white text-[10px] uppercase font-bold tracking-widest border-none">
                                                    {novedad.tipo}
                                                </Badge>
                                                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                                    {format(
                                                        new Date(novedad.fecha),
                                                        "dd/MM/yyyy",
                                                    )}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest bg-slate-100 px-2 py-1">
                                                {novedad.estado}
                                            </span>
                                        </div>
                                        <p className="m-0 text-xs font-medium text-slate-600">
                                            {novedad.descripcion}
                                        </p>
                                        {novedad.monto && (
                                            <p className="m-0 mt-2 text-sm font-black text-primary">
                                                $
                                                {novedad.monto.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
