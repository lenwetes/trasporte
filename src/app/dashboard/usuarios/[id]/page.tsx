import { getUsuarioById } from "@/actions";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { UsuarioWithRelations } from "@/types";
import { SafetySection } from "./_components/safety-section";
import { UserInfoCard } from "./_components/user-info-card";
import { SocialSecurityCard } from "./_components/social-security-card";
import { ProfessionalProfileCard } from "./_components/professional-profile-card";
import { WorkExperienceCard } from "./_components/work-experience-card";
import { EducationLegalGrid } from "./_components/education-legal-grid";
import { PersonalReferencesCard } from "./_components/personal-references-card";
import { OwnerKillswitchPanel } from "./_components/owner-killswitch-panel";
import { LicenciaTab } from "../../conductores/[id]/_components/licencia-tab";
import { ArrowLeft, PenSquare, Printer, FileText, Settings, ShieldCheck, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsuarioDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function UsuarioDetailPage({
    params,
}: UsuarioDetailPageProps) {
    const session = await auth();
    const { id } = await params;
    const result = await getUsuarioById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const usuario = result.data as UsuarioWithRelations;
    const isSelf = session?.user?.id === id;
    const isAdmin = session?.user?.rol === "ADMIN";

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Cabecera & Acciones */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/usuarios">
                            <Button variant="outline" size="icon" className="h-12 w-12 border-slate-200 bg-white hover:bg-slate-100 radius-0 transition-all hover:scale-105">
                                <ArrowLeft className="h-5 w-5 text-slate-800" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-slate-900 leading-none mb-2">
                                EXPEDIENTE_COLABORADOR
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="h-1.5 w-1.5 bg-primary animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#018790] opacity-80">
                                    ESTADO DE VINCULACIÓN: {usuario.activo ? "ACTIVO" : "INACTIVO"} | SISTEMA_SGIT
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Link href={`/dashboard/usuarios/${id}/hoja-vida`} className="flex-1 md:flex-none">
                            <Button variant="outline" className="w-full gap-3 text-[11px] font-black uppercase tracking-widest border-slate-900 hover:bg-slate-900 hover:text-white transition-all radius-0 h-10 px-6">
                                <FileText className="h-4 w-4" /> REVISAR HOJA DE VIDA
                            </Button>
                        </Link>
                        
                        {(isAdmin || isSelf) && (
                            <Link href={`/dashboard/usuarios/${id}/editar`} className="flex-1 md:flex-none">
                                <Button className="w-full bg-primary text-white gap-3 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all radius-0 h-10 px-8 group">
                                    <PenSquare className="h-4 w-4" /> ACTUALIZAR DATOS
                                </Button>
                            </Link>
                        )}
                        <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200 radius-0 hover:bg-slate-50"><Printer className="h-4 w-4" /></Button>
                    </div>
                </div>

                <div className="flex flex-col gap-10">
                    {/* Fila 1: Info Principal & Seguridad Social */}
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 xl:col-span-8">
                            <UserInfoCard usuario={usuario} />
                        </div>
                        <div className="col-span-12 xl:col-span-4 space-y-8">
                             <SocialSecurityCard usuario={usuario} />
                             {isAdmin && usuario.rol === "PROPIETARIO" && (
                                <OwnerKillswitchPanel
                                    ownerId={usuario.id}
                                    ownerName={`${usuario.nombres} ${usuario.apellidos}`}
                                    vehicleCount={usuario.vehiculosPropiedad.length}
                                />
                            )}
                        </div>
                    </div>

                    {/* Fila 2: Perfil Profesional (Full width) */}
                    <div className="w-full">
                         <ProfessionalProfileCard perfilProfesional={usuario.hojaVida?.perfilProfesional} />
                    </div>

                    {/* Fila 3: Trayectoria Laboral (Full width) */}
                    <div className="w-full">
                        <WorkExperienceCard experiencias={usuario.experienciasLaborales} />
                    </div>

                    {/* Fila 4: Formación & Legal (Como elementos independientes de ancho completo) */}
                    <div className="w-full">
                        <EducationLegalGrid certificados={usuario.certificados} />
                    </div>

                    {/* Fila 5: Habilitación & Licencias (Ancho completo e independientes) */}
                    <div className="bg-white border border-slate-200 radius-0 shadow-sm overflow-hidden">
                         <div className="bg-white px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                            <ShieldCheck className="text-primary" size={18} />
                            <h3 className="text-[14px] font-black uppercase tracking-widest text-primary">Habilitación Operativa & Licencias</h3>
                         </div>
                         <div className="p-8">
                             <LicenciaTab conductor={usuario} />
                         </div>
                    </div>

                    {/* Fila 6: SG-SST & Seguridad Vial (Independiente de ancho completo) */}
                    <div className="bg-white border border-slate-200 radius-0 shadow-sm overflow-hidden">
                         <div className="bg-white px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                            <HardHat className="text-primary" size={18} />
                            <h3 className="text-[14px] font-black uppercase tracking-widest text-primary">SG-SST & Seguridad Vial</h3>
                         </div>
                         <div className="p-8">
                            <SafetySection conductorId={usuario.id} conductorNombre={`${usuario.nombres} ${usuario.apellidos}`} />
                         </div>
                    </div>

                    {/* Fila 7: Controles de Sistema & Referencias */}
                    <div className="grid grid-cols-12 gap-8">
                         <div className="col-span-12 lg:col-span-4">
                            <div className="bg-white p-8 border border-slate-200 border-l-4 border-primary h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <Settings className="text-primary h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">CONTROLES_SISTEMA</span>
                                </div>
                                <p className="text-[11px] text-slate-500 uppercase font-bold leading-loose italic">
                                    Acceso restringido a módulos operativos avanzados de Coopetraes. Toda acción queda registrada en el historial del SGIT.
                                </p>
                            </div>
                         </div>
                         <div className="col-span-12 lg:col-span-8">
                            <PersonalReferencesCard referencias={usuario.referenciasPersonales} />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
