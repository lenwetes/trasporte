import {
    getReportingData,
    getConfiguracionGlobal,
    trackExport,
} from "@/actions";
import { generatePDFReport } from "@/lib/pdf-generator";
import { toast } from "sonner";
import { ConfiguracionGlobal } from "@prisma/client";
import { ReportFilterState } from "../types";

export function useReportGeneration(
    setLoading: (state: string | null) => void,
    filters: ReportFilterState,
) {
    const handleExportExcel = async (type: string) => {
        setLoading(`${type}_excel`);
        try {
            const reportResult = await getReportingData(
                type as
                | "fleet"
                | "expiry"
                | "conductors"
                | "novedades"
                | "siniestros",
                filters,
            );
            if (!reportResult.success || !reportResult.data) {
                toast.error(reportResult.error || "Error al obtener datos");
                return;
            }

            const data = reportResult.data as Record<string, unknown>[];
            if (data.length === 0) {
                toast.info("No hay datos para exportar");
                return;
            }

            const ExcelJS = await import("exceljs");
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Reporte");

            if (data.length > 0) {
                const columns = Object.keys(data[0]).map(key => ({
                    header: key.toUpperCase(),
                    key: key,
                    width: 20
                }));
                worksheet.columns = columns;
                worksheet.addRows(data);
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte_${type}_${Date.now()}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            await trackExport({
                tipo: "Reporte EXCEL",
                entidadId: type,
                detalles: `Filtros: ${JSON.stringify(filters)}`,
            });
            toast.success("Excel generado exitosamente");
        } catch (error) {
            console.error(error);
            toast.error("Error al generar Excel");
        } finally {
            setLoading(null);
        }
    };

    const handleGenerateReport = async (type: string) => {
        setLoading(type);
        try {
            const [reportResult, configResult] = await Promise.all([
                getReportingData(
                    type as
                    | "fleet"
                    | "expiry"
                    | "conductors"
                    | "novedades"
                    | "siniestros",
                    filters,
                ),
                getConfiguracionGlobal(),
            ]);

            const config = configResult.data as ConfiguracionGlobal | null;

            if (!reportResult.success || !reportResult.data) {
                toast.error(
                    reportResult.error ||
                    "Error al obtener los datos del reporte",
                );
                return;
            }

            const data = reportResult.data as Record<string, unknown>[];
            if (data.length === 0) {
                toast.info(
                    "No se encontraron datos coincidentes para este reporte.",
                );
                return;
            }

            if (type === "fleet") {
                await generatePDFReport({
                    config,
                    title: "Reporte de Estado de Flota",
                    subtitle:
                        "Resumen detallado de vehículos registrados en el sistema",
                    filename: `reporte_flota_${Date.now()}`,
                    columns: [
                        { header: "Placa", dataKey: "placa" },
                        { header: "Marca", dataKey: "marca" },
                        { header: "Propietario", dataKey: "propietario" },
                        { header: "Modalidad", dataKey: "modalidad" },
                    ],
                    data: data,
                });
            } else if (type === "expiry") {
                await generatePDFReport({
                    config,
                    title: "Reporte de Vencimientos",
                    subtitle: "Documentos con alerta roja o amarilla",
                    filename: `reporte_vencimientos_${Date.now()}`,
                    columns: [
                        { header: "Vehículo", dataKey: "placa" },
                        { header: "Documento", dataKey: "tipo" },
                        { header: "Días", dataKey: "dias" },
                        { header: "Estado", dataKey: "estado" },
                    ],
                    data: data.map((item) => ({
                        ...item,
                        dias: String(
                            (item as Record<string, unknown>).dias ?? "",
                        ),
                    })),
                });
            } else if (type === "conductors") {
                await generatePDFReport({
                    config,
                    title: "Directorio de Conductores",
                    subtitle: "Listado de personal operativo y asignaciones",
                    filename: `reporte_conductores_${Date.now()}`,
                    columns: [
                        { header: "Nombre", dataKey: "nombre" },
                        { header: "Documento", dataKey: "documento" },
                        { header: "Email", dataKey: "email" },
                        { header: "Vehículo", dataKey: "vehiculo" },
                    ],
                    data: data.map((u) => {
                        const rawUser = u as Record<string, unknown>;
                        const vinculaciones =
                            (rawUser.vinculaciones as
                                | Record<string, unknown>[]
                                | undefined) || [];
                        const firstVehiculo =
                            (
                                vinculaciones[0]?.vehiculo as
                                | Record<string, unknown>
                                | undefined
                            )?.placa || "Sin asignar";

                        return {
                            nombre: `${rawUser.nombres} ${rawUser.apellidos}`,
                            documento: String(rawUser.numeroDocumento ?? ""),
                            email: String(rawUser.email ?? ""),
                            vehiculo: String(firstVehiculo),
                        };
                    }),
                });
            } else if (type === "novedades") {
                await generatePDFReport({
                    config,
                    title: "Historial de Novedades y Multas",
                    subtitle: "Registro cronológico de novedades operativas",
                    filename: `reporte_novedades_${Date.now()}`,
                    columns: [
                        { header: "Fecha", dataKey: "fechaFmt" },
                        { header: "Vehículo", dataKey: "placa" },
                        { header: "Conductor", dataKey: "conductor" },
                        { header: "Tipo", dataKey: "tipo" },
                        { header: "Descripción", dataKey: "descripcion" },
                        { header: "Monto", dataKey: "montoFmt" },
                    ],
                    data: data.map((n) => {
                        const veh = n.vehiculo as { placa?: string } | null;
                        const cond = n.conductor as {
                            nombres: string;
                            apellidos: string;
                        } | null;
                        return {
                            ...n,
                            fechaFmt: new Date(
                                n.fecha as string,
                            ).toLocaleDateString(),
                            placa: veh?.placa || "N/A",
                            conductor: cond
                                ? `${cond.nombres} ${cond.apellidos}`
                                : "N/A",
                            montoFmt: n.monto
                                ? `$ ${Number(n.monto).toLocaleString()}`
                                : "N/A",
                        };
                    }),
                });
            } else if (type === "siniestros") {
                await generatePDFReport({
                    config,
                    title: "Registro Histórico de Siniestros",
                    subtitle: "Reporte de incidentes y accidentes en vía",
                    filename: `reporte_siniestros_${Date.now()}`,
                    columns: [
                        { header: "Fecha", dataKey: "fechaFmt" },
                        { header: "Vehículo", dataKey: "placa" },
                        { header: "Conductor", dataKey: "conductor" },
                        { header: "Lugar", dataKey: "lugar" },
                        { header: "Observaciones", dataKey: "reporteHechos" },
                    ],
                    data: data.map((s) => {
                        const veh = s.vehiculo as { placa?: string } | null;
                        const cond = s.conductor as {
                            nombres: string;
                            apellidos: string;
                        } | null;
                        return {
                            ...s,
                            fechaFmt: new Date(
                                s.fecha as string,
                            ).toLocaleDateString(),
                            placa: veh?.placa || "N/A",
                            conductor: cond
                                ? `${cond.nombres} ${cond.apellidos}`
                                : "N/A",
                        };
                    }),
                });
            }
            await trackExport({
                tipo: "Reporte PDF",
                entidadId: type,
                detalles: `Filtros: ${JSON.stringify(filters)}`,
            });
            toast.success("Reporte generado exitosamente");
        } catch (error) {
            console.error(error);
            toast.error("Error al generar el PDF");
        } finally {
            setLoading(null);
        }
    };

    return {
        handleExportExcel,
        handleGenerateReport,
    };
}
