/**
 * attribute-closer-fixer.js
 * Repara atributos JSX que perdieron su llave de cierre: href={`...`> -> href={`...`}>
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. href={`...`> -> href={`...`}>
    content = content.replace(/href\s*=\s*\{\s*`([^`]+)`\s*>/g, 'href={`$1`}>');
    
    // 2. value={`...`> -> value={`...`}>
    content = content.replace(/value\s*=\s*\{\s*`([^`]+)`\s*>/g, 'value={`$1`}>');

    // 3. General: Prop={`...`> -> Prop={`...`}>
    // Usamos una regex más genérica pero segura
    content = content.replace(/([a-zA-Z0-9]+)\s*=\s*\{\s*`([^`]+)`\s*>/g, '$1={`$2`}>');

    // 4. Corregir searchParams: Promise<{...} ; -> Promise<{...},
    content = content.replace(/(searchParams\s*:\s*Promise\s*<\s*\{[^}]+\})\s*;\s*/g, '$1, ');

    // 5. Corregir searchParams: Promise<{...} , }) -> Promise<{...} })
    content = content.replace(/(\{\s*searchParams\s*:\s*Promise\s*<\s*\{[^}]+\})\s*,\s*\}\)/g, '$1 })');

    // 6. Corregir onClick={() => {}} Action -> onClick={() => Action()}
    // (Asegurando que no rompamos los que ya están bien)
    content = content.replace(/onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*([a-zA-Z0-9_]+)\s*(\(?)/g, (match, p1, p2) => {
        if (p2 === '(') return `onClick={() => ${p1}(`;
        return `onClick={() => ${p1}()`;
    });

    // 7. Reparar desastres de isExporting ? ( <Loader2 /> )
    content = content.replace(/\{\s*isExporting\s*\?\s*\(\s*<\s*Loader2\s*\/\s*>\s*\)\s*:\s*\(/g, '{isExporting ? <Loader2 /> : (');
    content = content.replace(/\{\s*isSubmitting\s*\?\s*\(\s*<\s*Loader2\s*\/\s*>\s*\)\s*:\s*\(/g, '{isSubmitting ? <Loader2 /> : (');

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

console.log('🔧 Reparando llaves de atributos perdidas...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos reparados: ${filesModified}`);
