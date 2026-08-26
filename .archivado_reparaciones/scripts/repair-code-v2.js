/**
 * repair-code-v2.js
 * Repara el daño causado por expresiones regulares demasiado agresivas.
 * Enfoque: Reparar cierres de tipos genéricos y props JSX.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Reparar Promises y Generics rotos
    // Patrón: Promise<{ ... >  donde falta la llave de cierre del objeto interno
    // Este regex busca un genérico que abre con <{ y cierra con > pero no tiene el } antes del >
    // Usamos una búsqueda más flexible para el contenido
    
    // Caso: Promise<{ id: string >
    content = content.replace(/Promise\s*<\s*\{\s*([^{}]+)\s*>/g, 'Promise<{$1}>');
    
    // Caso: Array<{ ... >
    content = content.replace(/Array\s*<\s*\{\s*([^{}]+)\s*>/g, 'Array<{$1}>');
    
    // Caso: Payload<{ ... > de Prisma
    content = content.replace(/GetPayload\s*<\s*\{\s*([^{}]+)\s*>/g, 'GetPayload<{$1}>');

    // Generics anidados (recursivo simple para 2 niveles)
    content = content.replace(/Promise\s*<\s*\{\s*([^>]+)\s*>\s*(\)|;|\s)/g, (match, p1, p2) => {
        if (!p1.includes('}')) return `Promise<{${p1}}>${p2}`;
        return match;
    });

    // 2. Reparar props JSX que perdieron el cierre de llave
    // alerts={alerts>  -> alerts={alerts}>
    content = content.replace(/([a-zA-Z0-9]+)=\{([^}>]+)>/g, '$1={$2}>');
    
    // Caso: key={...}>
    content = content.replace(/key=\{([^}>]+)>/g, 'key={$2}>');

    // 3. Reparar Suspense fallback rotos
    // fallback={<Skeleton />}>>  -> fallback={<Skeleton />}
    content = content.replace(/fallback\s*=\s*\{\s*<([^/]+)\s*\/\s*>\s*>\s*>/g, 'fallback={<$1 />}');
    content = content.replace(/fallback\s*=\s*\{\s*<([^/]+)\s*\/\s*>\s*>\s*\}/g, 'fallback={<$1 />}');
    // Caso: fallback={<Skeleton />>>
    content = content.replace(/fallback=\{<([^/]+)\s*\/\s*>>/g, 'fallback={<$1 />}');

    // 4. Reparar cierres de etiquetas motion residuales
    content = content.replace(/<\/\s*motion\s*\.\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');

    // 5. Reparar objetos en interfaces
    // params: Promise<{ id: string > ; -> params: Promise<{ id: string }>;
    content = content.replace(/Promise\s*<\s*\{\s*([^}]+)\s*>\s*;/g, 'Promise<{$1}>;');

    // 6. Reparar residuos de JSX text blocks
    // <div%` -> <div
    content = content.replace(/<([a-zA-Z0-9]+)%`/g, '<$1');
    content = content.replace(/<([a-zA-Z0-9]+)%\s*`/g, '<$1');

    // 7. Reparar desastres específicos vistos en el log
    // alerts={alerts>
    content = content.replace(/alerts=\{alerts>/g, 'alerts={alerts}>');
    // user={session.user} alerts={alerts>
    content = content.replace(/user=\{([^}]+)\}\s*alerts=\{([^}]+)>/g, 'user={$1} alerts={$2}>');

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

console.log('🩹 Reparando código dañado (v2)...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos reparados: ${filesModified}`);
