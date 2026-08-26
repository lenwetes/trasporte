/**
 * deep-repair.js
 * Reparación quirúrgica de JSX roto.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Reparar <div }> -> <div> o <div
    // Esto ocurre cuando se borra una prop multilínea y queda el } de cierre del bloque de código pero antes del >
    // Ejemplo: actions={ 
    //            <div } >
    // Aquí el } cierra el bloqué de código de la prop, pero está mal posicionado.
    
    // Si vemos <Tag (espacios) } > es casi seguro un error de strip.
    content = content.replace(/<([a-zA-Z0-9.]+)\s+\}\s*>/g, '<$1>');
    
    // 2. Reparar props truncadas: Prop={ (e) = } > -> Prop={(e) => {}} >
    content = content.replace(/=\s*\{\s*\(([^\)]*)\)\s*=\s*\}\s*>/g, '={($1) => {}}>');
    content = content.replace(/=\s*\{\s*\(\)\s*=>\s*\}\s*>/g, '={() => {}}>');

    // 3. Reparar Link href rotos
    // href={`...` > -> href={`...`}>
    content = content.replace(/href\s*=\s*\{(`[^`]*`)\s*>/g, 'href={$1}>');
    content = content.replace(/href\s*=\s*\{([^}]+)>/g, 'href={$1}>');

    // 4. Reparar cierres de etiquetas motion residuales con llaves locas
    // </motion.div }}} > -> </div>
    content = content.replace(/<\/\s*motion\s*\.\s*([a-zA-Z0-9]+)[^>]*>/g, '</$1>');

    // 5. Reparar tags que terminan con } >
    // <div } > -> <div>
    content = content.replace(/<([a-zA-Z0-9.]+)\s+\}\s*>/g, '<$1>');
    // <div}}> -> <div>
    content = content.replace(/<([a-zA-Z0-9.]+)\}\}+>/g, '<$1>');

    // 6. Reparar fallbacks de Suspense (v3)
    // fallback={<Skeleton />>> -> fallback={<Skeleton />}
    content = content.replace(/fallback\s*=\s*\{(<[^>]+>)\s*>\s*>/g, 'fallback={$1}');
    
    // 7. Reparar el error de "Unterminated regexp literal" suele ser un / mal cerrado en un tag
    // <Link / > o similares
    
    // 8. Reparar onClick rotos específicos
    // onClick={() = } > -> onClick={() => {}} >
    content = content.replace(/onClick\s*=\s*\{\s*\(\)\s*=\s*\}\s*>/g, 'onClick={() => {}}>');
    content = content.replace(/onClick\s*=\s*\{\s*\(\s*([^)]*)\s*\)\s*=\s*\}\s*>/g, 'onClick={($1) => {}}>');

    // 9. Reparar generic Promise rotos (v3)
    content = content.replace(/Promise\s*<\s*\{\s*id\s*:\s*string\s*>\s*(\)|;)/g, 'Promise<{ id: string }>$1');

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

console.log('🩹 Reparando código con cirugía láser...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos reparados: ${filesModified}`);
