/**
 * grand-finale-fixer.js
 * Correcciones estructurales de alto nivel para cerrar tipos Record, reparar callbacks y estabilizar JSX.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Cerrar Records huerfanos: Record<string, { ... } = { -> Record<string, { ... }> = {
    content = content.replace(/(Record\s*<\s*[a-zA-Z0-9_]+\s*,\s*\{[^}]+\})\s*=\s*\{/g, '$1> = {');

    // 2. Reparar el desastre de onClick={() => {}} { ... } -> onClick={() => { ... }}
    // Buscamos onClick seguido de un bloque vacio y luego un bloque huerfano
    content = content.replace(/onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*\{\s*([^}]+)\s*\}\s*\}/g, 'onClick={() => { $1 }}');
    
    // Variante sin llaves en el bloque huerfano
    content = content.replace(/onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*([a-zA-Z0-9_]+\s*\([^)]*\))\s*\}/g, 'onClick={() => $1}');

    // 3. Reparar onChange huerfanos
    content = content.replace(/onChange\s*=\s*\{\s*\(\s*e\s*\)\s*=>\s*\{\s*\}\s*([a-zA-Z0-9_]+\s*\([^)]*\))\s*\}/g, 'onChange={(e) => $1}');
    content = content.replace(/onChange\s*=\s*\{\s*\(\s*e\s*\)\s*=>\s*\{\s*\}\s*\{\s*([^}]+)\s*\}\s*\}/g, 'onChange={(e) => { $1 }}');

    // 4. Reparar Promise huerfanos en searchParams: Promise<{...} }) -> Promise<{...}> })
    content = content.replace(/(searchParams\s*:\s*Promise\s*<\s*\{[^}]+\})\s*\}\)/g, '$1 > })');
    content = content.replace(/(searchParams\s*:\s*Promise\s*<\s*\{[^}]+\})\s*,\s*\}\)/g, '$1 > })');

    // 5. Reparar Prisma types rotos: GetPayload <{...} > ; -> GetPayload <{...}> ;
    content = content.replace(/(GetPayload\s*<\s*\{[^}]+\})\s*>\s*;/g, '$1>;');
    content = content.replace(/(GetPayload\s*<\s*\{[^}]+\})\s*;\s*>/g, '$1>;');

    // 6. Reparar ternarios rotos: {condition ? <tag /> : ( ... )}
    content = content.replace(/\{\s*([a-zA-Z0-9_!.]+)\s*\?\s*(\s*<\s*[A-Z][a-zA-Z0-9]+\s*\/\s*>\s*)\s*:\s*\(/g, '{$1 ? $2 : (');

    // 7. Reparar Hoja de Vida/Link roto
    content = content.replace(/<Link([^>]+)\s*\}\s*>\s*<Button/g, '<Link$1> <Button');

    // 8. Reparar tabs triggered Elegant Light
    content = content.replace(/onValueChange=\{handleTabChange\}\s*\{[^}]+\}\s*>/g, 'onValueChange={handleTabChange} >');

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

console.log('💎 Ejecutando Grand Finale Fixer...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos pulidos: ${filesModified}`);
