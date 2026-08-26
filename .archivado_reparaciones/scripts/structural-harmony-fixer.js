/**
 * structural-harmony-fixer.js
 * Repara la lógica de handlers y tipos genéricos rotos por procesos de limpieza masivos.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. REPARAR HANDLERS DISJUNTOS
    // Busca: onClick={() => {}} functionName(args)
    // -> onClick={() => functionName(args)}
    content = content.replace(/(onClick|onChange)\s*=\s*\{\s*\(\s*([a-zA-Z0-9_, ]*)\s*\)\s*=>\s*\{\s*\}\s*(\s*[a-zA-Z0-9_.]+\s*\([^;]*?\))\s*\}/g, '$1={($2) => $3}');
    
    // Variante con bloque de llaves huerfano: onClick={() => {}} { setIsOpen(true) }
    content = content.replace(/(onClick|onChange)\s*=\s*\{\s*\(\s*([a-zA-Z0-9_, ]*)\s*\)\s*=>\s*\{\s*\}\s*\{\s*([^}]+)\s*\}\s*\}/g, '$1={($2) => { $3 }}');

    // 2. REPARAR TIPOS TRUNCADOS (React state, Records, Promises)
    // Array<{... >> a Array<{...}>>
    content = content.replace(/(Array\s*<\s*\{[^{}]+)\s*>>/g, '$1 }>>');
    
    // Record<..., {...} = { -> Record<..., {...}> = {
    content = content.replace(/(Record\s*<\s*[a-zA-Z0-9_]+\s*,\s*\{[^{}]+\})\s*=\s*\{/g, '$1> = {');

    // searchParams: Promise<{...} }) -> Promise<{...}> })
    content = content.replace(/(searchParams\s*:\s*Promise\s*<\s*\{[^}]+\})\s*\}\)/g, '$1 > })');
    content = content.replace(/(searchParams\s*:\s*Promise\s*<\s*\{[^}]+\})\s*,\s*\}\)/g, '$1 > })');

    // 3. REPARAR ATRIBUTOS JSX "DECAPITADOS"
    // href={`...` } > -> href={`...`}>
    content = content.replace(/([a-zA-Z0-9]+)\s*=\s*\{\s*`([^`}>]+)`\s*\}\s*>/g, '$1={`$2`}>');
    // Variante sin llaves de cierre: href={`...` >
    content = content.replace(/([a-zA-Z0-9]+)\s*=\s*\{\s*`([^`}>]+)`\s*>/g, '$1={`$2`}>');

    // 4. LIMPIEZA DE ESPACIOS EN TAGS (Evita Unterminated regexp)
    content = content.replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
    content = content.replace(/<\s*([a-zA-Z0-9]+)\s*\/\s*>/g, '<$1 />');

    // 5. CASO ESPECÍFICO: dashboard/layout.tsx y shell/aside
    content = content.replace(/\{isMaintenance\s*&&\s*isAdmin\s*&&\s*\(\s*>\s*/g, '{isMaintenance && isAdmin && (');

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

console.log('🛡️ Reestableciendo armonía estructural...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos estabilizados: ${filesModified}`);
