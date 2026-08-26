/**
 * @file dashboard-theme.ts
 * @description Definición de tipos y constantes para el sistema de temas visuales del dashboard.
 */

export type DashboardTheme = "command-classic" | "hybrid-premium";

export interface DashboardThemeInfo {
    id: DashboardTheme;
    label: string;
    description: string;
    image?: string;
}

export const DASHBOARD_THEMES: Record<DashboardTheme, DashboardThemeInfo> = {
    "command-classic": {
        id: "command-classic",
        label: "Command Classic",
        description: "Panel ejecutivo de alta densidad con sectores definidos y estética Corporate Flat.",
    },
    "hybrid-premium": {
        id: "hybrid-premium",
        label: "Hybrid Premium",
        description: "Panel moderno con widgets de progreso circular, timeline visual y diseño Bento-Grid fluido.",
    },
};

export const DEFAULT_THEME: DashboardTheme = "command-classic";
