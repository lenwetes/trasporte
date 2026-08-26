import { BillingGeneratorService } from "./billing/billing-generator.service";
import { BillingQueryService } from "./billing/billing-query.service";
import { ActionResult } from "@/types";

/**
 * @deprecated Use specific services in src/services/billing/ instead.
 */
export class BillingService {
    static async generateMonthlyFees(
        periodo: Date,
        adminId: string,
    ): Promise<ActionResult> {
        return BillingGeneratorService.generateMonthlyFees(periodo, adminId);
    }

    static async previewMonthlyFees(periodo: Date): Promise<ActionResult> {
        return BillingQueryService.previewMonthlyFees(periodo);
    }
}
