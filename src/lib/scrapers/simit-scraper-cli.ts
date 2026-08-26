import { chromium } from "playwright";
import fs from "fs";

/**
 * SIMIT SCRAPER CLI
 * Recibe por stdin un JSON: {"criterio": "73000000", "tipo": "CC"}
 * Devuelve por stdout el resultado JSON
 */
async function main() {
    let browser;
    try {
        const inputData = fs.readFileSync(0, "utf-8");
        const { criterio } = JSON.parse(inputData);

        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        });
        const page = await context.newPage();

        // 1. Navegar con timeout extendido para manejar retos de seguridad (Imperva)
        await page.goto("https://consultasimit.fcm.org.co/simit/#/home-public", { 
            waitUntil: "domcontentloaded", 
            timeout: 60000 
        });

        // Esperar a que el reto de seguridad pase y el input sea visible
        const inputSelector = "#txtBusqueda, input[name='txtNumeroDocumento']";
        try {
            // Verificar si hay un mensaje explícito de servidor caído antes del timeout
            const serverDown = await page.isVisible("text=Server-unavailable, text=Mantenimiento, text=Service Unavailable");
            if (serverDown) {
                throw new Error("SERVIDOR_CAIDO: El portal oficial de SIMIT está actualmente fuera de servicio por mantenimiento.");
            }
            await page.waitForSelector(inputSelector, { timeout: 45000, state: 'visible' });
        } catch (e: unknown) {
            if (e instanceof Error && e.message.includes("SERVIDOR_CAIDO")) throw e;
            throw new Error("No se pudo acceder al formulario principal (posible intermitencia o bloqueo del SIMIT)");
        }

        // 2. Manejar modal publicitario si existe
        try {
            const closeBtn = page.locator("button.close, .modal-header button").first();
            if (await closeBtn.isVisible({ timeout: 2000 })) {
                await closeBtn.click();
            }
        } catch (e) { /* no hay modal */ }

        // 3. Ingresar criterio
        const input = page.locator(inputSelector).first();
        await input.fill(criterio);
        
        // 4. Clic en Consultar
        const btnSelector = "#consultar, button:has-text('Consultar')";
        await page.click(btnSelector);

        // 5. Esperar resultados o "Sin Novedades"
        // El SIMIT suele mostrar una tabla o un mensaje de "En este momento no tiene estados de cuenta pendientes"
        try {
            await page.waitForSelector(".table-responsive, .no-results, .alert-info", { timeout: 15000 });
        } catch (e) {
            throw new Error("Tiempo de espera agotado para los resultados");
        }

        // 6. Extraer información
        const noFines = await page.isVisible("text=no tiene estados de cuenta pendientes") 
                        || await page.isVisible("text=No se encontraron resultados");

        if (noFines) {
            console.log(JSON.stringify({
                success: true,
                estadoCuenta: "PAZ_Y_SALVO",
                valorTotal: 0,
                numeroComparendos: 0,
                comparendos: []
            }));
            return;
        }

        // Si hay tabla, extraer datos
        const rows = await page.locator("table tbody tr").all();
        const comparendos = [];
        let total = 0;

        for (const row of rows) {
            const text = await row.innerText();
            const cols = await row.locator("td").allInnerTexts();
            if (cols.length >= 5) {
                const valorStr = cols[4].replace(/[^0-9]/g, "");
                const valor = parseFloat(valorStr) || 0;
                total += valor;
                comparendos.push({
                    numeroComparendo: cols[0],
                    fecha: cols[1],
                    infraccion: cols[2],
                    estado: cols[3],
                    valor: valor
                });
            }
        }

        console.log(JSON.stringify({
            success: true,
            estadoCuenta: "PENDIENTE",
            valorTotal: total,
            numeroComparendos: comparendos.length,
            comparendos
        }));

    } catch (error: unknown) {
        console.log(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }));
    } finally {
        if (browser) await browser.close();
    }
}

main();
