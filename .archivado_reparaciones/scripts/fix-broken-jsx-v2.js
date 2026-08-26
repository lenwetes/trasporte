/**
 * fix-broken-jsx-v2.js
 * Limpieza profunda de residuos JSX después de limpiezas masivas.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Eliminar AnimatePresence residual
    content = content.replace(/<AnimatePresence[^>]*>/g, '<>');
    content = content.replace(/<\/AnimatePresence>/g, '</>');

    // 2. Reparar etiquetas mal cerradas o con llaves residuales
    // <div}} -> <div
    // <div }> -> <div
    content = content.replace(/<([a-zA-Z0-9]+)\s*\}+/g, '<$1');
    
    // 3. Reparar fragmentos mal cerrados < / > -> </>
    content = content.replace(/<\s*\/\s*>/g, '</>');

    // 4. Reparar cierres de etiquetas con espacios o ruidos < / div > -> </div>
    content = content.replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');

    // 5. Eliminar llaves que quedaron volando después de borrar props multilínea
    // Ejemplo: <div
    //            
    //          >
    // Si hay una línea que solo tiene } o }} entre < y > hay que limpiarla.
    // Pero es arriesgado. Hagamos algo más específico para los errores vistos.
    
    // <div}}}} -> <div
    content = content.replace(/<([a-zA-Z0-9]+)(\s*\}+)+/g, '<$1');
    
    // Si hay un > precedido por muchos }
    content = content.replace(/\}+>/g, '>');

    // Limpiar props que quedaron vacías o con llaves locas
    // key={"calendar"}}} -> key={"calendar"}
    content = content.replace(/=\{([^}]+)\}\}+/g, '={$1}');

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
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
            cleanFile(fullPath);
        }
    }
}

console.log('🔧 Reparando JSX (deep clean)...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos reparados: ${filesModified}`);
