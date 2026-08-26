import Image from "next/image";
import { Mail, Phone, MapPin, Activity, Truck, UserCircle2, CheckCircle2, ShieldCheck } from "lucide-react";
import { UsuarioWithRelations } from "@/types";
import Link from "next/link";

interface UserInfoCardProps {
    usuario: UsuarioWithRelations;
}

export function UserInfoCard({ usuario }: UserInfoCardProps) {
    const activeVinculacion = usuario.vinculaciones?.find((v: any) => v.activo);

    return (
        <div className="bg-white border border-slate-200 grid grid-cols-12 overflow-hidden radius-0 min-h-[400px]">
            {/* Foto de Identificación */}
            <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-slate-50/50 p-8 flex flex-col items-center justify-center gap-6 border-b md:border-b-0 md:border-r border-slate-200 relative">
                <div className="absolute top-4 left-4 flex gap-2">
                     <ShieldCheck size={14} className="text-[#018790]" />
                     <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">EXPEDIENTE_VERIFICADO</span>
                </div>
                
                <div className="relative w-48 h-48 border-2 border-[#018790]/20 bg-white p-2 radius-0 transition-all hover:border-[#018790]">
                    <div className="relative w-full h-full overflow-hidden bg-slate-100 radius-0">
                        {usuario.fotoPerfil ? (
                            <Image
                                src={`/api/files/${usuario.fotoPerfil.nombreUnico}`}
                                alt="Perfil"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                unoptimized
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 font-bold text-slate-300 text-3xl italic">
                                SIN_FOTO
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center text-center gap-1">
                     <span className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em]">ID_SISTEMA</span>
                     <span className="text-[14px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-brand pb-1">{usuario.numeroDocumento}</span>
                </div>
            </div>

            {/* Identidad & Contacto */}
            <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col">
                <div className="bg-white px-8 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <UserCircle2 size={18} className="text-brand" />
                         <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-brand">Identificación del Colaborador</span>
                    </div>
                </div>

                <div className="p-10 flex flex-col justify-between flex-1 gap-10">
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                                    {usuario.nombres}
                                    <span className="block text-[#018790]">{usuario.apellidos}</span>
                                </h2>
                                <div className="mt-4 inline-flex items-center gap-2 bg-slate-100 text-[#018790] px-4 py-1.5 radius-0 w-fit border border-[#018790]/10">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{usuario.rol}</span>
                                </div>
                            </div>
                            <div className="hidden lg:flex flex-col items-end text-right">
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">FECHA_REGISTRO</span>
                                 <span className="text-[11px] font-bold text-slate-900 uppercase">
                                    {new Date(usuario.creadoEn).toLocaleDateString()}
                                 </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mt-6">
                            <ContactField icon={<Mail size={16} />} label="CORREO_ELECTRÓNICO" value={usuario.email || "NO_REGISTRADO"} />
                            <ContactField icon={<Phone size={16} />} label="TELÉFONO_MOVIL" value={usuario.telefono || "NO_REGISTRADO"} />
                            <ContactField icon={<MapPin size={16} />} label="UBIC_RESIDENCIA" value={`${usuario.municipio || "SINCELEJO"}, ${usuario.direccion || "---"}`} />
                            <ContactField icon={<Activity size={16} />} label="ÚLTIMA_ACTIVIDAD" value={usuario.ultimoLogin ? new Date(usuario.ultimoLogin).toLocaleString() : "DESCONECTADO"} />
                        </div>
                    </div>

                    {/* Barra de Estado Operativo */}
                    <div className="pt-8 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        {activeVinculacion ? (
                            <div className="flex items-center gap-6 group">
                                <div className="h-14 w-14 bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-brand/10 transition-colors radius-0">
                                    <Truck className="text-brand" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-[#018790] uppercase tracking-widest opacity-70">Operando en Vehículo</span>
                                    <span className="text-[16px] font-bold text-slate-900 uppercase tracking-widest">{activeVinculacion.vehiculo.placa}</span>
                                    <Link href={`/dashboard/vehiculos/${activeVinculacion.vehiculo.id}`} className="text-[9px] font-bold text-brand uppercase hover:underline mt-1 underline-offset-2 tracking-widest">VER_REGISTRO_VEHÍCULO</Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 text-slate-400">
                                 <div className="h-1 y-1 bg-slate-100 w-10" />
                                 <span className="text-[10px] uppercase font-bold tracking-widest italic">SIN_ASIGNACIÓN_OPERATIVA_ACTIVA</span>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-3">
                             <div className="flex flex-col items-end">
                                <span className="text-[8px] font-bold text-[#018790] uppercase tracking-[0.2em]">SISTEMA_SGIT_OK</span>
                                <span className="text-[11px] font-bold text-slate-900 uppercase">LATAM_V-2026</span>
                             </div>
                             <CheckCircle2 className="text-[#018790]" size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactField({ icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="h-10 w-10 border border-slate-200 flex items-center justify-center text-[#018790] group-hover:bg-slate-50 transition-all radius-0">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
                <span className="text-[12px] font-bold text-slate-900 uppercase tracking-wider">{value}</span>
            </div>
        </div>
    );
}
