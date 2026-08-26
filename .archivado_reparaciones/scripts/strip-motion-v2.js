/**
 * strip-motion-v2.js
 * Elimina todos los elementos de framer-motion (<motion.div>, <motion.h1>, etc.)
 * Soporta números en las etiquetas (h1, h2, etc.)
 */
const fs = require('fs');
const path = require('path');

const ANIMATION_PROPS = ['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileFocus', 'whileInView', 'layout', 'layoutId', 'viewport', 'onAnimationComplete'];

let filesModified = 0;

function stripMotion(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Reemplazar etiquetas <motion.xxx ...> por <xxx ...>
    // Soporta motion.h1, motion.div, etc.
    content = content.replace(/<motion\.([a-zA-Z0-9]+)/g, '<$1');
    content = content.replace(/<\/motion\.([a-zA-Z0-9]+)>/g, '</$1>');
    
    // Eliminar atributos de animación
    for (const prop of ANIMATION_PROPS) {
        // Eliminar prop="..." o prop={{...}} o prop={...}
        // Manejamos casos multilínea de forma agresiva
        const singleLineRegex = new RegExp(`\\s*${prop}=\\{(?:\\{[^}]*\\}|[^}]*)\\}`, 'g');
        content = content.replace(singleLineRegex, '');
        const stringRegex = new RegExp(`\\s*${prop}="[^"]*"`, 'g');
        content = content.replace(stringRegex, '');
        const stringRegexSingle = new RegExp(`\\s*${prop}='[^']*'`, 'g');
        content = content.replace(stringRegexSingle, '');
    }

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
            stripMotion(fullPath);
        }
    }
}

console.log('🧹 Eliminando framer-motion (v2)...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos modificados: ${filesModified}`);
