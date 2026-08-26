/**
 * scavenger.js
 * Elimina líneas huérfanas y repara cierres de tipos.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Eliminar líneas que solo contienen '>' (huérfanos de strip)
    // Se asegura de que no sea parte de un tag legítimo multilínea
    // Si la línea anterior termina en '}' y esta es '>', es probable que sea basura.
    content = content.replace(/\}\n\s*>\n/g, '}\n');
    content = content.replace(/\}\s*>\s*(\)|;|\s|,)/g, '}$1');
    
    // Caso específico: > solo en una línea
    const lines = content.split('\n');
    const newLines = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '>') {
            // Si la línea anterior parece un cierre de objeto o prop
            if (i > 0 && (lines[i-1].includes('}') || lines[i-1].includes('"') || lines[i-1].includes(')'))) {
                continue; // Saltar esta línea huérfana
            }
        }
        newLines.push(lines[i]);
    }
    content = newLines.join('\n');

    // 2. Reparar tipos genéricos rotos (v4)
    // Buscamos LetraMayuscula < { sin } antes del >
    content = content.replace(/([A-Z][a-zA-Z0-9]+)\s*<\s*\{\s*([^{}]+)\s*>/g, '$1<{$2}>');
    content = content.replace(/([A-Z][a-zA-Z0-9]+)\s*<\s*\{\s*([^{}]+)\s*(\)|;)/g, '$1<{$2}>$3');

    // 3. Reparar useState<> vacíos
    content = content.replace(/useState\s*<\s*>/g, 'useState<any>');
    content = content.replace(/useState\s*<\s*(\s+)\s*>/g, 'useState<any>');

    // 4. Reparar cierres dobles o triples
    content = content.replace(/\}\}\s*>\s*(\)|;)/g, '}$1');

    // 5. Reparar la ruta dinámica [id] rotas
    content = content.replace(/params\s*:\s*Promise\s*<\s*\{\s*id\s*:\s*string\s*>\s*\}/g, 'params: Promise<{ id: string }>');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        filesModified++;
    }
}

function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
            processDirectory(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
            repair(fullPath);
        }
    }
}

console.log('🧹 Limpiando basura visual y huérfanos...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos limpiados: ${filesModified}`);
