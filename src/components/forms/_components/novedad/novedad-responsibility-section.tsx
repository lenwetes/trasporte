import * as React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { User, Truck, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DriverSelector } from "@/components/modules/fuec/driver-selector";
import { VehicleSelector } from "@/components/modules/fuec/vehicle-selector";
import { NovedadCreate } from "@/lib/validations";
import { MappedVehicle, MappedDriver } from "../../novedad-form.types";

interface NovedadResponsibilitySectionProps {
    control: Control<NovedadCreate>;
    mappedConductores: MappedDriver[];
    mappedVehiculos: MappedVehicle[];
    defaultConductorId?: string;
    errors: FieldErrors<NovedadCreate>;
}

export function NovedadResponsibilitySection({
    control,
    mappedConductores,
    mappedVehiculos,
    defaultConductorId,
    errors,
}: NovedadResponsibilitySectionProps) {
    return (
        <div className="bg-white border border-primary/10 shadow-sm radius-0 overflow-hidden relative group transition-all hover:border-primary/20">
            <div className="bg-white border-b border-primary/5 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-1 bg-primary" />
                    <div>
                        <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-primary">Criterios de Responsabilidad</h4>
                        <p className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1 italic">Vínculo de Actores y Unidades Móviles</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <span className="font-mono text-[9px] font-black uppercase tracking-widest text-primary">REF: PESV-001</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-primary/5">
                <div className="p-10 lg:p-14 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-6 w-6 flex items-center justify-center bg-primary/5 text-primary">
                            <User size={14} />
                        </div>
                        <Label className="text-[12px] font-black uppercase tracking-[0.2em] text-primary/60">Responsable / Conductor</Label>
                    </div>
                    <Controller
                        control={control}
                        name="conductorId"
                        render={({ field }) => (
                            <DriverSelector
                                label=""
                                initialDrivers={mappedConductores}
                                value={field.value || ""}
                                onChange={field.onChange}
                                disabled={!!defaultConductorId}
                                description={mappedConductores.find(c => c.id === field.value)?.nombre}
                            />
                        )}
                    />
                    {defaultConductorId && (
                        <div className="bg-emerald-50 p-4 border-l-4 border-emerald-500">
                            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter italic flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3" /> Reporte asignado automáticamente a su credencial activa.
                            </p>
                        </div>
                    )}
                    {errors.conductorId && <p className="text-[10px] text-red-600 font-black uppercase tracking-tight pl-1 select-none">{errors.conductorId.message}</p>}
                </div>
                
                <div className="p-10 lg:p-14 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-6 w-6 flex items-center justify-center bg-primary/5 text-primary">
                            <Truck size={14} />
                        </div>
                        <Label className="text-[12px] font-black uppercase tracking-[0.2em] text-primary/60">Vehículo / Unidad Móvil</Label>
                    </div>
                    <Controller
                        control={control}
                        name="vehiculoId"
                        render={({ field }) => (
                            <VehicleSelector
                                vehicles={mappedVehiculos}
                                value={field.value || ""}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.vehiculoId && <p className="text-[10px] text-red-600 font-black uppercase tracking-tight pl-1 select-none">{errors.vehiculoId.message}</p>}
                </div>
            </div>
        </div>
    );
}
