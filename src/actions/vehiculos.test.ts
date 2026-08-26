import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { createVehiculo } from "./vehiculos";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { VehiculoCreate } from "@/lib/validations";
import { Vehiculo } from "@prisma/client";

// Mocks
vi.mock("@/auth", () => ({
    auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        vehiculo: {
            create: vi.fn(),
            findUnique: vi.fn(),
            findMany: vi.fn(),
            count: vi.fn(),
        },
        planMantenimiento: {
            findMany: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
        },
    },
}));

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
    unstable_cache: vi.fn((fn) => fn),
}));

describe("createVehiculo Server Action", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fail if user has no permission", async () => {
        (auth as unknown as Mock).mockResolvedValue({
            user: { id: "user-id", rol: "CONDUCTOR"  },
        });

        const result = await createVehiculo({} as unknown as VehiculoCreate);

        expect(result.success).toBe(false);
        expect(result.error).toBe("No tiene permisos para realizar esta acción");
    });

    it("should create a vehicle successfully when authorized (ADMIN)", async () => {
        (auth as unknown as Mock).mockResolvedValue({
            user: { id: "admin-id", rol: "ADMIN"  },
        });

        const mockVehiculo = {
            id: "v1",
            placa: "AAA-123",
            marca: "Toyota",
            modelo: "2024",
            creadoEn: new Date(),
        } as unknown as Vehiculo;

        vi.mocked(prisma.vehiculo.create).mockResolvedValue(mockVehiculo);

        const validData: VehiculoCreate = {
            placa: "AAA-123",
            marca: "Toyota",
            modelo: "Corolla",
            anho: 2024,
            color: "Blanco",
            cilindraje: "1800",
            peso: "1500kg",
            capacidadPuestos: 5,
            numeroMotor: "MOT-123",
            numeroChasis: "CHA-123",
            lugarExpedicion: "Sincelejo",
            clase: "OTRO",
            modalidad: "FLOTA_PROPIA",
            propietario: "Coopetraes",
        };

        const result = await createVehiculo(validData);

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockVehiculo);
        expect(prisma.vehiculo.create).toHaveBeenCalled();
    });

    it("should handle duplicate plate error", async () => {
        (auth as unknown as Mock).mockResolvedValue({
            user: { id: "admin-id", rol: "ADMIN"  },
        });

        // Simulate Prisma P2002 error
        interface PrismaError extends Error {
            code?: string;
        }
        const prismaError = new Error("Unique constraint") as PrismaError;
        prismaError.code = "P2002";
        vi.mocked(prisma.vehiculo.create).mockRejectedValue(prismaError);

        const validData: VehiculoCreate = {
            placa: "AAA-123",
            marca: "Toyota",
            modelo: "Corolla",
            anho: 2024,
            color: "Blanco",
            cilindraje: "1800",
            peso: "1500kg",
            capacidadPuestos: 5,
            numeroMotor: "MOT-123",
            numeroChasis: "CHA-123",
            lugarExpedicion: "Sincelejo",
            clase: "OTRO",
            modalidad: "FLOTA_PROPIA",
            propietario: "Coopetraes",
        };

        const result = await createVehiculo(validData);

        expect(result.success).toBe(false);
        expect(result.error).toBe("Ya existe un vehículo con esta placa");
    });
});
