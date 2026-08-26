"use client";

import { useFormContext } from "react-hook-form";
import { VehiculoCreate } from "@/lib/validations";
import { VehiculoFormField } from "@/components/forms/vehiculo/vehiculo-form-field";
import { COLOMBIA_FLEET_DATA, VEHICLE_CLASSES, OPERATIONAL_MODALITIES } from "@/lib/constants/fleet";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TechnicalStepProps {
    onNext: () => void;
    learnedData: { marcas: string[]; modelos: Record<string, string[]> } | null;
}

export function TechnicalStep({ onNext, learnedData }: TechnicalStepProps) {
    const {
        register,
        formState: { errors },
        trigger,
        watch,
        setValue
    } = useFormContext<VehiculoCreate>();

    const watchMarca = watch("marca");
    const watchModelo = watch("modelo");
    const [modelosSugeridos, setModelosSugeridos] = useState<string[]>([]);
    const prevMarcaRef = useRef<string | undefined>(undefined);

    const marcasDisponibles = Array.from(new Set([
        ...Object.keys(COLOMBIA_FLEET_DATA),
        ...(learnedData?.marcas || [])
    ])).sort();

    useEffect(() => {
        if (watchMarca !== prevMarcaRef.current) {
            const marcaUpper = watchMarca?.toUpperCase();
            
            if (prevMarcaRef.current !== undefined) {
                setValue("modelo", "");
                setValue("cilindraje", "");
                setValue("peso", "");
                setValue("capacidadPuestos", null);
            }

            if (marcaUpper) {
                const estatico = COLOMBIA_FLEET_DATA[marcaUpper]?.map(m => m.name) || [];
                const aprendido = learnedData?.modelos[marcaUpper] || [];
                const combinados = Array.from(new Set([...estatico, ...aprendido])).sort();
                setModelosSugeridos(combinados);
            } else {
                setModelosSugeridos([]);
            }
            
            prevMarcaRef.current = watchMarca || undefined;
        }
    }, [watchMarca, setValue]);

    useEffect(() => {
        if (watchMarca && watchModelo) {
            const marcaUpper = watchMarca.toUpperCase();
            const modeloUpper = watchModelo.toUpperCase();
            
            const modelosDeMarca = COLOMBIA_FLEET_DATA[marcaUpper];
            if (modelosDeMarca) {
                const dataModelo = modelosDeMarca.find(m => m.name === modeloUpper);
                if (dataModelo) {
                    setValue("clase", dataModelo.defaultClass as never, { shouldValidate: true });
                    if (dataModelo.defaultCC) setValue("cilindraje", dataModelo.defaultCC);
                    if (dataModelo.defaultWeight) setValue("peso", dataModelo.defaultWeight);
                    if (dataModelo.defaultSeats) setValue("capacidadPuestos", dataModelo.defaultSeats);
                }
            }
        }
    }, [watchModelo, watchMarca, setValue]);

    const handleNext = async () => {
        const isValid = await trigger(["placa", "marca", "modelo", "clase", "modalidad", "anho"]);
        if (isValid) onNext();
    };

    const inputClasses = "w-full h-12 px-4 border border-slate-200 bg-white focus:ring-0 focus:border-slate-900 outline-none transition-all text-sm font-medium tracking-tight placeholder:text-slate-900";

    const handleUppercase = (fieldName: keyof VehiculoCreate) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(fieldName, e.target.value.toUpperCase() as never);
    };

    const handleTabCompletion = (fieldName: keyof VehiculoCreate, suggestions: string[]) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab") {
            const val = (e.target as HTMLInputElement).value.toUpperCase();
            if (val && suggestions.length > 0) {
                const match = suggestions.find(s => s.startsWith(val)) || suggestions.find(s => s.includes(val));
                if (match && match !== val) {
                    setValue(fieldName, match as never);
                    e.preventDefault();
                    (e.target as HTMLInputElement).blur();
                    setTimeout(() => (e.target as HTMLInputElement).focus(), 10);
                }
            }
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="h-10 w-10 bg-slate-50 flex items-center justify-center">
                    <Info className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                   <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Identificación Técnica</h3>
                   <p className="text-[11px] font-medium text-slate-900">Ingrese los datos base registrados en la Licencia de Tránsito (Tarjeta de Propiedad).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <VehiculoFormField label="Placa" error={errors.placa}>
                    <input
                        {...register("placa")}
                        placeholder="ABC-123"
                        onChange={handleUppercase("placa")}
                        className={cn(inputClasses, "font-black uppercase tracking-widest text-emerald-600 bg-emerald-50/10 border-emerald-100")}
                    />
                </VehiculoFormField>

                <VehiculoFormField label="Marca" error={errors.marca}>
                    <input
                        {...register("marca")}
                        list="marcas-list"
                        placeholder="Buscar marca..."
                        onChange={handleUppercase("marca")}
                        onKeyDown={handleTabCompletion("marca", marcasDisponibles)}
                        onFocus={(e) => e.target.select()}
                        className={inputClasses}
                        autoComplete="off"
                    />
                    <datalist id="marcas-list">
                        {marcasDisponibles.map(marca => <option key={marca} value={marca} />)}
                    </datalist>
                </VehiculoFormField>

                <VehiculoFormField label="Modelo / Línea" error={errors.modelo}>
                    <input
                        {...register("modelo")}
                        list="modelos-list"
                        placeholder="Buscar modelo..."
                        onChange={handleUppercase("modelo")}
                        onKeyDown={handleTabCompletion("modelo", modelosSugeridos)}
                        onFocus={(e) => e.target.select()}
                        className={inputClasses}
                        autoComplete="off"
                    />
                    <datalist id="modelos-list">
                        {modelosSugeridos.map(modelo => <option key={modelo} value={modelo} />)}
                    </datalist>
                </VehiculoFormField>

                <VehiculoFormField label="Año de Fabricación" error={errors.anho}>
                    <input type="number" {...register("anho")} className={inputClasses} />
                </VehiculoFormField>

                <VehiculoFormField label="Clase de Vehículo" error={errors.clase}>
                    <select {...register("clase")} className={inputClasses}>
                        {VEHICLE_CLASSES.map(clase => <option key={clase} value={clase}>{clase}</option>)}
                    </select>
                </VehiculoFormField>

                <VehiculoFormField label="Modalidad de Operación" error={errors.modalidad}>
                    <select {...register("modalidad")} className={inputClasses}>
                        {OPERATIONAL_MODALITIES.map(mod => <option key={mod} value={mod}>{mod.replace("_", " ")}</option>)}
                    </select>
                </VehiculoFormField>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
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
