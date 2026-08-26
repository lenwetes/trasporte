import { describe, it, expect } from "vitest";
import { calculateDocumentAlert } from "./alerts";
import { ReglaAlerta } from "@prisma/client";

describe("calculateDocumentAlert", () => {
    // Mock Rule: 30 days anticipation
    const mockRule: ReglaAlerta = {
        id: "1",
        tipoDocumento: "SOAT",
        diasAnticipacion: 30,
        activo: true,
        // Mocking other fields if necessary
        creadoEn: new Date(),
        actualizadoEn: new Date(),
    };

    it("should return RED if document is expired", () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);

        const doc = { id: "d1", tipo: "SOAT", fechaVencimiento: pastDate };
        const result = calculateDocumentAlert(doc, mockRule);

        expect(result?.status).toBe("red");
        expect(result?.daysUntilExpiry).toBeLessThan(0);
    });

    it("should return YELLOW if expiration is within anticipation window", () => {
        const nearDate = new Date();
        nearDate.setDate(nearDate.getDate() + 15); // 15 days which is < 30 days warning

        const doc = { id: "d1", tipo: "SOAT", fechaVencimiento: nearDate };
        const result = calculateDocumentAlert(doc, mockRule);

        expect(result?.status).toBe("yellow");
        expect(result?.daysUntilExpiry).toBeLessThanOrEqual(30);
    });

    it("should return GREEN if expiration is far away", () => {
        const farDate = new Date();
        farDate.setDate(farDate.getDate() + 60); // 60 days > 30 days

        const doc = { id: "d1", tipo: "SOAT", fechaVencimiento: farDate };
        const result = calculateDocumentAlert(doc, mockRule);

        expect(result?.status).toBe("green");
    });

    it("should return null if rule is inactive", () => {
        const inactiveRule = { ...mockRule, activo: false };
        const doc = { id: "d1", tipo: "SOAT", fechaVencimiento: new Date() };

        const result = calculateDocumentAlert(doc, inactiveRule);
        expect(result).toBeNull();
    });
});
