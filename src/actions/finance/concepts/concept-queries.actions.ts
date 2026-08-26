"use server";

import { Rol, TipoTransaccion } from "@prisma/client";
import { withAuth } from "@/lib/safe-action";
import { Session } from "next-auth";
import { ConceptService } from "@/services/concept.service";
import type { ActionResult } from "@/types";
import { serializeDecimal } from "@/lib/utils";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";

/**
 * Patrón 5.1: Obtener todos los conceptos activos
 */
export const getAllConceptsAction = withAuth(
    async (session: Session): Promise<ActionResult> => {
        if (!hasPermission(session.user?.rol as Rol, "FINANCIERO", "READ")) {
            return unauthorizedResponse();
        }

        try {
            const concepts = await ConceptService.getAllConcepts();
            return serializeDecimal({
                success: true,
                data: concepts,
            });
        } catch (error) {
            logger.error({ error }, "getAllConceptsAction error");
            return { success: false, error: "Error al obtener conceptos" };
        }
    },
    "getAllConceptsAction"
);

/**
 * Patrón 5.1: Obtener conceptos por tipo (INGRESO o EGRESO)
 */
export const getConceptsByTypeAction = withAuth(
    async (session: Session, tipo: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user?.rol as Rol, "FINANCIERO", "READ")) {
            return unauthorizedResponse();
        }

        if (
            tipo !== TipoTransaccion.INGRESO &&
            tipo !== TipoTransaccion.EGRESO
        ) {
            return { success: false, error: "Tipo de transacción inválido" };
        }

        try {
            const concepts = await ConceptService.getConceptsByType(tipo);
            return serializeDecimal({
                success: true,
                data: concepts,
            });
        } catch (error) {
            logger.error({ error, tipo }, "getConceptsByTypeAction error");
            return {
                success: false,
                error: "Error al obtener conceptos por tipo",
            };
        }
    },
    "getConceptsByTypeAction"
);

/**
 * Patrón 5.1: Buscar conceptos por nombre
 */
export const searchConceptsAction = withAuth(
    async (session: Session, params?: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user?.rol as Rol, "FINANCIERO", "READ")) {
            return unauthorizedResponse();
        }

        const {
            query = "",
            tipo,
            limit = 20,
        } = (params as {
            query?: string;
            tipo?: TipoTransaccion;
            limit?: number;
        }) || {};

        try {
            const concepts = await ConceptService.searchConcepts(
                query,
                tipo,
                limit,
            );
            return serializeDecimal({
                success: true,
                data: concepts,
            });
        } catch (error) {
            logger.error({ error, query }, "searchConceptsAction error");
            return { success: false, error: "Error al buscar conceptos" };
        }
    },
    "searchConceptsAction"
);
