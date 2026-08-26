import { describe, it, expect, vi, beforeEach } from "vitest";
import { IndicadoresService } from "./indicadores.service";
import { prisma } from "@/lib/prisma";
import { Siniestro, InvestigacionSiniestro } from "@prisma/client";

vi.mock("@/lib/prisma", () => ({
    prisma: {
        siniestro: {
            findMany: vi.fn(),
        },
        usuario: {
            count: vi.fn(),
        },
    },
}));

vi.mock("@/lib/logger", () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
    },
}));

type SiniestroWithInvestigacion = Siniestro & {
    investigacion: InvestigacionSiniestro | null;
};

interface KPIData {
    periodo: number;
    totalSiniestros: number;
    totalDiasPerdidos: number;
    frecuencia: number;
    severidad: number;
    porGravedad: {
        soloDanos: number;
        conHeridos: number;
        mortal: number;
    };
}

describe("IndicadoresService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should calculate KPIs correctly", async () => {
        const mockSiniestros: Partial<SiniestroWithInvestigacion>[] = [
            {
                id: "1",
                gravedad: "SOLO_DANOS",
                investigacion: {
                    diasPerdidos: 2,
                } as unknown as InvestigacionSiniestro,
            },
            {
                id: "2",
                gravedad: "CON_HERIDOS",
                investigacion: {
                    diasPerdidos: 5,
                } as unknown as InvestigacionSiniestro,
            },
            { id: "3", gravedad: "SOLO_DANOS", investigacion: null },
        ];

        vi.mocked(prisma.siniestro.findMany).mockResolvedValue(
            mockSiniestros as SiniestroWithInvestigacion[],
        );
        vi.mocked(prisma.usuario.count).mockResolvedValue(10); // 10 conductors

        const result = await IndicadoresService.getSafetyKPIs(2025);

        expect(result.success).toBe(true);
        if (result.success) {
            const data = result.data as KPIData;
            expect(data.totalSiniestros).toBe(3);
            expect(data.totalDiasPerdidos).toBe(7);

            expect(data.frecuencia).toBe(25);
            expect(data.severidad).toBe(58.33);
            expect(data.porGravedad.soloDanos).toBe(2);
            expect(data.porGravedad.conHeridos).toBe(1);
            expect(data.porGravedad.mortal).toBe(0);
        }
    });

    it("should return zero KPIs if no conductors found", async () => {
        vi.mocked(prisma.siniestro.findMany).mockResolvedValue([]);
        vi.mocked(prisma.usuario.count).mockResolvedValue(0);

        const result = await IndicadoresService.getSafetyKPIs(2025);

        expect(result.success).toBe(true);
        if (result.success && result.data) {
            const data = result.data as KPIData;
            expect(data.frecuencia).toBe(0);
            expect(data.severidad).toBe(0);
        }
    });

    it("should handle database errors gracefully", async () => {
        vi.mocked(prisma.siniestro.findMany).mockRejectedValue(
            new Error("DB Error"),
        );

        const result = await IndicadoresService.getSafetyKPIs(2025);

        expect(result.success).toBe(false);
        expect(result.error).toBe("Error al calcular indicadores");
    });
});
