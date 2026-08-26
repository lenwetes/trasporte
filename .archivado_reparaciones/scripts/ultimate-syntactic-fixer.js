/**
 * ultimate-syntactic-fixer.js
 * Reparación profunda de sintaxis rota: Handlers, Tipos y JSX Attributes.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. REPARAR HANDLERS (onClick/onChange)
    // Busca: onClick={() => {}} Llamada(args)
    // -> onClick={() => Llamada(args)}
    content = content.replace(/(onClick|onChange)\s*=\s*\{\s*\(\s*([a-zA-Z0-9_, ]*)\s*\)\s*=>\s*\{\s*\}\s*(\s*[a-zA-Z0-9_.]+\s*\([^;]*?\))\s*\}/g, '$1={($2) => $3}');
    
    // Variante con bloque de código huerfano posterior
    content = content.replace(/(onClick|onChange)\s*=\s*\{\s*\(\s*([a-zA-Z0-9_, ]*)\s*\)\s*=>\s*\{\s*\}\s*\{\s*([^}]+)\s*\}\s*\}/g, '$1={($2) => { $3 }}');

    // 2. REPARAR TIPOS GENÉRICOS (Array/Record)
    // Busca: Array<{... > -> Array<{...}>>
    content = content.replace(/(Array\s*<\s*\{[^{}]+)\s*>/g, (match) => {
        if (!match.includes('}')) return match.replace('>', '}>>');
        return match;
    });
    
    // Busca: Record<..., {...} = { -> Record<..., {...}> = {
    content = content.replace(/(Record\s*<\s*[a-zA-Z0-9_]+\s*,\s*\{[^{}]+\})\s*=\s*\{/g, '$1> = {');

    // 3. REPARAR ATRIBUTOS JSX SUELTOS
    // Busca: href={`...` > -> href={`...`}>
    content = content.replace(/([a-zA-Z0-9]+)\s*=\s*\{\s*`([^`}>]+)`\s*>/g, '$1={`$2`}>');
    // Busca: href={variable > -> href={variable}>
    content = content.replace(/([a-zA-Z0-9]+)\s*=\s*\{\s*([a-zA-Z0-9_.]+)\s*>/g, (match, p1, p2) => {
        if (['true', 'false', 'null', 'undefined'].includes(p2)) return `${p1}={${p2}}>`;
        if (p2.match(/^[a-zA-Z0-9_.]+$/)) return `${p1}={${p2}}>`;
        return match;
    });

    // 4. REPARAR JSX FRAGMENTS / TAGS
    // Corregir tags mal cerrados que causan "Unterminated regexp"
    content = content.replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
    content = content.replace(/<\s*([a-zA-Z0-9]+)\s*\/\s*>/g, '<$1 />');
    
    // 5. REPARAR LAYOUT/SHELL (Casos específicos detectados)
    content = content.replace(/\{isMaintenance\s*&&\s*isAdmin\s*&&\s*\(\s*>\s*/g, '{isMaintenance && isAdmin && (');

    // 6. REPARAR SUSPENSE FALLBACK
    content = content.replace(/fallback\s*=\s*\{\s*<\s*([a-zA-Z0-9_]+)\s*\/\s*>\s*\}\s*\}/g, 'fallback={<$1 />}');

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

console.log('🚀 Iniciando reparación sintáctica definitiva...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos estabilizados: ${filesModified}`);
