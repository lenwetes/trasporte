/**
 * fix-truncated-imports.js
 * Detecta y repara imports de `lucide-react` que están truncados:
 * Patrón: `import {\n  A,\n  B,  ← sin cierre
 * import { X } from "..."` o `export ...`
 * 
 * La solución: agregar `} from "lucide-react";` antes del siguiente import
 */
const fs = require("fs");
const path = require("path");

function getFilesRecursive(dir) {
    const results = [];
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && !['node_modules', '.next', '.git'].includes(entry.name)) {
                results.push(...getFilesRecursive(fullPath));
            } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
                results.push(fullPath);
            }
        }
    } catch {}
    return results;
}

const ROOT = "C:/web/web/src";
const files = getFilesRecursive(ROOT);
let fixed = 0;

for (const file of files) {
    let content;
    try { content = fs.readFileSync(file, "utf8"); } catch { continue; }
    
    let modified = content;
    
    // Pattern: `import {\n  ...\n  LastItem,\nimport {` or `import {\n  ...\n  LastItem,\nexport`
    // Fix: insert `} from "lucide-react";\n` before the offending line
    
    // Detect: an `import {` block that ends with `,\n` and is immediately followed by another `import` or `export`
    // Use regex with multiline
    
    // Match: `import {\n(  [A-Za-z0-9_]+,\n)+` followed directly by `import ` or `export ` or `const `
    const truncatedImportRegex = /^(import \{[\s\S]*?)(,\s*\n)(\s*)(import |export |const |interface |type )/gm;
    
    // We need to check if there's already a `} from` before the next line
    // Strategy: find lines with `import {` that don't have a matching `}`
    const lines = modified.split("\n");
    let inImport = false;
    let importStart = -1;
    let newLines = [...lines];
    let insertions = 0; // track line offset due to insertions
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trimEnd();
        
        if (!inImport && /^import \{/.test(line) && !line.includes('} from')) {
            inImport = true;
            importStart = i;
        } else if (inImport) {
            // Check if this line closes the import
            if (line.includes('} from ') || line.includes('} from"')) {
                inImport = false;
                importStart = -1;
            } else if (/^(import |export |const |interface |type |\/\*\*|\*\/)/.test(line.trimStart()) && !line.trimStart().startsWith('//')) {
                // The import was never closed! Insert closure
                // Determine module - look at surrounding context
                // Default to lucide-react if identifiers look like icons
                const prevLines = lines.slice(importStart, i).join("\n");
                let module = "lucide-react"; // default guess
                
                // Check if any identifiers are typical shadcn
                if (prevLines.includes('Table') || prevLines.includes('Dialog') || prevLines.includes('Card') || prevLines.includes('Badge')) {
                    // Could be shadcn but these were being removed. Just close it.
                }
                
                const actualInsertIdx = i + insertions;
                newLines.splice(actualInsertIdx, 0, `} from "${module}";`);
                insertions++;
                console.log(`FIXED truncated import in ${path.relative("C:/web/web", file)} at line ${i + 1}`);
                
                inImport = false;
                importStart = -1;
                fixed++;
            }
        }
    }
    
    const newContent = newLines.join("\n");
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, "utf8");
    }
}

console.log(`\nTotal fixes: ${fixed}`);
