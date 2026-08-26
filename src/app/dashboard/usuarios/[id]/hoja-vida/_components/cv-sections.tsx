import { 
    User, 
    Shield, 
    Briefcase, 
    Users, 
    IdCard, 
    MapPin, 
    Calendar, 
    BriefcaseBusiness,
    GraduationCap
} from "lucide-react";
import { SectionTitle, DataField } from "./cv-shared";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Licencia {
    id: string;
    categoria: string;
    fechaVencimiento: Date | string | null;
}

interface ExperienciaLaboral {
    id: string;
    cargo: string;
    empresa: string;
    jefeInmediato?: string | null;
    telefonoJefe?: string | null;
}

interface Certificado {
    id: string;
    nombre: string;
    institucion?: string | null;
    fechaEmision?: Date | string | null;
}

interface ReferenciaPersonal {
    id: string;
    nombre: string;
    ocupacion?: string | null;
    telefono?: string | null;
}

export interface UsuarioCV {
    id: string;
    nombres: string;
    apellidos: string;
    /** Prisma lo define como string | null */
    numeroDocumento: string | null;
    email?: string | null;
    lugarNacimiento?: string | null;
    estadoCivil?: string | null;
    fechaNacimiento?: Date | string | null;
    direccion?: string | null;
    municipio?: string | null;
    hojaVida?: {
        rh?: string | null;
        eps?: string | null;
        fondoPensiones?: string | null;
        arl?: string | null;
        contactoEmergenciaNombre?: string | null;
        contactoEmergenciaTelefono?: string | null;
    } | null;
    licencias?: Licencia[];
    experienciasLaborales?: ExperienciaLaboral[];
    certificados?: Certificado[];
    referenciasPersonales?: ReferenciaPersonal[];
}

export function CVPersonalData({ usuario }: { usuario: UsuarioCV }) {
    return (
        <div className="flex flex-col mb-12 print:mb-8">
            <SectionTitle title="Datos Personales" icon={User} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-2 p-8 border border-slate-200 print:p-4">
                <DataField label="Lugar de Nacimiento" value={usuario.lugarNacimiento} />
                <DataField label="Estado Civil" value={usuario.estadoCivil} />
                <DataField label="Fecha de Nacimiento" value={usuario.fechaNacimiento ? format(new Date(usuario.fechaNacimiento), "dd 'de' MMMM 'de' yyyy", { locale: es }) : "---"} />
                <DataField icon={MapPin} label="Dirección de Residencia" value={usuario.direccion} />
                <DataField label="Municipio" value={usuario.municipio} />
                <DataField label="Correo Electrónico" value={usuario.email} />
            </div>
        </div>
    );
}

