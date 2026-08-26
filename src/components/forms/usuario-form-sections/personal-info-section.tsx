import { Calendar, MapPin, Heart, ShieldAlert } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { UsuarioFormSectionProps } from "./types";
import { COLOMBIA_DATA } from "@/lib/colombia";
import { useState, useEffect } from "react";

export function PersonalInfoSection({
    form,
    canManageRoles,
}: UsuarioFormSectionProps) {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = form;

    const lugarNacimiento = watch("lugarNacimiento") || "";
    // Separamos "Ciudad, Departamento" si existe, o asignamos todo a ciudad si no hay coma.
    const [ciudadInicial, deptoInicial] = lugarNacimiento.includes(",") 
        ? [lugarNacimiento.split(",")[0].trim(), lugarNacimiento.split(",")[1].trim()]
        : [lugarNacimiento, ""];

    const [depto, setDepto] = useState(deptoInicial);
    const [ciudad, setCiudad] = useState(ciudadInicial);

    useEffect(() => {
        // En caso de que se pase data inicial que re-actualice el form
        if (lugarNacimiento && !ciudad && !depto) {
            const [c, d] = lugarNacimiento.includes(",") ? [lugarNacimiento.split(",")[0].trim(), lugarNacimiento.split(",")[1].trim()] : [lugarNacimiento, ""];
            setCiudad(c);
            setDepto(d);
        }
    }, [lugarNacimiento]);

    const handleDeptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDepto(val);
        setValue("lugarNacimiento", val ? `${ciudad}, ${val}` : ciudad, { shouldValidate: true, shouldDirty: true });
    };

    const handleCiudadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCiudad(val);
        setValue("lugarNacimiento", depto ? `${val}, ${depto}` : val, { shouldValidate: true, shouldDirty: true });
    };

    const departamentos = COLOMBIA_DATA.map(d => d.departamento);
    
    // Si hay un departamento seleccionado valido, filtramos sus ciudades, sino mostramos todas.
    const departamentoData = COLOMBIA_DATA.find(d => d.departamento.toLowerCase() === depto.toLowerCase());
    const ciudadesDisponibles = departamentoData ? departamentoData.ciudades : COLOMBIA_DATA.flatMap(d => d.ciudades);

    return (
        <div className="bg-white p-6 md:p-8 rounded-none border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-none bg-primary/10 text-primary flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="m-0 text-lg font-black text-primary uppercase tracking-widest">
                        Perfil Biográfico
                    </h3>
                    <p className="m-0 text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Datos Personales y Estructura
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    label="Fecha de Nacimiento"
                    type="date"
                    icon={<Calendar />}
                    error={errors.fechaNacimiento?.message as string}
                    {...register("fechaNacimiento")}
                />

                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase mb-2 tracking-widest">
                        <MapPin size={14} />
                        Lugar de Origen
                    </label>
                    <div className="grid grid-cols-2 gap-2 relative">
                        <div>
                            <input
                                type="text"
                                list="departamentos-list"
                                placeholder="Departamento"
                                value={depto}
                                onChange={handleDeptoChange}
                                className="w-full h-11 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white"
                            />
                            <datalist id="departamentos-list">
                                {departamentos.map((d, i) => (
                                    <option key={`dep-${i}`} value={d} />
                                ))}
                            </datalist>
                        </div>
                        <div>
                            <input
                                type="text"
                                list="ciudades-list"
                                placeholder="Ciudad"
                                value={ciudad}
                                onChange={handleCiudadChange}
                                className="w-full h-11 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white"
                            />
                            <datalist id="ciudades-list">
                                {ciudadesDisponibles.map((c, i) => (
                                    <option key={`ciu-${i}`} value={c} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    {errors.lugarNacimiento && (
                        <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                            {errors.lugarNacimiento.message as string}
                        </p>
                    )}
                </div>

                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase mb-2 tracking-widest">
                        <Heart size={14} />
                        Estado Civil
                    </label>
                    <select
                        {...register("estadoCivil")}
                        className="w-full h-11 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white"
                    >
                        <option value="">Seleccione...</option>
                        <option value="Soltero/a">Soltero/a</option>
                        <option value="Casado/a">Casado/a</option>
                        <option value="Unión Libre">Unión Libre</option>
                        <option value="Divorciado/a">Divorciado/a</option>
                        <option value="Viudo/a">Viudo/a</option>
                    </select>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase mb-2 tracking-widest">
                        <ShieldAlert size={14} />
                        Jerarquía / Rol
                    </label>
                    <select
                        {...register("rol")}
                        disabled={!canManageRoles}
                        className="w-full h-11 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white disabled:bg-slate-50 disabled:text-slate-900"
                    >
                        <option value="ADMIN">Administrador</option>
                        <option value="SECRETARIA">Secretaria</option>
                        <option value="CONDUCTOR">Conductor</option>
                        <option value="PROPIETARIO">Propietario</option>
                    </select>
                    {!canManageRoles && (
                        <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                            Restringido: Nivel de acceso insuficiente
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
