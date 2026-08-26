/**
 * surgical-master-repair.js
 * Repara los daños colaterales de scripts de limpieza previos.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Reparar atributos con llaves perdidas: href={`...` > -> href={`...`}>
    content = content.replace(/([a-zA-Z0-9]+)\s*=\s*\{\s*`([^`}>]+)`\s*>/g, '$1={`$2`}>');
    content = content.replace(/([a-zA-Z0-9]+)\s*=\s*\{\s*([^`}>]+)\s*>/g, (match, p1, p2) => {
        if (p2.includes('{') && !p2.includes('}')) return `${p1}={${p2}}>`;
        return match;
    });

    // 2. Reparar onClick y onChange partidos: onClick={() => {}} Action() -> onClick={() => Action()}
    content = content.replace(/(onClick|onChange)\s*=\s*\{\s*\(\s*([a-zA-Z0-9_, ]*)\s*\)\s*=>\s*\{\s*\}\s*(\s*[^{}<>]+)\s*\}/g, '$1={($2) => $3}');
    
    // Caso con bloque de llaves huerfano: onClick={() => {}} { setIsOpen(true) }
    content = content.replace(/(onClick|onChange)\s*=\s*\{\s*\(\s*([a-zA-Z0-9_, ]*)\s*\)\s*=>\s*\{\s*\}\s*\{\s*([^}]+)\s*\}\s*\}/g, '$1={($2) => { $3 }}');

    // 3. Reparar Records incompletos: Record<string, {...} = { -> Record<string, {...}> = {
    content = content.replace(/(Record\s*<\s*[a-zA-Z0-9_]+\s*,\s*\{[^{}]+\})\s*=\s*\{/g, '$1> = {');

    // 4. Reparar Suspense/fallback roto: fallback={<Skeleton / } > -> fallback={<Skeleton />}
    content = content.replace(/fallback\s*=\s*\{\s*<\s*([a-zA-Z0-9_]+)\s*\/\s*\}\s*>/g, 'fallback={<$1 />}');
    content = content.replace(/<\s*([a-zA-Z0-9_]+)\s*\/\s*\}\s*>/g, '<$1 />');

    // 5. Reparar Prisma types: GetPayload <{...} > ; -> GetPayload <{...}> ;
    content = content.replace(/(GetPayload\s*<\s*\{[^}]+\})\s*[;>]\s*([;>])/g, '$1$2');

    // 6. Eliminar espacios en tags: < / Link > -> </Link>
    content = content.replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
    content = content.replace(/<\s*([a-zA-Z0-9]+)\s*\/\s*>/g, '<$1 />');

    // 7. Reparar searchParams: Promise<{...} }) -> Promise<{...}> })
    content = content.replace(/(searchParams\s*:\s*Promise\s*<\s*\{[^}]+\})\s*\}\)/g, '$1 > })');
    content = content.replace(/(searchParams\s*:\s*Promise\s*<\s*\{[^}]+\})\s*,\s*\}\)/g, '$1 > })');
    content = content.replace(/(searchParams\s*:\s*Promise\s*<\s*\{[^}]+\})\s*;\s*/g, '$1, ');

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

console.log('👷 Iniciando reparación quirúrgica maestra...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✨ Sistema saneado. Archivos corregidos: ${filesModified}`);
