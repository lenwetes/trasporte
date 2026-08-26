/**
 * strip-tailwind.js
 * Elimina todas las clases de Tailwind de todos los archivos TSX/TS
 * Reemplaza className="..." con className="" o elimina el atributo si queda vacío
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;
let filesSkipped = 0;

function stripTailwindFromFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Eliminar className con template literals: className={`...`}
    content = content.replace(/\bclassName=\{`[^`]*`\}/g, '');
    
    // Eliminar className con expresiones: className={cn(...)} o className={clsx(...)} etc
    content = content.replace(/\bclassName=\{(?:cn|clsx|cx|twMerge|twJoin|cva)\([^)]*\)\}/g, '');
    
    // Eliminar className con condiciones: className={condition ? "..." : "..."}
    content = content.replace(/\bclassName=\{[^}]+\}/g, '');
    
    // Eliminar className con strings simples: className="..."
    content = content.replace(/\bclassName="[^"]*"/g, '');
    
    // Eliminar className con strings simples: className='...'
    content = content.replace(/\bclassName='[^']*'/g, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        filesModified++;
        return true;
    }
    filesSkipped++;
    return false;
}

function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // Saltar node_modules, .next, .git
            if (['node_modules', '.next', '.git', 'prisma'].includes(entry.name)) continue;
            processDirectory(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
            // Saltar scripts de limpieza
            const skipFiles = ['strip-tailwind.js', 'clean-ui.js', 'fix-ts.js', 'fix-local-any.js', 'explicit-props.js', 'expand-props.js', 'expand-props2.js', 'permissive-types.js', 'permissive-types2.js', 'upgrade-types.js'];
            if (skipFiles.includes(entry.name)) continue;
            stripTailwindFromFile(fullPath);
        }
    }
}

console.log('🧹 Eliminando classes de Tailwind de todo el proyecto...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos modificados: ${filesModified}`);
console.log(`⏭️  Archivos sin cambios: ${filesSkipped}`);
console.log('🏁 Limpieza completada.');
