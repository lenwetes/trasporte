import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export type SafetyEventType =
    | "DOCUMENTO_VEHICULO"
    | "LICENCIA_CONDUCCION"
    | "CERTIFICADO"
    | "EXAMEN_MEDICO"
    | "PLANILLA_FUEC"
    | "CONTRATO_EMPRESA"
    | "RESOLUCION_FUEC"
    | "ORDEN_SERVICIO"
    | "OBLIGACION_FINANCIERA";

export interface SafetyCalendarEvent {
    id: string;
    date: Date;
    type: SafetyEventType;
    label: string;
    entityName: string; // Placa o Nombre
    entityId: string;
    severity: "info" | "warning" | "critical";
    description: string;
}

export class CalendarService {
    static async getEvents(
        monthInput: Date | string,
    ): Promise<SafetyCalendarEvent[]> {
        const month = new Date(monthInput);
        const start = startOfMonth(month);
        const end = endOfMonth(month);

        const events: SafetyCalendarEvent[] = [];

        // 1. Documentos Vehículo
        const docs = await prisma.documentoVehiculo.findMany({
            where: {
                fechaVencimiento: { gte: start, lte: end },
            },
            include: { vehiculo: true },
        });

        docs.forEach((d) => {
            events.push({
                id: d.id,
                date: d.fechaVencimiento!,
                type: "DOCUMENTO_VEHICULO",
                label: d.tipo,
                entityName: d.vehiculo.placa,
                entityId: d.vehiculo.id,
                severity: "critical",
                description: `Vencimiento de ${d.tipo} para vehículo ${d.vehiculo.placa}`,
            });
        });

        // 2. Licencias Conductor
        const licencias = await prisma.detalleLicencia.findMany({
            where: {
                fechaVencimiento: { gte: start, lte: end },
            },
            include: { usuario: true },
        });

        licencias.forEach((l) => {
            events.push({
                id: l.id,
                date: l.fechaVencimiento,
                type: "LICENCIA_CONDUCCION",
                label: `Licencia ${l.categoria}`,
                entityName: `${l.usuario.nombres} ${l.usuario.apellidos}`,
                entityId: l.usuario.id,
                severity: "critical",
                description: `Vencimiento de Licencia Cat. ${l.categoria} para ${l.usuario.nombres}`,
            });
        });

        // 3. Exámenes Médicos
        const examenes = await prisma.examenMedico.findMany({
            where: {
                fechaVencimiento: { gte: start, lte: end },
            },
            include: { conductor: true },
        });

        examenes.forEach((e) => {
            events.push({
                id: e.id,
                date: e.fechaVencimiento!,
                type: "EXAMEN_MEDICO",
                label: e.tipo,
                entityName: `${e.conductor.nombres} ${e.conductor.apellidos}`,
                entityId: e.conductor.id,
                severity: "warning",
                description: `Vencimiento de examen médico ${e.tipo}`,
            });
        });

        // 4. Planillas FUEC
        const planillas = await prisma.planillaFUEC.findMany({
            where: {
                fechaFin: { gte: start, lte: end },
            },
            include: { vehiculo: true },
        });

        planillas.forEach((p) => {
            events.push({
                id: p.id,
                date: p.fechaFin,
                type: "PLANILLA_FUEC",
                label: "FUEC",
                entityName: p.vehiculo.placa,
                entityId: p.vehiculo.id,
                severity: "info",
                description: `Finalización de vigencia FUEC ${p.consecutivo}`,
            });
        });

        // 5. Certificados
        const certificados = await prisma.certificado.findMany({
            where: {
                fechaVencimiento: { gte: start, lte: end },
            },
            include: { usuario: true },
        });

        certificados.forEach((c) => {
            events.push({
                id: c.id,
                date: c.fechaVencimiento!,
                type: "CERTIFICADO",
                label: c.nombre,
                entityName: `${c.usuario.nombres} ${c.usuario.apellidos}`,
                entityId: c.usuario.id,
                severity: "warning",
                description: `Vencimiento de certificado: ${c.nombre}`,
            });
        });

        // 6. Ordenes de Servicio
        const ordenes = await prisma.ordenServicio.findMany({
            where: {
                fechaVencimiento: { gte: start, lte: end },
                estado: { in: ["PENDIENTE", "EN_REVISION"] },
            },
            include: { vehiculo: true },
        });

        ordenes.forEach((o) => {
            const v = o.vehiculo;
            events.push({
                id: o.id,
                date: o.fechaVencimiento!,
                type: "ORDEN_SERVICIO",
                label: "Mantenimiento Programado",
                entityName: v?.placa || "Vehículo desconocido",
                entityId: v?.id || "",
                severity: "warning",
                description: `Vencimiento de Orden de Servicio ${o.codigo}`,
            });
        });

        // 7. Obligaciones Financieras (Vencimiento de pago)
        const obligaciones = await prisma.obligacionFinanciera.findMany({
            where: {
                fechaVence: { gte: start, lte: end },
                estado: "PENDIENTE",
            },
            include: { usuario: true, vehiculo: true },
        });

        obligaciones.forEach((o) => {
            events.push({
                id: o.id,
                date: o.fechaVence,
                type: "OBLIGACION_FINANCIERA",
                label: o.tipo,
                entityName: o.vehiculo?.placa || o.usuario.nombres,
                entityId: o.vehiculo?.id || o.usuario.id,
                severity: "warning",
                description: `Vencimiento de obligación ${o.tipo}`,
            });
        });

        return events;
    }
}
