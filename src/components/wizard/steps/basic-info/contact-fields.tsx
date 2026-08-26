"use client";

import { useFormContext } from "react-hook-form";
import { COLOMBIA_DATA } from "@/lib/colombia";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-red-500">{message}</p>;
}

function FieldLabel({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ComponentType<{ size?: number; className?: string }> }) {
    return (
        <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">
            {Icon && <Icon size={12} className="text-brand" />}
            {children}
        </label>
    );
}

const inputCls = (error?: string) =>
    cn(
        "w-full h-11 px-3 rounded-none border text-sm bg-white transition-colors",
        "focus:outline-none focus:ring-1",
        error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-slate-200 focus:border-brand focus:ring-brand/20",
    );

// Inputs que van en MAYÚSCULAS
const inputClsUpper = (error?: string) =>
    cn(inputCls(error), "uppercase placeholder:normal-case placeholder:text-slate-900");

const departamentos = COLOMBIA_DATA.map(d => d.departamento);

export function BasicInfoContactFields() {
    const { register, setValue, watch, formState: { errors } } = useFormContext();

    // ── Municipio cascaded fields (Departamento + Ciudad) ──
    const municipioVal = (watch("municipio") as string) || "";
    const [munInicial, depInicial] = municipioVal.includes(",")
        ? [municipioVal.split(",")[0].trim(), municipioVal.split(",")[1].trim()]
        : [municipioVal, ""];

    const [depto, setDepto] = useState(depInicial);
    const [ciudad, setCiudad] = useState(munInicial);

    useEffect(() => {
        if (municipioVal && !ciudad && !depto) {
            const [c, d] = municipioVal.includes(",")
                ? [municipioVal.split(",")[0].trim(), municipioVal.split(",")[1].trim()]
                : [municipioVal, ""];
            setCiudad(c);
            setDepto(d);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [municipioVal]);

    const handleDeptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDepto(val);
        setValue("municipio", val ? `${ciudad}, ${val}` : ciudad, { shouldValidate: true, shouldDirty: true });
    };

    const handleCiudadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCiudad(val);
        setValue("municipio", depto ? `${val}, ${depto}` : val, { shouldValidate: true, shouldDirty: true });
    };

    const departamentoData = COLOMBIA_DATA.find(d => d.departamento.toLowerCase() === depto.toLowerCase());
    const ciudadesDisponibles = departamentoData ? departamentoData.ciudades : COLOMBIA_DATA.flatMap(d => d.ciudades);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <FieldLabel icon={Mail}>Email Corporativo</FieldLabel>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="Ej: juan@empresa.com"
                        tabIndex={5}
                        className={inputCls(errors.email?.message as string)}
                        autoComplete="email"
                    />
                    <FieldError message={errors.email?.message as string} />
                </div>
                <div>
                    <FieldLabel icon={Phone}>Teléfono</FieldLabel>
                    <input
                        {...register("telefono")}
                        type="tel"
                        placeholder="Ej: 3001234567"
                        tabIndex={6}
                        className={inputCls(errors.telefono?.message as string)}
                        autoComplete="tel"
                    />
                    <FieldError message={errors.telefono?.message as string} />
                </div>
            </div>

            <div>
                <FieldLabel icon={MapPin}>Dirección de Domicilio</FieldLabel>
                <input
                    {...register("direccion")}
                    placeholder="Ej: CALLE 1 # 2 - 3, BARRIO..."
                    tabIndex={7}
                    className={inputClsUpper(errors.direccion?.message as string)}
                    autoComplete="street-address"
                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.toUpperCase(); }}
                />
                <FieldError message={errors.direccion?.message as string} />
            </div>

            {/* Departamento + Ciudad con datalist */}
            <div>
                <FieldLabel icon={Globe}>Departamento / Municipio</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <input
                            type="text"
                            list="contact-wizard-deptos"
                            placeholder="Ej: SUCRE"
                            value={depto}
                            onChange={handleDeptoChange}
                            tabIndex={8}
                            className={inputClsUpper(errors.municipio?.message as string)}
                        />
                        <datalist id="contact-wizard-deptos">
                            {departamentos.map((d, i) => (
                                <option key={`wd-${i}`} value={d} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <input
                            type="text"
                            list="contact-wizard-ciudades"
                            placeholder="Ej: SINCELEJO"
                            value={ciudad}
                            onChange={handleCiudadChange}
                            tabIndex={9}
                            className={inputClsUpper(errors.municipio?.message as string)}
                        />
                        <datalist id="contact-wizard-ciudades">
                            {ciudadesDisponibles.map((c, i) => (
                                <option key={`wc-${i}`} value={c} />
                            ))}
                        </datalist>
                    </div>
                </div>
                <FieldError message={errors.municipio?.message as string} />
            </div>
        </div>
    );
}
