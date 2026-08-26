/**
 * fix-broken-jsx.js
 * Repara JSX roto causado por strip de className multilinea
 * Patrones rotos como: <div}} o <div}}} o <div}}}} 
 * Se reemplazan por <div
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function fixBrokenJSX(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Patron: etiqueta JSX seguida de '}' extra
    // <div}} -> <div
    // <div}}} -> <div
    // <span}}}} -> <span
    content = content.replace(/<([a-zA-Z][a-zA-Z0-9]*)\}+/g, '<$1');
    
    // También: atributos que quedaron con }> residuales
    // key={"calendar"}}} -> key={"calendar"}
    // Esto es más difícil, procesamos línea a línea
    const lines = content.split('\n');
    const fixedLines = lines.map(line => {
        // Si la línea tiene un string como key={"algo"}}} quitar los extra }
        // Detectar patrón: ="valor/expresión"}} al final de línea o seguido de espacio
        // Simplemente quitamos }}+ que no estén dentro de {} válidos
        
        // Caso específico: atributo={valor}}} donde hay extra braces al final
        // Reemplazar: ={algo}}+ por ={algo}
        line = line.replace(/=(\{[^{}]+\})\}+\s*$/g, '=$1');
        line = line.replace(/=(\{[^{}]+\})\}+\s+/g, '=$1 ');
        
        return line;
    });
    
    content = fixedLines.join('\n');

    // Fix AnimatePresence -> Fragment
    content = content.replace(/<AnimatePresence>/g, '<>');
    content = content.replace(/<\/AnimatePresence>/g, '</>');

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
            fixBrokenJSX(fullPath);
        }
    }
}

console.log('🔧 Reparando JSX roto...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos reparados: ${filesModified}`);
