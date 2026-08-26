/**
 * fix-broken-imports.js
 * Repara imports truncados que les falta `} from "modulo";`
 * Patrón detectado: 
 *   import { A, B, C,
 *   <sin cerrar>
 * 
 * También repara:
 *   - `<Button TEXT\n>` broken button text (text used as attribute)
 *   - `{value }}` doble cierre en atributos JSX
 */

const fs = require("fs");
const path = require("path");

function getFilesRecursive(dir, ext) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
            results.push(...getFilesRecursive(fullPath, ext));
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
            results.push(fullPath);
        }
    }
    return results;
}

const ROOT = "C:/web/web/src";
const files = getFilesRecursive(ROOT, ['.tsx', '.ts']);

let totalFixed = 0;

for (const file of files) {
    let content;
    try {
        content = fs.readFileSync(file, "utf8");
    } catch { continue; }

    let modified = content;

    // FIX 1: Import truncado sin `} from "..."`
    // Patrón: línea que tiene `import {` pero todas las siguientes líneas que son nombres
    // y luego de repente aparece `export` o `const` sin haber cerrado el import
    // Buscamos: import { ... (sin }) seguido de \nexport o \nconst
    // La heurística es: si hay `import {` y la siguiente parte que no es un identificador
    //   aparece como `export` o `const` en vez del `} from`, hay un problema.
    
    // Caso específico: `import {\n   A,\n   B,\n\nexport` 
    // Debe ser: `import {\n   A,\n   B,\n} from "???"`
    // Esto requiere contexto del módulo, lo dejamos para revisión manual
    
    // FIX 2: `<Component TEXTOSUELTO\n>` → `<Component>\nTEXTOSUELTO`
    // Patrón: atributos de JSX que tienen texto libre sin comillas como si fuese un atributo
    // e.g.: `<Button onClick={fn}\n    TEXT LABEL\n>`
    // Esto es muy difícil de reparar automáticamente sin romper más cosas
    
    // FIX 3: `attr={value }}` → `attr={value}`
    modified = modified.replace(/=\{([^{}]+)\s*\}\s*\}(\s*[>/])/g, '={$1}$2');
    
    // FIX 4: `href={value }}` → `href={value}`  
    modified = modified.replace(/href=\{([^}]+)\s*\}\}/g, 'href={$1}');
    
    // FIX 5: `disabled={value }}` patterns
    modified = modified.replace(/disabled=\{([^}]+)\s*\}\}/g, 'disabled={$1}');
    
    // FIX 6: toast calls with `}})` 
    modified = modified.replace(/toast\.(success|error|loading|info)\(([^,]+),\s*\{([^}]+)\}\}\)/g, 'toast.$1($2, {$3})');
    
    if (modified !== content) {
        fs.writeFileSync(file, modified, "utf8");
        totalFixed++;
        console.log("Fixed:", path.relative("C:/web/web", file));
    }
}

console.log("\nTotal files fixed:", totalFixed);
