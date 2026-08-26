/**
 * multidimensional-repair.js
 * Repara fracturas multilineales en handlers y operadores de comparación JSX.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. REPARAR HANDLERS MULTILINEALES
    // Busca patrones de: onClick={() => {}} Llamada(...) }
    // Usamos [\s\S]*? para saltar líneas
    content = content.replace(/(onClick|onChange)\s*=\s*\{\s*\(\s*([a-zA-Z0-9_, ]*)\s*\)\s*=>\s*\{\s*\}\s*([\s\S]*?)\s*\}/g, (match, prop, args, body) => {
        // Si el cuerpo parece una llamada o lógica válida, la metemos dentro
        if (body.trim().length > 0 && !body.includes('=>')) {
            return `${prop}={( ${args} ) => { ${body.trim()} }}`;
        }
        return match;
    });

    // 2. REPARAR OPERADORES DE COMPARACIÓN EN JSX
    // Corregir: ) < new Date() -> ) < (new Date()) para evitar que < se vea como tag
    content = content.replace(/\)\s*<\s*new\s*Date\s*\(\s*\)/g, ') < (new Date())');
    
    // 3. REPARAR GENÉRICOS DE ESTADO (useState<Array<{... >)
    content = content.replace(/useState\s*<\s*Array\s*<\s*\{([^{}]+)\}\s*>/g, 'useState<Array<{$1}>>');

    // 4. REPARAR ATRIBUTOS TRUNCADOS (href={`...` >)
    content = content.replace(/href\s*=\s*\{\s*`([^`>]+)`\s*>/g, 'href={`$1`}>');

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

console.log('🌌 Reparando fracturas multilineales...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✨ Estabilidad restaurada en ${filesModified} archivos.`);
