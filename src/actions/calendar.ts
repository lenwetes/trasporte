"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { ActionResult } from "@/types";
import { endOfMonth, startOfMonth, addMonths } from "date-fns";
import crypto from "crypto";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  endDate?: string; // For trips/FUEC
  type: "FUEC" | "DOCUMENTO" | "MANTENIMIENTO" | "NOTA" | "OTRO";
  priority: "BAJA" | "MEDIA" | "ALTA";
  estado: "PENDIENTE" | "EN_PROCESO" | "COMPLETADO";
  ejecutado: boolean;
  fechaEjecucion?: string;
  metadata?: Record<string, unknown> | null;
}

export async function getCalendarEvents(monthOffset: number = 0): Promise<ActionResult<CalendarEvent[]>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  const today = new Date();
  const targetMonth = monthOffset === 0 ? today : addMonths(today, monthOffset);
  const start = startOfMonth(targetMonth);
  const end = endOfMonth(targetMonth);

  try {
    const [fuecs, documentos, mantenimientos, eventosManuales] = await Promise.all([
      // 1. FUEC (Viajes)
      prisma.planillaFUEC.findMany({
        where: {
          OR: [
            { fechaInicio: { gte: start, lte: end } },
            { fechaFin: { gte: start, lte: end } },
          ],
          estado: "ACTIVO"
        },
        include: { vehiculo: true, conductor1: true }
      }),
      // 2. Documentos por vencer
      prisma.documentoVehiculo.findMany({
        where: {
          fechaVencimiento: { gte: start, lte: end },
          vehiculo: { activo: true }
        },
        include: { vehiculo: true }
      }),
      // 3. Mantenimientos realizados
      prisma.mantenimientoRealizado.findMany({
        where: { fecha: { gte: start, lte: end } },
        include: { vehiculo: true, plan: true }
      }),
      // 4. Notas manuales
      prisma.eventoCalendario.findMany({
        where: {
          fecha: { gte: start, lte: end },
          usuarioId: session.user.id
        }
      })
    ]);

    const allEvents: CalendarEvent[] = [];

    // Map FUEC
    fuecs.forEach((f) => {
      const rutaArray = Array.isArray(f.ruta) ? f.ruta : [];
      const rutaText = rutaArray.map((r: unknown) => {
        if (typeof r === 'object' && r !== null) {
          const dict = r as Record<string, unknown>;
          return `${dict.origen} > ${dict.destino}`;
        }
        return '';
      }).join(", ");
      
      allEvents.push({
        id: `fuec-${f.id}`,
        title: `Viaje: ${f.vehiculo.placa}`,
        description: `Ruta: ${rutaText || "No definida"} - Conductor: ${f.conductor1.nombres} ${f.conductor1.apellidos}`,
        date: f.fechaInicio.toISOString(),
        endDate: f.fechaFin.toISOString(),
        type: "FUEC",
        priority: "BAJA",
        estado: "EN_PROCESO",
        ejecutado: f.estado !== "ACTIVO",
        metadata: { placa: f.vehiculo.placa, conductor: f.conductor1.nombres, ruta: f.ruta }
      });
    });

    // Map Documentos
    documentos.forEach((d) => {
      if (!d.fechaVencimiento) return;
      allEvents.push({
        id: `doc-${d.id}`,
        title: `Vence: ${d.tipo} - ${d.vehiculo.placa}`,
        description: `El documento ${d.tipo} del vehículo ${d.vehiculo.placa} vence este día.`,
        date: d.fechaVencimiento.toISOString(),
        type: "DOCUMENTO",
        priority: "ALTA",
        estado: "PENDIENTE",
        ejecutado: false,
        metadata: { placa: d.vehiculo.placa, tipo: d.tipo }
      });
    });

    // Map Mantenimientos
    mantenimientos.forEach((m) => {
      allEvents.push({
        id: `maint-${m.id}`,
        title: `Mantenimiento: ${m.vehiculo.placa}`,
        description: `Plan: ${m.plan.nombre} - Costo: ${m.costo || 'N/A'}`,
        date: m.fecha.toISOString(),
        type: "MANTENIMIENTO",
        priority: "MEDIA",
        estado: "COMPLETADO",
        ejecutado: true,
        metadata: { placa: m.vehiculo.placa, plan: m.plan.nombre }
      });
    });

    // Map Eventos Manuales
    eventosManuales.forEach((e) => {
      allEvents.push({
        id: `manual-${e.id}`,
        title: e.titulo,
        description: e.descripcion || undefined,
        date: new Date(e.fecha).toISOString(),
        type: "NOTA",
        priority: e.prioridad as CalendarEvent["priority"],
        estado: e.estado as CalendarEvent["estado"],
        ejecutado: e.ejecutado || false,
        fechaEjecucion: e.fechaEjecucion ? new Date(e.fechaEjecucion).toISOString() : undefined,
        metadata: (e.metadata as Record<string, unknown>) || {}
      });
    });

    return { success: true, data: allEvents };
  } catch (error) {
    console.error("Error fetching calendar events (Bridge):", error);
    return { success: false, error: "Error al cargar eventos del calendario" };
  }
}

export async function createCalendarEvent(data: {
  titulo: string;
  descripcion?: string;
  fecha: Date;
  tipo: string;
  prioridad: string;
  estado?: string;
  metadata?: Record<string, unknown> | null;
}): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado" };

  try {
    const event = await prisma.eventoCalendario.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        fecha: data.fecha,
        tipo: data.tipo,
        prioridad: data.prioridad,
        estado: data.estado || "PENDIENTE",
        ejecutado: false,
        usuarioId: session.user.id,
        metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : Prisma.JsonNull
      }
    });
    return { success: true, data: { id: event.id } };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return { success: false, error: `Error al crear el evento: ${error instanceof Error ? error.message : "Desconocido"}` };
  }
}

export async function updateCalendarEventStatus(id: string, estado: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado" };

  try {
    const actId = id.startsWith("manual-") ? id.replace("manual-", "") : id;
    await prisma.eventoCalendario.update({
      where: { id: actId },
      data: { estado }
    });
    return { success: true, data: { id: actId } };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Error al actualizar estado" };
  }
}

export async function toggleEventExecution(id: string, ejecutado: boolean): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autorizado" };

  try {
    const actId = id.startsWith("manual-") ? id.replace("manual-", "") : id;
    const fechaEjecucion = ejecutado ? new Date() : null;
    await prisma.eventoCalendario.update({
      where: { id: actId },
      data: { 
        ejecutado,
        fechaEjecucion
      }
    });
    return { success: true, data: { id: actId } };
  } catch (error) {
    console.error("Error toggling execution:", error);
    return { success: false, error: "Error al cambiar estado de ejecución" };
  }
}
