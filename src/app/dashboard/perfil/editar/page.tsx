import { auth } from "@/auth";
import { getUsuarioById } from "@/actions";
import { UsuarioForm } from "@/components/forms/usuario-form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UsuarioUpdate } from "@/lib/validations";
import { LicenseManager } from "@/components/forms/license-manager";
import { UsuarioWithRelations } from "@/types";

import { ArrowLeft, UserCircle, FileText, BookmarkPlus } from "lucide-react";

export default async function EditarPerfilPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = session.user.id;
    const result = await getUsuarioById(userId);

    if (!result.success || !result.data) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                Error al cargar tu información.
            </div>
        );
    }

    const usuario = result.data as any;
    const hojaVida = usuario.hojaVida || {};

    // Convert Date to string for the form input type="date"
    const formData = {
        ...usuario,
        ...hojaVida,
        fechaNacimiento: usuario.fechaNacimiento
            ? new Date(usuario.fechaNacimiento).toISOString().split("T")[0]
            : "",
        licencias:
            usuario.licencias?.map((lic: any) => ({
                ...lic,
                fechaVencimiento: lic.fechaVencimiento
                    ? new Date(lic.fechaVencimiento).toISOString().split("T")[0]
                    : "",
            })) || [],
        rol: usuario.rol,
    } as Record<string, unknown>;

    return (
        <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <div style={{ marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Link
                        href="/dashboard/perfil"
                        style={{
                            padding: "10px",
                            borderRadius: "12px",
                            color: "#64748b",
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                        }}
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
                            <UserCircle size={24} className="text-emerald-500" />
                            Configuración de Perfil
                        </h1>
                        <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                            Actualiza tus datos personales y credenciales de acceso.
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "32px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "32px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                        <UsuarioForm
                            initialData={formData as unknown as UsuarioUpdate}
                            userId={userId}
                            currentUserRole={session.user.rol}
                        />
                    </div>

                    <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "32px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                        <h3 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#f0fdf4", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <BookmarkPlus size={20} />
                            </div>
                            Gestión de Licencias y Renovaciones
                        </h3>
                        <LicenseManager
                            usuarioId={userId}
                            licenciasActivas={usuario.licencias || []}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    <div style={{ backgroundColor: "#0f172a", borderRadius: "24px", padding: "32px", color: "white", backgroundImage: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent)" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "24px" }}>
                            <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "800" }}>
                                    Certificados & Experiencia
                                </h4>
                                <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
                                    Sube tus soportes documentales, referencias y
                                    registra tu historial laboral completo.
                                </p>
                            </div>
                        </div>
                        <Link href="/dashboard/perfil/hoja-vida">
                            <button style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "white",
                                color: "#0f172a",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "800",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}>
                                Gestionar Hoja de Vida
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
