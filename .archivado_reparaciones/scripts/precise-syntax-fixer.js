/**
 * precise-syntax-fixer.js
 * Correcciones quirúrgicas para los errores introducidos por los scripts anteriores.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Revertir el error de } : { en constantes que deberían ser } = {
    // Solo si hay una declaración de const/let/var antes
    content = content.replace(/(\}\s*):(\s*\{\s*[A-Z][A-Z0-9_]+\s*:)/g, '$1=$2');

    // 2. Corregir onClick={() => {}} Action(...) -> onClick={() => Action(...)}
    // Agregamos el paréntesis de cierre que se perdía o faltaba
    content = content.replace(/onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\}/g, 'onClick={() => $1($2)}');
    
    // Caso de solo nombre de función
    content = content.replace(/onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*([a-zA-Z0-9_]+)\s*\}/g, 'onClick={() => $1()}');

    // 3. Reparar ternarios con > que quedaron mal
    content = content.replace(/\{\s*isExporting\s*\?\s*\(\s*<\s*Loader2\s*\/\s*>\s*\)\s*:\s*\(/g, '{isExporting ? <Loader2 /> : (');
    content = content.replace(/\{\s*isSubmitting\s*\?\s*\(\s*<\s*Loader2\s*\/\s*>\s*\)\s*:\s*\(/g, '{isSubmitting ? <Loader2 /> : (');

    // 4. Reparar interface huerfana de searchParams
    // { page?: string } , })
    content = content.replace(/\{page\s*\?\s*:\s*string\s*\}\s*,\s*\}\)\s*\{/g, '{ page?: string } }) {');
    content = content.replace(/\{page\s*\?\s*:\s*string\s*\}\s*,\s*\}\s*:\s*\{/g, '{ page?: string } }: {');

    // 5. Reparar props params / searchParams en layouts/pages
    content = content.replace(/searchParams\s*:\s*Promise\s*<\s*\{[^}]+\}\s*>\s*,\s*\}\s*\)/g, 'searchParams: Promise<{ [key: string]: string | string[] | undefined }> })');

    // 6. Reparar Fragmentos rotos (< >)
    content = content.replace(/\(\s*<\s*>\s*\)\s*:\s*\(/g, '(<></>) : (');

    // 7. Reparar desastre de Link + Button que no se cerró
    // <Link ... } > <Button
    content = content.replace(/<Link([^>]+)\s*\}\s*>\s*<Button/g, '<Link$1> <Button');

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

console.log('🎯 Ejecutando correcciones quirúrgicas...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos refinados: ${filesModified}`);
