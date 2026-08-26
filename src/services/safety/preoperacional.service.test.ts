import { describe, it, expect, vi, beforeEach } from "vitest";
import { PreoperacionalService } from "./preoperacional.service";
import { prisma } from "@/lib/prisma";
import { EstadoPreoperacional, Preoperacional } from "@prisma/client";
import { PreoperacionalCreate } from "@/lib/validations/safety";

vi.mock("@/lib/prisma", () => ({
    prisma: {
        $transaction: vi.fn(),
        preoperacional: {
            findMany: vi.fn(),
            findFirst: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}));

vi.mock("@/lib/logger", () => ({
    default: {
        error: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
    },
}));

interface MockPrismaTx {
    preoperacional: {
        create: ReturnType<typeof vi.fn>;
    };
    vehiculo: {
        update: ReturnType<typeof vi.fn>;
    };
}

describe("PreoperacionalService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("create", () => {
        it("should approve inspection if no critical failures exist", async () => {
            const mockData: PreoperacionalCreate = {
                vehiculoId: "v1-uuid-fake-123",
                conductorId: "u1-uuid-fake-123",
                fecha: new Date(),
                kilometraje: 1000,
                detalles: [
                    {
                        item: "Frenos",
                        estado: true,
                        criticidad: "ALTA",
                        observacion: null,
                    },
                    {
                        item: "Luces",
                        estado: false,
                        criticidad: "BAJA",
                        observacion: "Bombillo quemado",
                    },
                ],
                observaciones: null,
                firmaDigital: null,
            };

            const mockTx: MockPrismaTx = {
                preoperacional: {
                    create: vi.fn().mockResolvedValue({
                        id: "p1",
                        ...mockData,
                        resultado: EstadoPreoperacional.APROBADO,
                    }),
                },
                vehiculo: {
                    update: vi.fn(),
                },
            };

            vi.mocked(prisma.$transaction).mockImplementation(
                async (callback) =>
                    await callback(
                        mockTx as unknown as Parameters<
                            Parameters<typeof prisma.$transaction>[0]
                        >[0],
                    ),
            );

            const result = await PreoperacionalService.create(mockData);

            expect(result.success).toBe(true);
            expect(mockTx.preoperacional.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        resultado: EstadoPreoperacional.APROBADO,
                    }),
                }),
            );
            expect(mockTx.vehiculo.update).toHaveBeenCalledWith({
                where: { id: mockData.vehiculoId },
                data: { activo: true, kilometrajeActual: 1000 },
            });
        });

        it("should reject inspection and block vehicle if critical failure exists", async () => {
            const mockData: PreoperacionalCreate = {
                vehiculoId: "v1-uuid-fake-123",
                conductorId: "u1-uuid-fake-123",
                fecha: new Date(),
                kilometraje: 1000,
                detalles: [
                    {
                        item: "Frenos",
                        estado: false,
                        criticidad: "ALTA",
                        observacion: "Falla total",
                    },
                ],
                observaciones: null,
                firmaDigital: null,
            };

            const mockTx: MockPrismaTx = {
                preoperacional: {
                    create: vi.fn().mockResolvedValue({
                        id: "p1",
                        ...mockData,
                        resultado: EstadoPreoperacional.RECHAZADO,
                    }),
                },
                vehiculo: {
                    update: vi.fn(),
                },
            };

            vi.mocked(prisma.$transaction).mockImplementation(
                async (callback) =>
                    await callback(
                        mockTx as unknown as Parameters<
                            Parameters<typeof prisma.$transaction>[0]
                        >[0],
                    ),
            );

            const result = await PreoperacionalService.create(mockData);

            expect(result.success).toBe(true);
            expect(mockTx.preoperacional.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        resultado: EstadoPreoperacional.RECHAZADO,
                    }),
                }),
            );
            expect(mockTx.vehiculo.update).toHaveBeenCalledWith({
                where: { id: mockData.vehiculoId },
                data: { activo: false },
            });
        });
    });

    describe("getLatest", () => {
        it("should return the latest inspection", async () => {
            const mockPreop = { id: "p1", vehiculoId: "v1" } as Preoperacional;
            vi.mocked(prisma.preoperacional.findFirst).mockResolvedValue(
                mockPreop,
            );

            const result = await PreoperacionalService.getLatest("v1");

            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockPreop);
            expect(prisma.preoperacional.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { vehiculoId: "v1"  },
                    orderBy: { fecha: "desc"  },
                }),
            );
        });
    });
});
