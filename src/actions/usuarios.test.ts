import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { createUser } from "./usuarios";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import { UsuarioCreate } from "@/lib/validations";
import { UsuarioWithRelations } from "@/types";

// Mocks
vi.mock("@/auth", () => ({
    auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        usuario: {
            create: vi.fn(),
            findUnique: vi.fn(),
        },
        auditLog: {
            create: vi.fn(),
        },
    },
}));

vi.mock("@/lib/notifications", () => ({
    sendWelcomeEmail: vi.fn(),
}));

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
    unstable_cache: vi.fn((fn) => fn),
}));

describe("createUser Server Action", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fail if user is not authorized", async () => {
        // Mock a non-admin session to test role-based access rejection
        (auth as unknown as Mock).mockResolvedValue({
            user: { id: "user-id", rol: "CONDUCTOR"  },
        });

        const result = await createUser({
            nombres: "Test",
            apellidos: "User",
            email: "test@example.com",
            rol: "CONDUCTOR",
        } as unknown as UsuarioCreate);

        expect(result.success).toBe(false);
        expect(result.error).toBe("No tiene permisos para realizar esta acción");
    });

    it("should create a user successfully when authorized", async () => {
        // Mock Admin Session
        const adminSession = {
            user: {
                id: "admin-id",
                rol: "ADMIN",
                email: "admin@test.com",
            },
        };
        (auth as unknown as Mock).mockResolvedValue(adminSession);

        // Mock Prisma Create
        const mockCreatedUser = {
            id: "new-user-id",
            nombres: "New",
            apellidos: "User",
            email: "new@example.com",
            rol: "CONDUCTOR",
            creadoEn: new Date(),
        };

        vi.mocked(prisma.usuario.create).mockResolvedValue(
            mockCreatedUser as unknown as UsuarioWithRelations,
        );

        const validUserData: UsuarioCreate = {
            nombres: "New",
            apellidos: "User",
            email: "new@example.com",
            tipoDocumento: "CC",
            numeroDocumento: "123456789",
            rol: "CONDUCTOR",
            municipio: "Sincelejo",
            // Required array fields by Zod default
            licencias: [],
            experiencias: [],
            certificados: [],
        };

        const result = await createUser(validUserData);

        expect(result.success).toBe(true);
        expect(result.data).toEqual(JSON.parse(JSON.stringify(mockCreatedUser)));
        expect(prisma.usuario.create).toHaveBeenCalledTimes(1);
    });

    it("should handle validation errors", async () => {
        (auth as unknown as Mock).mockResolvedValue({
            user: { id: "admin-id", rol: "ADMIN"  },
        });

        const invalidData = {
            nombres: "", // Invalid
            email: "not-an-email", // Invalid
        };

        const result = await createUser(
            invalidData as unknown as UsuarioCreate,
        );

        expect(result.success).toBe(false);
        expect(result.data).toBeUndefined();
        expect(prisma.usuario.create).not.toHaveBeenCalled();
    });

    it("should handle duplicate email errors", async () => {
        (auth as unknown as Mock).mockResolvedValue({
            user: { id: "admin-id", rol: "ADMIN"  },
        });

        // Simulate Prisma P2002 error
        interface PrismaError extends Error {
            code?: string;
            meta?: { target: string[] };
        }
        const prismaError = new Error(
            "Unique constraint failed",
        ) as PrismaError;
        prismaError.code = "P2002";
        prismaError.meta = { target: ["email"] };

        vi.mocked(prisma.usuario.create).mockRejectedValue(prismaError);

        const validUserData: UsuarioCreate = {
            nombres: "Duplicate",
            apellidos: "User",
            email: "duplicate@example.com",
            tipoDocumento: "CC",
            numeroDocumento: "987654321",
            rol: "CONDUCTOR",
            municipio: "Sincelejo",
            licencias: [],
            experiencias: [],
            certificados: [],
        };

        const result = await createUser(validUserData);

        expect(result.success).toBe(false);
        expect(result.error).toBe("Este correo electrónico ya está registrado en el sistema.");
    });
});
