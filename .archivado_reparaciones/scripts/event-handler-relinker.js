/**
 * event-handler-relinker.js
 * Une manejadores de eventos donde la lógica quedó fuera del bloque de la función flecha.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function relink(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Patrón 1: onClick={() => {}} { LOGICA }
    // Captura el evento, el bloque vacío y el siguiente bloque de llaves si está pegado
    content = content.replace(/(onClick|onChange)\s*=\s*\{\s*\(\s*([a-zA-Z0-9_, ]*)\s*\)\s*=>\s*\{\s*\}\s*\{\s*([\s\S]*?)\s*\}\s*\}/g, '$1={( $2 ) => { $3 }}');

    // Patrón 2: onClick={() => {}} LOGICA_SIMPLE }
    // Para casos como setActiveTab("...") que no tienen llaves extras
    content = content.replace(/(onClick|onChange)\s*=\s*\{\s*\(\s*([a-zA-Z0-9_, ]*)\s*\)\s*=>\s*\{\s*\}\s*([a-zA-Z0-9_.]+\s*\([^}]*\))\s*\}/g, '$1={( $2 ) => $3}');

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
            relink(fullPath);
        }
    }
}

console.log('🔗 Relinkando manejadores de eventos...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Eventos reconectados en ${filesModified} archivos.`);
