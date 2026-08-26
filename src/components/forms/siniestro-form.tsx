"use client";

import { useSiniestroForm } from "@/hooks/use-siniestro-form";
import Image from "next/image";
import { 
    AlertTriangle, 
    Calendar, 
    MapPin, 
    ShieldAlert, 
    User, 
    Truck, 
    Camera, 
    X, 
    Plus, 
    Info, 
    Save, 
    Activity, 
    ChevronRight,
    TrendingDown,
    Map,
    FileText,
    Search,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { VehicleSelector } from "@/components/modules/fuec/vehicle-selector";
import { DriverSelector } from "@/components/modules/fuec/driver-selector";
import { Controller } from "react-hook-form";

interface Conductor {
    id: string;
    nombres: string;
    apellidos: string;
}
interface Vehiculo {
    id: string;
    placa: string;
    marca: string | null;
}

interface SiniestroFormProps {
    conductores: Conductor[];
    vehiculos: Vehiculo[];
    defaultConductorId?: string;
}

export function SiniestroForm({
    conductores,
    vehiculos,
    defaultConductorId,
}: SiniestroFormProps) {
    const {
        form: {
            register,
            control,
            formState: { errors },
        },
        isSubmitting,
        isUploading,
        fotosSubidas,
        handleFileUpload,
        removeFoto,
        onSubmit,
    } = useSiniestroForm(defaultConductorId);

    const mappedVehiculos = vehiculos.map(v => ({
        id: v.id,
        placa: v.placa,
        marca: v.marca || "",
        modelo: ""
    }));

    const mappedConductores = conductores.map(c => ({
        id: c.id,
        nombre: `${c.nombres} ${c.apellidos}`,
        documento: ""
    }));

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-12 max-w-7xl mx-auto">
            {/* SECCIÓN 1: CRITERIOS DE RIESGO (Ancho Completo) */}
            <div className="bg-white border border-slate-200 radius-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-1 bg-[var(--primary)]" />
                        <div>
                            <h4 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-800">Criterios de Riesgo Técnico</h4>
                            <p className="text-[9px] font-bold text-slate-900 uppercase tracking-widest mt-1">Identificación de Actores y Unidades</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 radius-0 bg-white">
                        ID_SECUENCIAL: <span className="text-slate-900">SGIT-772</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="p-10 lg:p-12 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <User size={16} className="text-[var(--primary)]" />
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Personal Conductor Involucrado</Label>
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
                        {errors.conductorId && <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight pl-1">{errors.conductorId.message}</p>}
                    </div>
                    
                    <div className="p-10 lg:p-12 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Truck size={16} className="text-[var(--primary)]" />
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Unidad Móvil / Placa Asociada</Label>
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
                        {errors.vehiculoId && <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight pl-1">{errors.vehiculoId.message}</p>}
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: ESPACIO Y TIEMPO */}
            <div className="bg-white border border-slate-200 radius-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center gap-4">
                    <div className="h-10 w-1 bg-red-600" />
                    <div>
                        <h4 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-800">Temporalidad & Localización</h4>
                        <p className="text-[9px] font-bold text-slate-900 uppercase tracking-widest mt-1">Contexto Geográfico y Cronológico</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                    <div className="p-10 lg:p-12 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar size={16} className="text-red-600" />
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Fecha y Hora</Label>
                        </div>
                        <Input
                            type="datetime-local"
                            {...register("fecha")}
                            className="h-16 radius-0 border-slate-200 bg-white px-6 font-black uppercase tracking-widest text-xs focus-visible:ring-1 focus-visible:ring-red-600 transition-all shadow-sm"
                        />
                        {errors.fecha && <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight">{errors.fecha.message}</p>}
                    </div>

                    <div className="p-10 lg:p-12 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <MapPin size={16} className="text-red-600" />
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Lugar del Evento</Label>
                        </div>
                        <Input
                            placeholder="DIRECCIÓN O REFERENCIA VIAL..."
                            {...register("lugar")}
                            className="h-16 radius-0 border-slate-200 bg-white px-6 font-black uppercase tracking-widest text-xs focus-visible:ring-1 focus-visible:ring-red-600 transition-all shadow-sm font-mono"
                        />
                        {errors.lugar && <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight">{errors.lugar.message}</p>}
                    </div>

                    <div className="p-10 lg:p-12 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldAlert size={16} className="text-red-600" />
                            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Nivel de Gravedad</Label>
                        </div>
                        <Controller
                            control={control}
                            name="gravedad"
                            render={({ field }) => (
                                <Select 
                                    defaultValue={field.value || "SOLO_DANOS"} 
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="h-16 radius-0 border-slate-200 bg-white px-6 font-black uppercase tracking-widest text-xs shadow-sm">
                                        <SelectValue placeholder="SELECCIONE..." />
                                    </SelectTrigger>
                                    <SelectContent className="radius-0">
                                        <SelectItem value="SOLO_DANOS" className="py-4 font-black uppercase text-xs text-blue-600">Daños Materiales</SelectItem>
                                        <SelectItem value="CON_HERIDOS" className="py-4 font-black uppercase text-xs text-amber-600">Con Lesionados</SelectItem>
                                        <SelectItem value="MORTAL" className="py-4 font-black uppercase text-xs text-red-600">Evento Mortal</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                </div>
                      {/* SECCIÓN 3: HECHOS & EVIDENCIA */}
            <div className="bg-white border border-slate-200 radius-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center gap-4">
                    <div className="h-10 w-1 bg-slate-900" />
                    <div>
                        <h4 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-800">Descripción de los Hechos</h4>
                        <p className="text-[9px] font-bold text-slate-900 uppercase tracking-widest mt-1">Relato Técnico y Evidencia Fotográfica</p>
                    </div>
                </div>
                
                <div className="p-10 lg:p-12 space-y-12">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity size={16} className="text-slate-900" />
                                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Narrativa del Evento</Label>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-900 uppercase italic">Requerido: Mín. 100 caracteres</span>
                        </div>
                        <textarea
                            rows={8}
                            {...register("reporteHechos")}
                            className="w-full radius-0 border border-slate-200 bg-white p-8 text-[14px] font-medium leading-relaxed focus:border-[var(--primary)] transition-all outline-none font-sans text-slate-700 min-h-[250px] shadow-sm placeholder:text-slate-900"
                            placeholder="Describa el evento, dinámica del impacto, condiciones de la vía, clima y otros factores relevantes..."
                        />
                        {errors.reporteHechos && <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight">{errors.reporteHechos.message}</p>}
                    </div>

                    <div className="border-t border-slate-100 pt-12">
                        <div className="flex items-center gap-3 mb-8">
                            <Camera size={16} className="text-red-600" />
                            <h4 className="text-[12px] font-black uppercase tracking-widest text-red-600">Anexo Técnico de Evidencia Visual</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {fotosSubidas.map((foto) => (
                                <div key={foto.id} className="aspect-square relative border border-slate-200 group overflow-hidden bg-slate-50 flex items-center justify-center radius-0 shadow-sm">
                                    <div className="relative w-full h-full overflow-hidden radius-0">
                                        <Image
                                            src={`/api/files/${foto.nombreUnico}`}
                                            alt="Evidencia"
                                            fill
                                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeFoto(foto.id)}
                                            className="h-10 w-10 bg-red-600 text-white flex items-center justify-center transition-transform hover:scale-110 radius-0"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                                       <label className={cn(
                                "aspect-square border border-slate-200 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 radius-0 group shadow-sm",
                                isUploading 
                                    ? "bg-slate-100 cursor-wait" 
                                    : "bg-white hover:bg-slate-50 hover:border-accent hover:-translate-y-1 hover:shadow-xl"
                            )}>
                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 size={24} className="animate-spin text-accent" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-accent italic">Cargando...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="h-10 w-10 flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all radius-0">
                                            <Plus size={18} className="group-hover:text-accent" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest mt-4 text-slate-900 group-hover:text-primary">Añadir Registro</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    multiple
                                    hidden
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* ACCIÓN FINAL (Dentro del mismo container para mayor simetría) */}
                <div className="bg-slate-900 p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="h-4 w-4 text-[var(--primary)]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">Compromiso de Veracidad</span>
                        </div>
                        <p className="text-[12px] font-medium text-slate-900 uppercase leading-relaxed tracking-wider max-w-xl italic">
                            Este reporte tiene carácter de declaración oficial. La información suministrada será auditada por el departamento jurídico y técnico de la cooperativa.
                        </p>
                    </div>
                    <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "h-20 w-full md:w-80 btn-coopetraes text-[12px] group"
                        )}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-4">
                                <Loader2 size={24} className="animate-spin text-accent" />
                                <span>Procesando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Save size={20} className="text-accent group-hover:rotate-6 transition-transform" />
                                <span>Consolidar Reporte</span>
                            </div>
                        )}
                    </Button>
                </div>
            </div>
            </div>
        </form>
    );
}
