/**
 * strip-motion.js
 * Elimina todos los elementos de framer-motion (<motion.div>, <motion.section>, etc.)
 * Reemplaza <motion.TAG ...props> con <TAG ...props> (quitando props de animación)
 */
const fs = require('fs');
const path = require('path');

const ANIMATION_PROPS = ['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileFocus', 'whileInView', 'layout', 'layoutId'];

let filesModified = 0;

function stripMotion(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Reemplazar etiquetas <motion.xxx ...> por <xxx ...>
    content = content.replace(/<motion\.([a-zA-Z]+)/g, '<$1');
    content = content.replace(/<\/motion\.([a-zA-Z]+)>/g, '</$1>');
    
    // Eliminar atributos de animación (multilinea) – Props que framer usa:
    for (const prop of ANIMATION_PROPS) {
        // Eliminar prop="..." o prop={{...}} o prop={...}
        // Casos multilínea son complejos; procesamos línea a línea
        const singleLineRegex = new RegExp(`\\s*${prop}=(?:"[^"]*"|'[^']*'|\\{[^}]*\\})`, 'g');
        content = content.replace(singleLineRegex, '');
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

console.log('🧹 Eliminando framer-motion del JSX...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos modificados: ${filesModified}`);
