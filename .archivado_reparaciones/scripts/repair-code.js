/**
 * repair-code.js
 * Repara el daño causado por expresiones regulares demasiado agresivas.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Reparar Promises y Generics rotos
    // Patrón: Promise<{ id: string >  -> Promise<{ id: string }>
    // Buscamos patrones donde hay un < seguido de algo que debería cerrar con }> pero cierra con >
    content = content.replace(/Promise\s*<\s*\{\s*([^}]+)\s*>/g, 'Promise<{$1}>');
    
    // 2. Reparar el error específico de Next.js dynamic routes params
    // props: { params: Promise<{ id: string }> }
    content = content.replace(/params\s*:\s*Promise\s*<\s*\{\s*id\s*:\s*string\s*>\s*\}/g, 'params: Promise<{ id: string }>');

    // 3. Reparar arrays de objetos rotos maintenanceAlerts: Array<{ ... >
    content = content.replace(/Array\s*<\s*\{\s*([^}]+)\s*>/g, 'Array<{$1}>');

    // 4. Reparar cierres de objetos en types
    // { planNombre: string; razon: string >  -> { planNombre: string; razon: string }
    // Esto es arriesgado. Limitemos a casos comunes.

    // 5. Reparar fragmentos rotos de etiquetas que perdieron el cierre
    // <div%`  ->  <div
    content = content.replace(/<([a-zA-Z0-9]+)%`/g, '<$1');

    // 6. Reparar llaves perdidas en Links o Buttons
    // href={item.path>  ->  href={item.path}>
    content = content.replace(/href=\{([^}]+)>/g, 'href={$1}>');

    // 7. Reparar el desastre de Suspense fallback
    // fallback={<Skeleton />>>  -> fallback={<Skeleton />}
    content = content.replace(/fallback=\{<([^/]+)\s*\/\s*>>/g, 'fallback={<$1 />}');

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

console.log('🩹 Reparando código dañado...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos reparados: ${filesModified}`);
