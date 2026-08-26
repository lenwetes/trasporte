"use client";

import { useFormContext } from "react-hook-form";
import { VehiculoCreate } from "@/lib/validations";
import { VehiculoFormField } from "@/components/forms/vehiculo/vehiculo-form-field";
import { TRANSIT_OFFICES } from "@/lib/constants/fleet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransitStepProps {
    onNext: () => void;
    onBack: () => void;
    learnedData: { organismos: string[]; colores: string[] } | null;
}

export function TransitStep({ onNext, onBack, learnedData }: TransitStepProps) {
    const {
        register,
        formState: { errors },
        trigger,
        setValue
    } = useFormContext<VehiculoCreate>();

    const organismosDisponibles = Array.from(new Set([
        ...TRANSIT_OFFICES,
        ...(learnedData?.organismos || [])
    ])).sort();

    const handleNext = async () => {
        const isValid = await trigger(["propietario", "color", "cilindraje", "peso", "capacidadPuestos", "numeroMotor", "numeroChasis", "lugarExpedicion"]);
        if (isValid) onNext();
    };

    const inputClasses = "w-full h-12 px-4 border border-slate-200 bg-white focus:ring-0 focus:border-slate-900 outline-none transition-all text-sm font-medium tracking-tight placeholder:text-slate-900";

    const handleUppercase = (fieldName: keyof VehiculoCreate) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(fieldName, e.target.value.toUpperCase() as any);
    };

    const handleTabCompletion = (fieldName: keyof VehiculoCreate, suggestions: string[]) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab") {
            const val = (e.target as HTMLInputElement).value.toUpperCase();
            if (val && suggestions.length > 0) {
                const match = suggestions.find(s => s.toUpperCase().startsWith(val)) || suggestions.find(s => s.toUpperCase().includes(val));
                if (match && match.toUpperCase() !== val) {
                    setValue(fieldName, match as any);
                }
            }
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="h-10 w-10 bg-slate-50 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Datos de Tránsito y Motor</h3>
                   <p className="text-[11px] font-medium text-slate-900">Complete los campos de identificación física y legal de la unidad.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <VehiculoFormField label="Color Primario" error={errors.color}>
                    <input
                        {...register("color")}
                        list="colores-list"
                        placeholder="Color del vehículo"
                        onChange={handleUppercase("color")}
                        className={inputClasses}
                        autoComplete="off"
                    />
                    <datalist id="colores-list">
                        {(learnedData?.colores || []).map(c => <option key={c} value={c} />)}
                    </datalist>
                </VehiculoFormField>

                <VehiculoFormField label="Cilindraje (CC)" error={errors.cilindraje}>
                    <input {...register("cilindraje")} placeholder="Ej: 2400" className={inputClasses} />
                </VehiculoFormField>

                <VehiculoFormField label="Peso Bruto (Kg)" error={errors.peso}>
                    <input {...register("peso")} placeholder="Ej: 3500" className={inputClasses} />
                </VehiculoFormField>

                <VehiculoFormField label="Capacidad (Puestos)" error={errors.capacidadPuestos}>
                    <input type="number" {...register("capacidadPuestos")} className={inputClasses} />
                </VehiculoFormField>

                <VehiculoFormField label="Número de Motor" error={errors.numeroMotor}>
                    <input
                        {...register("numeroMotor")}
                        onChange={handleUppercase("numeroMotor")}
                        className={inputClasses}
                    />
                </VehiculoFormField>

                <VehiculoFormField label="Número de Chasis / Serial" error={errors.numeroChasis}>
                    <input
                        {...register("numeroChasis")}
                        onChange={handleUppercase("numeroChasis")}
                        className={inputClasses}
                    />
                </VehiculoFormField>

                <VehiculoFormField label="Organismo de Tránsito" error={errors.lugarExpedicion}>
                    <input
                        {...register("lugarExpedicion")}
                        list="transit-offices-list"
                        placeholder="Buscar oficina..."
                        onChange={handleUppercase("lugarExpedicion")}
                        onKeyDown={handleTabCompletion("lugarExpedicion", organismosDisponibles)}
                        className={inputClasses}
                        autoComplete="off"
                    />
                    <datalist id="transit-offices-list">
                        {organismosDisponibles.map(office => <option key={office} value={office} />)}
                    </datalist>
                </VehiculoFormField>

                <VehiculoFormField label="Propietario / Titular" error={errors.propietario}>
                    <input
                        {...register("propietario")}
                        onChange={handleUppercase("propietario")}
                        className={inputClasses}
                    />
                </VehiculoFormField>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
                <Button 
                    type="button" 
                    variant="outline"
                    onClick={onBack} 
                    className="h-12 rounded-none px-8 text-[10px] font-black uppercase tracking-[0.2em] gap-3 group border-slate-200"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    REVISAR ANTERIOR
                </Button>
                
                <Button
                    type="button"
                    onClick={handleNext}
                    className="h-12 rounded-none bg-slate-900 hover:bg-black px-12 text-[10px] font-black uppercase tracking-[0.2em] gap-3 group shadow-xl"
                >
                    CONTINUAR PROTOCOLO
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        </div>
    );
}
