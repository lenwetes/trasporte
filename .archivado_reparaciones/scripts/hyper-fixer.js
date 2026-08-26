/**
 * hyper-fixer.js
 * Correcciones agresivas para los errores de sintaxis inducidos.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Corregir href={`...`> -> href={`...`}>
    content = content.replace(/href\s*=\s*\{\s*`([^`}>]+)`\s*>/g, 'href={`$1`}>');
    // Variante con ${} internamente que la regex anterior puede fallar
    content = content.replace(/href\s*=\s*\{\s*`([^`>]+)`\s*>/g, 'href={`$1`}>');

    // 2. Corregir onClick={() => {}} BLOQUE
    content = content.replace(/onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*([^}]+)\s*\}/g, 'onClick={() => { $1 }}');

    // 3. Corregir Record incompleto
    content = content.replace(/:\s*Record\s*<\s*string\s*,\s*\{([^{}]+|\{[^{}]+\})+\}\s*=\s*\{/g, (match) => {
        return match.replace(' = {', '> = {');
    });

    // 4. Corregir searchParams: Promise<{...} }) -> Promise<{...}> })
    content = content.replace(/searchParams\s*:\s*Promise\s*<\s*\{([^>]+)\}\s*\}\)/g, 'searchParams: Promise<{$1}> })');

    // 5. Corregir Promise<... ; prop
    content = content.replace(/(Promise\s*<\s*\{[^}]+\})\s*;\s*([a-z])/g, '$1, $2');

    // 6. Eliminar espacios en tags: < / Link >
    content = content.replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
    content = content.replace(/<\s*([a-zA-Z0-9]+)\s*\/\s*>/g, '<$1 />');

    // 7. Reparar desastres de ternarios
    content = content.replace(/\{\s*([a-zA-Z0-9_!.]+)\s*\?\s*\(\s*<\s*Loader2\s*\/\s*>\s*\)\s*:\s*\(/g, '{$1 ? <Loader2 /> : (');

    // 8. Reparar Prisma Transaction payload
    content = content.replace(/TransaccionGetPayload\s*<\s*\{[^}]+\}\s*>\s*;/g, (match) => {
        return match.replace('>;', '>;'); // Ya esta bien, pero por si acaso
    });

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

console.log('⚡ Ejecutando Hyper Fixer...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos estabilizados: ${filesModified}`);
