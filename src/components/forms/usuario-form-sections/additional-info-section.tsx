import {
    BriefcaseMedical,
    Heart,
    ShieldPlus,
    Contact,
    Zap,
    FileText,
    Phone,
} from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { UsuarioFormSectionProps } from "./types";

export function AdditionalInfoSection({ form }: UsuarioFormSectionProps) {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <div className="bg-white p-6 md:p-8 rounded-none border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-none bg-primary/10 text-primary flex items-center justify-center">
                    <BriefcaseMedical className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="m-0 text-lg font-black text-primary uppercase tracking-widest">
                        Hoja de Vida Digital
                    </h3>
                    <p className="m-0 text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Seguridad Social y Perfil Profesional
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase mb-2 tracking-widest">
                        <Heart size={14} />
                        Factor RH
                    </label>
                    <select
                        {...register("rh")}
                        className="w-full h-11 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white"
                    >
                        <option value="">Seleccione...</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>

                <FormField
                    label="EPS"
                    placeholder="Ej: Sanitas"
                    icon={<ShieldPlus />}
                    error={errors.eps?.message as string}
                    {...register("eps")}
                />

                <FormField
                    label="ARL"
                    placeholder="Ej: Sura"
                    icon={<Zap />}
                    error={errors.arl?.message as string}
                    {...register("arl")}
                />

                <FormField
                    label="Fondo Pensiones"
                    placeholder="Ej: Porvenir"
                    icon={<BriefcaseMedical />}
                    error={errors.fondoPensiones?.message as string}
                    {...register("fondoPensiones")}
                />

                <FormField
                    label="Cesantías"
                    placeholder="Ej: Protección"
                    icon={<FileText />}
                    error={errors.fondoCesantias?.message as string}
                    {...register("fondoCesantias")}
                />
            </div>

            <div className="space-y-6">
                <div className="border border-slate-200">
                    <FormField
                        label="Perfil Profesional / Resumen"
                        type="textarea"
                        rows={4}
                        placeholder="Describa brevemente su perfil profesional y experiencia..."
                        icon={<FileText />}
                        error={errors.perfilProfesional?.message as string}
                        {...register("perfilProfesional")}
                        className="border-none"
                    />
                </div>

                <div className="bg-slate-50 p-6 border border-slate-200 mt-6">
                    <div className="mb-4 pb-2 border-b border-slate-200 flex items-center gap-2 text-primary">
                        <Contact size={16} />
                        <h4 className="m-0 text-xs font-black uppercase tracking-widest">
                            Contacto de Emergencia
                        </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            label="Nombre Completo"
                            placeholder="Nombre contacto"
                            icon={<Contact />}
                            error={
                                errors.contactoEmergenciaNombre?.message as string
                            }
                            {...register("contactoEmergenciaNombre")}
                        />
                        <FormField
                            label="Teléfono Enlace"
                            placeholder="Número celular"
                            icon={<Phone />}
                            error={
                                errors.contactoEmergenciaTelefono?.message as string
                            }
                            {...register("contactoEmergenciaTelefono")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
