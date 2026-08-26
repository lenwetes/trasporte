import { redirect } from "next/navigation";

/**
 * El módulo de Siniestros fue consolidado dentro del módulo de
 * Novedades e Incidencias como una pestaña unificada.
 *
 * Este redirect garantiza que cualquier enlace antiguo a /dashboard/siniestros
 * lleve al usuario al lugar correcto sin romper la navegación.
 */
export default function SiniestrosRedirectPage() {
    redirect("/dashboard/novedades?tab=siniestros");
}