export function CVSocialSecurity({ usuario }: { usuario: UsuarioCV }) {
    const hv = usuario.hojaVida;
    return (
        <div className="flex flex-col mb-12 print:mb-8">
            <SectionTitle title="Seguridad Social & Salud" icon={Shield} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 p-8 border border-slate-200 print:py-4 print:px-6">
                <DataField label="RH" value={hv?.rh} />
                <DataField label="EPS" value={hv?.eps} />
                <DataField label="Fondo de Pensiones" value={hv?.fondoPensiones} />
                <DataField label="ARL" value={hv?.arl} />
            </div>
            {hv?.contactoEmergenciaNombre && (
                <div className="p-8 border border-slate-200 border-t-0 bg-slate-50/30 print:p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#018790] opacity-70 mb-2">Contacto en Caso de Emergencia</p>
                    <div className="flex flex-col md:flex-row gap-8">
                        <p className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{hv.contactoEmergenciaNombre}</p>
                        <p className="text-[13px] font-bold text-brand uppercase tracking-tight">Telf: {hv.contactoEmergenciaTelefono || "---"}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export function CVLicenseInfo({ usuario }: { usuario: UsuarioCV }) {
    return (
        <div className="flex flex-col mb-12 print:mb-8">
            <SectionTitle title="Habilitación & Licencias" icon={IdCard} />
            <div className="p-8 border border-slate-200 print:p-4">
                {usuario.licencias && usuario.licencias.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {usuario.licencias.map((lic: Licencia) => (
                            <div key={lic.id} className="border-l-4 border-brand/20 bg-slate-50/50 p-6 flex flex-col gap-3 group hover:bg-white hover:border-brand transition-all">
                                <p className="text-[18px] font-black text-slate-900 leading-none group-hover:text-brand transition-colors">
                                    Categoría {lic.categoria}
                                </p>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Vencimiento</p>
                                    <p className="text-[13px] font-bold text-slate-700 uppercase">
                                        {lic.fechaVencimiento ? format(new Date(lic.fechaVencimiento), "dd 'de' MMM 'de' yyyy", { locale: es }) : "INDEFINIDA"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center opacity-40 italic text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                        Sin licencias registradas en el sistema principal.
                    </div>
                )}
            </div>
        </div>
    );
}

export function CVExperience({ usuario }: { usuario: UsuarioCV }) {
    return (
        <div className="flex flex-col mb-12 print:mb-8">
            <SectionTitle title="Experiencia Laboral" icon={BriefcaseBusiness} />
            <div className="p-8 border border-slate-200 print:p-4">
                {usuario.experienciasLaborales && usuario.experienciasLaborales.length > 0 ? (
                    <div className="space-y-10">
                        {usuario.experienciasLaborales.map((exp: ExperienciaLaboral, i: number) => (
                            <div key={i} className="relative pl-12">
                                {/* Timeline logic */}
                                {i < (usuario.experienciasLaborales!.length - 1) && (
                                    <div className="absolute left-3 top-5 bottom-[-40px] w-0.5 bg-slate-100" />
                                )}
                                <div className="absolute left-0 top-1 w-6 h-6 border-2 border-brand/30 bg-white flex items-center justify-center radius-0">
                                    <div className="w-1.5 h-1.5 bg-brand" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
                                    <div>
                                        <h4 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight mb-1 leading-none">{exp.cargo}</h4>
                                        <p className="text-[12px] font-bold text-brand uppercase tracking-widest">{exp.empresa}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 pt-1 border-t md:border-t-0 border-slate-100 italic">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jefe Directo</span>
                                            <span className="text-[11px] font-bold text-slate-600 uppercase italic">{exp.jefeInmediato || "---"}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contacto</span>
                                            <span className="text-[11px] font-bold text-slate-600 uppercase italic">{exp.telefonoJefe || "---"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center opacity-40 italic text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                        No se ha registrado trayectoria profesional externa.
                    </div>
                )}
            </div>
        </div>
    );
}

export function CVEducation({ usuario }: { usuario: UsuarioCV }) {
    return (
        <div className="flex flex-col mb-12 print:mb-8">
            <SectionTitle title="Formación Académica" icon={GraduationCap} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border border-slate-200 print:p-4">
                {usuario.certificados && usuario.certificados.length > 0 ? (
                    usuario.certificados.map((cert: Certificado) => (
                        <div key={cert.id} className="flex flex-col gap-2 p-6 bg-slate-50/50 border-l-4 border-emerald-500/20 group hover:border-emerald-500 transition-all">
                             <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight leading-none mb-1">{cert.nombre}</h4>
                             <p className="text-[11px] font-bold text-slate-400 uppercase italic leading-tight">{cert.institucion || "Intituto no especificado"}</p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 py-8 text-center opacity-40 italic text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                        Sin registros de educación formal.
                    </div>
                )}
            </div>
        </div>
    );
}

export function CVReferences({ usuario }: { usuario: UsuarioCV }) {
    return (
        <div className="flex flex-col">
            <SectionTitle title="Referencias Personales" icon={Users} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-slate-200 p-8 print:p-4">
                {usuario.referenciasPersonales && usuario.referenciasPersonales.length > 0 ? (
                    usuario.referenciasPersonales.map((ref: ReferenciaPersonal) => (
                        <div key={ref.id} className="p-6 bg-slate-50/30 border-l-2 border-slate-200 flex flex-col gap-4 group hover:bg-white hover:border-brand transition-all">
                            <h4 className="text-[14px] font-bold text-slate-900 uppercase mb-1 leading-none">{ref.nombre}</h4>
                            <div className="flex flex-col lg:flex-row gap-x-8 gap-y-2">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ocupación</span>
                                    <span className="text-[11px] font-bold text-slate-600 uppercase italic">{ref.ocupacion || "REFERENCIA_DIRECTA"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contacto</span>
                                    <span className="text-[11px] font-bold text-brand uppercase italic leading-none">{ref.telefono || "---"}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 py-8 text-center opacity-40 italic text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                        El perfil no registra referencias verificadas.
                    </div>
                )}
            </div>
        </div>
    );
}
