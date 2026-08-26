import { auth } from "@/auth";
import { getUsuarioById, getConfiguracionGlobal } from "@/actions";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, FileUser } from "lucide-react";

const HojaVidaClient = dynamic(
    () =>
        import("@/components/hoja-vida-client").then(
            (mod) => mod.HojaVidaClient,
        ),
    {
        loading: () => (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                Cargando expediente profesional...
            </div>
        ),
    },
);

import { UsuarioWithRelations } from "@/types";
import { ConfiguracionGlobal } from "@prisma/client";

export default async function HojaVidaPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = session.user.id;
    const [userResult, configResult] = await Promise.all([
        getUsuarioById(userId),
        getConfiguracionGlobal(),
    ]);

    if (!userResult.success || !userResult.data) {
        return (
            <div>
                Error al cargar tu información.
            </div>
        );
    }

    const usuario = userResult.data as UsuarioWithRelations;
    const config = configResult.data as ConfiguracionGlobal | null;

    // Preparar datos para el componente cliente con tipos correctos
    const hojaVida = usuario.hojaVida;
    const certificados = usuario.certificados;
    const experienciasLaborales = usuario.experienciasLaborales;
    const referenciasPersonales = usuario.referenciasPersonales;

    const hojaVidaData = {
        config: config,
        usuario: {
            id: usuario.id,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            email: usuario.email || "",
            telefono: usuario.telefono || "",
            direccion: usuario.direccion || "",
            tipoDocumento: usuario.tipoDocumento,
            numeroDocumento: usuario.numeroDocumento || "",
            fechaNacimiento: usuario.fechaNacimiento,
            lugarNacimiento: usuario.lugarNacimiento,
            estadoCivil: usuario.estadoCivil,
            municipio: usuario.municipio || "Sincelejo",
            fotoPerfil: usuario.fotoPerfil
                ? { nombreUnico: usuario.fotoPerfil.nombreUnico }
                : null,
        },
        hojaVida: hojaVida
            ? {
                  rh: hojaVida.rh,
                  eps: hojaVida.eps,
                  arl: hojaVida.arl,
                  fondoPensiones: hojaVida.fondoPensiones,
                  fondoCesantias: hojaVida.fondoCesantias,
                  contactoEmergenciaNombre: hojaVida.contactoEmergenciaNombre,
                  contactoEmergenciaTelefono:
                      hojaVida.contactoEmergenciaTelefono,
                  perfilProfesional: hojaVida.perfilProfesional,
              }
            : null,
        certificados:
            certificados?.map((cert) => ({
                id: cert.id,
                nombre: cert.nombre,
                institucion: cert.institucion,
                fechaEmision: cert.fechaEmision,
                fechaVencimiento: cert.fechaVencimiento,
                archivoId: cert.archivoId,
                archivo: cert.archivo
                    ? {
                          id: cert.archivo.id,
                          nombreUnico: cert.archivo.nombreUnico,
                          nombreOriginal: cert.archivo.nombreOriginal,
                      }
                    : null,
            })) || [],
        experienciasLaborales: experienciasLaborales || [],
        referenciasPersonales: referenciasPersonales || [],
    };

    return (
        <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <div style={{ 
                padding: "24px 32px", 
                backgroundColor: "white", 
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "24px",
                marginBottom: "32px"
            }}>
                <Link
                    href="/dashboard/perfil"
                    style={{
                        padding: "10px",
                        borderRadius: "12px",
                        color: "#64748b",
                        backgroundColor: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s"
                    }}
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "12px" }}>
                        <FileUser size={24} className="text-emerald-500" />
                        Mi Hoja de Vida
                    </h1>
                    <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                        Gestiona tu información profesional, certificados y
                        experiencia laboral
                    </p>
                </div>
            </div>

            <HojaVidaClient data={hojaVidaData} />
        </div>
    );
}
