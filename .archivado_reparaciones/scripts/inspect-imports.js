/**
 * fix-imports.js - Repara imports truncados (falta el `} from "..."` al final)
 * Patrón: import { A, B, C,\nexport → import { A, B, C } from "X";\nexport
 */
const fs = require("fs");
const path = require("path");

// Archivos con imports rotos conocidos del análisis de errores
const BROKEN_IMPORT_FILES = [
    "src/app/dashboard/safety/calendario/_components/safety-calendar-view.tsx",
    "src/app/dashboard/safety/flota/_components/semaforo-section.tsx",
    "src/app/dashboard/safety/indicadores/_components/safety-indicators.tsx",
    "src/app/dashboard/safety/operatividad/_components/owners-table.tsx",
    "src/app/dashboard/safety/operatividad/_components/vehicles-blocking-table.tsx",
    "src/app/dashboard/safety/sg-sst/[id]/page.tsx",
    "src/app/dashboard/safety/sg-sst/_components/sgsst-table-row.tsx",
    "src/app/dashboard/safety/sg-sst/_components/types.ts",
    "src/app/dashboard/siniestros/[id]/page.tsx",
    "src/app/dashboard/usuarios/[id]/_components/social-security-card.tsx",
    "src/app/dashboard/usuarios/[id]/_components/user-info-card.tsx",
    "src/app/dashboard/vehiculos/[id]/_components/document-upload-card.tsx",
    "src/app/dashboard/vehiculos/[id]/_components/documents-tab.tsx",
    "src/app/dashboard/vehiculos/[id]/_components/operability-control-panel.tsx",
    "src/app/dashboard/vehiculos/[id]/_components/preoperacional-history.tsx",
    "src/app/dashboard/vehiculos/[id]/_components/spare-parts-tab.tsx",
    "src/app/dashboard/vehiculos/_components/vehiculos-listado-view.tsx",
    "src/app/validar/fuec/[token]/page.tsx",
    "src/components/finance/account-tree-view.tsx",
    "src/components/finance/concept-list.tsx",
    "src/components/finance/transactions-table.tsx",
    "src/components/forms/usuario-form-sections/additional-info-section.tsx",
    "src/components/forms/usuario-form-sections/license-section.tsx",
    "src/components/forms/vehiculo/transit-license-section.tsx",
];

const ROOT = "C:/web/web";
let fixed = 0;

for (const relPath of BROKEN_IMPORT_FILES) {
    const filePath = path.join(ROOT, relPath);
    if (!fs.existsSync(filePath)) {
        console.log("NOT FOUND:", filePath);
        continue;
    }
    
    let content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    
    // Print first 20 lines of each file for inspection
    console.log("\n=== FILE:", relPath, "===");
    for (let i = 0; i < Math.min(20, lines.length); i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
}
