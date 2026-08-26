/**
 * anti-regex-fixer.js
 * Elimina los espacios que causan que los tags JSX se confundan con expresiones regulares
 * y soluciona el problema de searchParams/Promise.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Eliminar espacios en tags de cierre: < / Link > -> </Link>
    content = content.replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
    
    // 2. Eliminar espacios en tags auto-cerrados: < Plus / > -> <Plus />
    content = content.replace(/<\s*([a-zA-Z0-9]+)\s*\/\s*>/g, '<$1 />');

    // 3. Corregir searchParams: Promise <{ page?: string }> , }) {
    // -> searchParams: Promise<{ page?: string }> }) {
    content = content.replace(/searchParams\s*:\s*Promise\s*<\s*\{[^}]+\}\s*>\s*,\s*\}\s*\)\s*\{/g, 'searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {');
    
    // 4. Corregir searchParams: Promise <{...}> ; someProp
    content = content.replace(/(searchParams\s*:\s*Promise\s*<\s*\{[^}]+\})\s*;\s*([a-zA-Z0-9?]+\s*[:=])/g, '$1, $2');

    // 5. Corregir fragmentos rotos huerfanos: ( <> )
    content = content.replace(/\(\s*<\s*>\s*\)\s*[:=]/g, '(<></>)');

    // 6. Corregir onClick={() => {}} Action -> onClick={() => Action()}
    content = content.replace(/onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*([a-zA-Z0-9_]+)\s*(\(?)/g, (match, p1, p2) => {
        if (p2 === '(') return `onClick={() => ${p1}(`;
        return `onClick={() => ${p1}()`;
    });

    // 7. Reparar desastres de isExporting ? ( <Loader2 /> )
    content = content.replace(/\{\s*isExporting\s*\?\s*\(\s*<\s*Loader2\s*\/\s*>\s*\)\s*:\s*\(/g, '{isExporting ? <Loader2 /> : (');
    content = content.replace(/\{\s*isSubmitting\s*\?\s*\(\s*<\s*Loader2\s*\/\s*>\s*\)\s*:\s*\(/g, '{isSubmitting ? <Loader2 /> : (');

    // 8. Reparar Prisma types rotos
    content = content.replace(/(GetPayload\s*<\s*\{[^}]+\})\s*[;>]\s*>/g, '$1>');

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

console.log('🚀 Ejecutando anti-regex-fixer...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos estabilizados: ${filesModified}`);
