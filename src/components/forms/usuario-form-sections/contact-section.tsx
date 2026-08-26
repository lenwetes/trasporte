import { MapPin, Mail, Lock, Globe, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { FormField } from "@/components/ui/form-field";
import { UsuarioFormSectionProps } from "./types";
import { COLOMBIA_DATA } from "@/lib/colombia";

export function ContactSection({ form, isEdit }: UsuarioFormSectionProps) {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = form;

    const municipioVal = watch("municipio") || "";
    const [munInicial, depInicial] = municipioVal.includes(",") 
        ? [municipioVal.split(",")[0].trim(), municipioVal.split(",")[1].trim()]
        : [municipioVal, ""];

    const [depto, setDepto] = useState(depInicial);
    const [ciudad, setCiudad] = useState(munInicial);

    useEffect(() => {
        if (municipioVal && !ciudad && !depto) {
            const [c, d] = municipioVal.includes(",") ? [municipioVal.split(",")[0].trim(), municipioVal.split(",")[1].trim()] : [municipioVal, ""];
            setCiudad(c);
            setDepto(d);
        }
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

    const departamentos = COLOMBIA_DATA.map(d => d.departamento);
    const departamentoData = COLOMBIA_DATA.find(d => d.departamento.toLowerCase() === depto.toLowerCase());
    const ciudadesDisponibles = departamentoData ? departamentoData.ciudades : COLOMBIA_DATA.flatMap(d => d.ciudades);

    return (
        <div className="bg-white p-6 md:p-8 rounded-none border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-none bg-primary/10 text-primary flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="m-0 text-lg font-black text-primary uppercase tracking-widest">
                        Nodo de Contacto
                    </h3>
                    <p className="m-0 text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Ubicación y Canales Digitales
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    label="Canal Email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    icon={<Mail />}
                    error={errors.email?.message as string}
                    {...register("email")}
                />

                <FormField
                    label={
                        isEdit
                            ? "Modificar Acceso (Opcional)"
                            : "Clave de Acceso"
                    }
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock />}
                    error={errors.password?.message as string}
                    {...register("password")}
                />

                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase mb-2 tracking-widest">
                        <Globe size={14} />
                        Departamento / Municipio
                    </label>
                    <div className="grid grid-cols-2 gap-2 relative">
                        <div>
                            <input
                                type="text"
                                list="contact-departamentos-list"
                                placeholder="Departamento"
                                value={depto}
                                onChange={handleDeptoChange}
                                className="w-full h-11 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white"
                            />
                            <datalist id="contact-departamentos-list">
                                {departamentos.map((d, i) => (
                                    <option key={`c-dep-${i}`} value={d} />
                                ))}
                            </datalist>
                        </div>
                        <div>
                            <input
                                type="text"
                                list="contact-ciudades-list"
                                placeholder="Ciudad"
                                value={ciudad}
                                onChange={handleCiudadChange}
                                className="w-full h-11 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white"
                            />
                            <datalist id="contact-ciudades-list">
                                {ciudadesDisponibles.map((c, i) => (
                                    <option key={`c-ciu-${i}`} value={c} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    {errors.municipio && (
                        <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                            {errors.municipio.message as string}
                        </p>
                    )}
                </div>

                <FormField
                    label="Línea Telefónica"
                    placeholder="3001234567"
                    icon={<Phone />}
                    error={errors.telefono?.message as string}
                    {...register("telefono")}
                />

                <div className="md:col-span-2">
                    <FormField
                        label="Dirección de Residencia"
                        placeholder="Calle 1 # 2 - 3"
                        icon={<MapPin />}
                        error={errors.direccion?.message as string}
                        {...register("direccion")}
                    />
                </div>
            </div>
        </div>
    );
}
