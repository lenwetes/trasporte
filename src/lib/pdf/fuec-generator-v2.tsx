import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

export class FuecGenerator {
    /**
     * Llama al CLI de renderizado a través de un subproceso para evitar conflictos con React Canary
     */
    private static async renderViaSubprocess(input: unknown): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(process.cwd(), "src", "lib", "pdf", "fuec-renderer-cli.ts");
            const child = spawn("npx", ["tsx", scriptPath], {
                stdio: ["pipe", "pipe", "pipe"],
                env: { ...process.env, NODE_OPTIONS: "--no-warnings" },
                shell: true
            });

            const chunks: Buffer[] = [];
            const errors: Buffer[] = [];

            // Escribir JSON a stdin
            child.stdin.write(JSON.stringify(input));
            child.stdin.end();

            child.stdout.on("data", (chunk) => chunks.push(chunk));
            child.stderr.on("data", (chunk) => errors.push(chunk));

            child.on("close", (code) => {
                if (code !== 0) {
                    const errorMsg = Buffer.concat(errors).toString();
                    console.error("[FUEC_GENERATOR] Subprocess error:", errorMsg);
                    reject(new Error(`Rendering failed with code ${code}: ${errorMsg}`));
                } else {
                    resolve(Buffer.concat(chunks));
                }
            });
        });
    }

    /**
     * Genera el buffer de un PDF FUEC
     */
    static async generateBuffer(fuecId: string, customBaseUrl?: string): Promise<Buffer> {
        // 1. Obtener datos completos
        const fuec = await prisma.planillaFUEC.findUnique({
            where: { id: fuecId },
            include: {
                vehiculo: true,
                conductor1: true,
                conductor2: true,
                conductor3: true,
                contrato: true,
                resolucion: true,
            },
        });

        if (!fuec) throw new Error("FUEC no encontrado");

        const configResult = await prisma.configuracionGlobal.findUnique({
            where: { id: "default" },
        });

        const config = configResult || {
            nombreEmpresa: "COOPETRAES",
            nit: "900.000.000-0",
        };

        // 3. Generar Código QR
        const baseUrl = customBaseUrl || process.env.NEXT_PUBLIC_APP_URL || "https://app.coopetraes.com";
        const validationUrl = `${baseUrl}/validar/fuec/${fuec.tokenQR}`;
        const qrDataUrl = await QRCode.toDataURL(validationUrl, { margin: 1, width: 200 });

        // 4. Cargar Imagenes
        const getBase64Image = (filename: string) => {
            const baseName = path.parse(filename).name;
            const fullPath = path.join(process.cwd(), "public", "images", "fuec", `${baseName}.png`);
            if (fs.existsSync(fullPath)) {
                return `data:image/png;base64,${fs.readFileSync(fullPath).toString("base64")}`;
            }
            return null;
        };

        const assets = {
            logoEmpresa: getBase64Image("logo-coopetraes.png"),
            logoSuper: getBase64Image("logo-supertransporte.png"),
            logoMinisterio: getBase64Image("logo-ministerio.png"),
            firmaGerente: getBase64Image("gerente-firma.png"),
            selloGerente: getBase64Image("gerente-sello.png"),
            selloEmpresa: getBase64Image("sello-empresa.png"),
        };

        // RENDER VIA SUBPROCESS ISOLATION
        try {
            console.log(`[FUEC_GENERATOR] Iniciando renderizado aislado para ${fuec.id}...`);
            return await this.renderViaSubprocess({
                fuec,
                qrDataUrl,
                config,
                assets
            });
        } catch (error: unknown) {
            console.error("[FUEC_GENERATOR] Error rendering isolated:", error instanceof Error ? error.message : String(error));
            throw error;
        }
    }
}
