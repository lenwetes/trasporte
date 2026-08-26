import {
    IntegrationEventService,
    EventPayload,
    EventProcessingResult,
} from "./integration/integration-event.service";
import { IntegrationRuleService } from "./integration/integration-rule.service";
import { Prisma, ReglaContable } from "@prisma/client";

/**
 * @deprecated Use specific services in src/services/integration/ instead.
 */
export class IntegrationService {
    static async processEvent(
        eventType: string,
        payload: EventPayload,
        tx?: Prisma.TransactionClient,
    ): Promise<EventProcessingResult> {
        return IntegrationEventService.processEvent(eventType, payload, tx);
    }

    static async getAllRules(): Promise<ReglaContable[]> {
        return IntegrationRuleService.getAllRules();
    }

    static async createRule(input: {
        evento: string;
        descripcion?: string;
        cuentaDebitoId: string;
        cuentaCreditoId: string;
    }): Promise<ReglaContable> {
        return IntegrationRuleService.createRule(input);
    }

    static async updateRule(
        evento: string,
        input: {
            descripcion?: string;
            cuentaDebitoId?: string;
            cuentaCreditoId?: string;
            activo?: boolean;
        },
    ): Promise<ReglaContable> {
        return IntegrationRuleService.updateRule(evento, input);
    }

    static async deactivateRule(evento: string): Promise<ReglaContable> {
        return IntegrationRuleService.deactivateRule(evento);
    }

    static async activateRule(evento: string): Promise<ReglaContable> {
        return IntegrationRuleService.activateRule(evento);
    }
}
