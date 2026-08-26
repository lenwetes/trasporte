import { getUsuarioById, getReglasAlertas } from "@/actions";
import { UsuarioForm } from "@/components/forms/usuario-form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UsuarioUpdate } from "@/lib/validations";
import { UserCertificates } from "@/components/forms/user-certificates";
import { UserExperience } from "@/components/forms/user-experience";
import { UserReferences } from "@/components/forms/user-references";
import { PerfilHistorialClient } from "@/components/perfil-historial-client";
import { LicenseManager } from "@/components/forms/license-manager";
import { auth } from "@/auth";
import { ArrowLeft, User, FileText, Bell, ShieldCheck } from "lucide-react";

import { UsuarioWithRelations } from "@/types";
import { ReglaAlerta } from "@prisma/client";

interface EditarUsuarioPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditarUsuarioPage({
    params,
}: EditarUsuarioPageProps) {
    const session = await auth();

    if (session?.user?.rol !== "ADMIN" && session?.user?.rol !== "SECRETARIA") {
        return (
            <div className="p-10 text-center text-slate-500">
                <h2 className="text-primary font-bold">Acceso Restringido</h2>
                <p>No tienes permisos suficientes para editar perfiles de usuario.</p>
            </div>
        );
    }

    const { id } = await params;
    const [userResult, rulesResult] = await Promise.all([
        getUsuarioById(id),
        getReglasAlertas(),
    ]);

    if (!userResult.success || !userResult.data) {
        notFound();
    }

    const usuario = userResult.data as UsuarioWithRelations;
    const alertRules = (
        rulesResult.success && rulesResult.data ? rulesResult.data : []
    ) as ReglaAlerta[];
    const hojaVida = usuario.hojaVida || {};

    const formData = {
        ...usuario,
        ...hojaVida,
        fechaNacimiento: usuario.fechaNacimiento
            ? new Date(usuario.fechaNacimiento).toISOString().split("T")[0]
            : "",
        licencias:
            usuario.licencias?.map((lic: { fechaVencimiento: Date | string | null; [key: string]: unknown }) => ({
                ...lic,
                fechaVencimiento: lic.fechaVencimiento
                    ? new Date(lic.fechaVencimiento).toISOString().split("T")[0]
                    : "",
            })) || [],
    } as Record<string, unknown>;

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-6 mb-10 pb-6 border-b border-slate-200">
                    <Link
                        href="/dashboard/usuarios"
                        className="w-12 h-12 rounded-none bg-white text-primary flex items-center justify-center border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="m-0 text-3xl font-black text-primary flex items-center gap-3 uppercase tracking-tight">
                            <User className="w-8 h-8 text-brand" />
                            Editar Expediente Maestro
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 font-medium uppercase tracking-widest">
                            Actualizando información corporativa de <span className="text-primary font-bold">{usuario.nombres} {usuario.apellidos}</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-8 rounded-none border border-slate-200 shadow-sm">
                            <UsuarioForm
                                initialData={formData as unknown as UsuarioUpdate}
                                userId={id}
                                currentUserRole={session.user.rol}
                            />
                        </div>

                        {/* License Management */}
                        <div className="bg-white p-8 rounded-none border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-none bg-brand/10 text-brand flex items-center justify-center">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="m-0 text-lg font-black text-primary uppercase tracking-widest">
                                    Categoría de Licencias y Vencimientos
                                </h3>
                            </div>
                            <LicenseManager
                                usuarioId={id}
                                licenciasActivas={usuario.licencias || []}
                            />
                        </div>
                    </div>

                    {/* Right Column - Actions & Widgets */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-6 rounded-none border border-slate-200 shadow-sm">
                            <h4 className="m-0 mb-6 text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Bell className="w-4 h-4 text-brand" />
                                Operaciones Rápidas
                            </h4>
                            <Link href={`/dashboard/usuarios/${id}/hoja-vida`} className="block no-underline">
                                <button className="w-full bg-slate-50 text-primary border border-slate-200 p-4 rounded-none text-sm font-bold flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-100 transition-all uppercase tracking-wider">
                                    <FileText className="w-5 h-5" />
                                    Generar Hoja de Vida
                                </button>
                            </Link>
                            <p className="mt-4 text-xs text-slate-500 font-medium leading-relaxed text-center">
                                Compile toda la información actual en un formato profesional para auditoría o exportación PDF.
                            </p>
                        </div>

                        {/* Notifications & History */}
                        <PerfilHistorialClient
                            usuario={usuario}
                            alertRules={alertRules}
                        />
                        
                        {/* Legal Compliance Branding */}
                        <div className="p-6 rounded-none bg-primary text-white flex items-center gap-4 shadow-md border-l-4 border-brand">
                            <div className="w-12 h-12 rounded-none bg-white/10 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <p className="m-0 text-sm font-black uppercase tracking-widest">Seguridad Vial 3.0</p>
                                <p className="m-0 text-xs text-slate-300 font-medium mt-1">Expediente Digital Protegido</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
