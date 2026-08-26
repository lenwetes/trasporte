import { PhotoUpload } from "../photo-upload";
import { UseFormReturn } from "react-hook-form";
import { UsuarioCreate, UsuarioUpdate } from "@/lib/validations";

interface IdentitySectionProps {
    form: UseFormReturn<UsuarioCreate | UsuarioUpdate>;
    initialData?: any;
    onPhotoSelect?: (file: File | null) => void;
    isEdit?: boolean;
}

export function IdentitySection({
    form,
    initialData,
    onPhotoSelect,
}: IdentitySectionProps) {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <div className="bg-white p-6 md:p-8 rounded-none border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-none bg-primary/10 text-primary flex items-center justify-center text-xl">
                    🆔
                </div>
                <div>
                    <h3 className="m-0 text-lg font-black text-primary uppercase tracking-widest">Identidad Operativa</h3>
                    <p className="m-0 text-xs font-bold text-slate-900 uppercase tracking-wider">Registro Maestro de Usuario</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center bg-slate-50 p-6 border border-slate-200">
                <div className="shrink-0">
                    <PhotoUpload
                        initialPhotoUrl={
                            initialData?.fotoPerfil?.nombreUnico
                                ? `/api/files/${initialData.fotoPerfil.nombreUnico}`
                                : undefined
                        }
                        onPhotoSelect={(file) => {
                            if (onPhotoSelect) onPhotoSelect(file);
                        }}
                    />
                </div>
                <div>
                    <h4 className="m-0 text-sm font-black uppercase text-primary tracking-widest">Retrato Institucional</h4>
                    <p className="mt-2 text-xs font-medium text-slate-900 leading-relaxed uppercase">Sube una foto clara de frente para el carnet operativo y perfil oficial.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase mb-2 tracking-widest">Nombres</label>
                    <input {...register("nombres")} placeholder="Ej: Juan Antonio" className="w-full h-11 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white" />
                    {errors.nombres && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.nombres.message}</p>}
                </div>

                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase mb-2 tracking-widest">Apellidos</label>
                    <input {...register("apellidos")} placeholder="Ej: Pérez García" className="w-full h-11 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white" />
                    {errors.apellidos && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.apellidos.message}</p>}
                </div>

                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase mb-2 tracking-widest">Tipo de Documento</label>
                    <select {...register("tipoDocumento")} className="w-full h-11 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white">
                        <option value="CC">Cédula de Ciudadanía (CC)</option>
                        <option value="CE">Cédula de Extranjería (CE)</option>
                        <option value="PASAPORTE">Pasaporte</option>
                        <option value="NIT">NIT</option>
                    </select>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase mb-2 tracking-widest">Número Identificación</label>
                    <input {...register("numeroDocumento")} placeholder="12345678" className="w-full h-11 px-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white" />
                    {errors.numeroDocumento && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.numeroDocumento.message}</p>}
                </div>
            </div>
        </div>
    );
}
