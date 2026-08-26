import { pdf } from "@react-pdf/renderer";
import React from "react";
import { FuecPDFDocument } from "./fuec-pdf";
import fs from "fs";

/**
 * Script de renderizado aislado
 */
async function main() {
    try {
        // Leer datos de stdin
        const chunks: Buffer[] = [];
        for await (const chunk of process.stdin) {
            chunks.push(chunk);
        }
        
        const inputData = Buffer.concat(chunks).toString("utf-8");
        const { fuec, qrDataUrl, config, assets } = JSON.parse(inputData);

        const element = React.createElement(FuecPDFDocument, {
            data: fuec,
            qrDataUrl,
            config,
            assets
        });

        // @ts-ignore - En Node esto devuelve un buffer o stream
        const result = await pdf(element).toBuffer();
        
        if (Buffer.isBuffer(result)) {
            process.stdout.write(result);
        } else if (result && typeof result === "object" && "on" in result && typeof (result as { on: unknown }).on === "function") {
            // Es un stream (ReadableStream)
            for await (const chunk of result) {
                process.stdout.write(chunk);
            }
        } else {
            throw new Error(`Resultado de renderizado inesperado: ${typeof result}`);
        }
    } catch (error: unknown) {
        console.error("CLI_ERROR:", error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

main();
