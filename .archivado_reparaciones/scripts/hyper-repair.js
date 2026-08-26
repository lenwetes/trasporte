/**
 * hyper-repair.js
 * Reparación final agresiva de JSX y Generics.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Reparar Link/Tag que no se cerró antes del hijo
    // Patrón: <Tag props... <Child
    // Ignoramos si ya tiene un > antes del <
    content = content.replace(/<([a-zA-Z0-9.]+)([^>]+)\n\s*<([a-zA-Z0-9.]+)/g, '<$1$2>\n <$3');
    
    // Caso específico de una sola línea o espacios
    content = content.replace(/<([a-zA-Z0-9.]+)([^>={]+)\s+<([A-Z][a-zA-Z0-9]*)/g, (match, p1, p2, p3) => {
        if (!p2.includes('>')) return `<${p1}${p2}> <${p3}`;
        return match;
    });

    // 2. Reparar Promises/Generals faltantes de cierres
    // Promise < { ... } } -> Promise < { ... } >
    content = content.replace(/Promise\s*<\s*\{\s*([^}>]+)\s*\}\s*\}/g, 'Promise<{$1}>');
    // Promise < { ... > -> Promise < { ... } >
    content = content.replace(/Promise\s*<\s*\{\s*([^}>]+)\s*>/g, 'Promise<{$1}>');
    
    // Props de Next.js dynamic routes
    content = content.replace(/params\s*:\s*Promise\s*<\s*\{\s*id\s*:\s*string\s*\}\s*;/g, 'params: Promise<{ id: string }>;');

    // 3. Reparar ActionResult y otros genéricos
    content = content.replace(/ActionResult\s*<\s*\{\s*([^}>]+)\s*>/g, 'ActionResult<{$1}>');
    content = content.replace(/ActionResult\s*<\s*\{\s*([^}>]+)\s*(\)|;)/g, 'ActionResult<{$1}>$2');

    // 4. Reparar cierres de objetos en types (v5)
    // { id : string } } -> { id : string } } -- No, esto puede ser legítimo en props { params: Promise<{...}> }
    // Arreglamos el caso de props: { params: Promise<{ path: string[] } }
    content = content.replace(/params\s*:\s*Promise\s*<\s*\{\s*([^}>]+)\s*\}\s*\}/g, 'params: Promise<{$1}> }');

    // 5. Reparar Table/Tag que quedaron con {1} <thead o similares
    content = content.replace(/([a-zA-Z0-9]+)=\{([^}]+)\}\s*<([a-zA-Z0-9]+)/g, '$1={$2}> <$3');

    // 6. Eliminar restos de strip-motion que dejaron tags rotos
    // </motion.div > -> </div>
    content = content.replace(/<\/\s*motion\s*\.[a-zA-Z0-9.]+\s*>/g, '</div>');

    // 7. Reparar desastres de multilínea
    // actions={
    //    <div } >
    content = content.replace(/actions\s*=\s*\{\s*<div\s*\}\s*>/g, 'actions={<div />} >');
    
    // 8. Reparar residuos de llaves en tags
    // <div } > -> <div>
    content = content.replace(/<([a-zA-Z0-9]+)\s*\}\s*>/g, '<$1>');

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

console.log('🚀 Lanzando reparación hiper-agresiva...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos reparados: ${filesModified}`);
