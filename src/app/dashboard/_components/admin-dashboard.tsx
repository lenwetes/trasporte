/**
 * @module AdminDashboard
 * @refactored 2026-03-31
 * @description Barrel de compatibilidad. El monolito de 620 líneas fue dividido en:
 *   - ./admin-dashboard-root.tsx          → Orquestador principal (~100 líneas)
 *   - ./executive-header.tsx              → Cabecera con reloj en tiempo real
 *   - ./kpi-card.tsx                      → Tarjeta KPI reutilizable
 *   - ./quick-actions-widget.tsx          → Hub de accesos rápidos
 *   - ./upcoming-expiries-widget.tsx      → Widget de vencimientos próximos
 *   - ./mini-entity-lists.tsx             → MiniVehicleList + MiniConductorList
 *   - ./fleet-widgets.tsx                 → FleetStatusStrip + ExpiryProjectionChart
 * @see c:\web\agent\memory\plan-mejoras.md → [M2] ✅ COMPLETADO
 */
export { AdminDashboardRoot as AdminDashboard } from "./admin-dashboard-root";
