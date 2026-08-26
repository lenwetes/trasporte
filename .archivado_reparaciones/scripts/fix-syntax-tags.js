const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

const fixMissingClosingBracket = (content) => {
    // Examples:
    // onClick={markAllOk}
    // Validar Todo
    // </Button>
    
    // We can observe this is happening often for <Button... and <button...
    // Let's identify the missing `>` by looking at tags like <Button, <button, <Textarea, <Input, <Select, <Dialog, <div, etc.
    
    // Actually, looking at the pattern, the `>` was deleted when it was at the end of a line, or right before the children.
    // Or someone did a bad replace: maybe `>\n` was replaced?
    // Let's look for tags that start with `<[A-Za-z]+ \n` and the end bracket `>` is missing before the children or the closing tag `</`.
    
    // A more brute-force approach: we know `tsc` output gave us the exact line numbers. Let's try to just fix the specific patterns.
    // Pattern 1: button missing `>`.
    // onClick={...}
    // TEXT
    // </Button>
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Fix Button with text directly below it and no `>`
        if (line.match(/^\s*(Validar Todo|MODIFICAR INICIO|FINALIZAR REPORTE|Ver Firma|Pendientes|Siguiente|Anterior|Guardar|Cancelar)\s*$/)) {
            if (i > 0 && !lines[i-1].includes('>') && !lines[i-1].trim().endsWith('>')) {
                lines[i-1] = lines[i-1] + '>';
            }
        }
        
        // Fix <span>[CHECK]</span> or similar when preceded by a prop
        if (line.match(/^\s*<span/)) {
            if (i > 0 && lines[i-1].trim().match(/(?:\{[^}]*\}|"[^"]*")$/) && !lines[i-1].includes('/>')) {
                if (!lines[i-1].trim().endsWith('>')) {
                    lines[i-1] = lines[i-1] + '>';
                }
            }
        }
    }
    return lines.join('\n');
};

let filesFixed = 0;
walkDir('./src', (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;

    // Fix <Textarea \n {...register(...)}> \n placeholder=...
    content = content.replace(/(<Textarea[^>]*?)>\s*placeholder=(["'].*?["'])/gs, '$1 placeholder=$2>');
    
    // Fix `<Command  loop>` to `<Command loop>` and related syntax errors
    content = content.replace(/<Command\s+loop>/g, '<Command loop>');
    
    // Replace <Button \n onClick={...} \n ChildText \n </Button>
    content = content.replace(/(\n\s*onClick=\{[^}]*\})\s*\n(\s*[A-Z][a-zA-Z \t]+)\n(\s*<\/Button>)/g, '$1>\n$2\n$3');
    content = content.replace(/(\n\s*onClick=\{[^}]*\})\s*\n(\s*[A-Z][a-zA-Z \t]+)\n(\s*<\/button>)/g, '$1>\n$2\n$3');

    // Fix <button onClick={...} \n <span>
    content = content.replace(/(\n\s*onClick=\{[^}]*\})\s*\n(\s*<[a-z]+>)/g, '$1>\n$2');

    // Fix nested parenthesis where `> ` was lost:
    // It's going to be hard. Let's start with just some regexes.

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        filesFixed++;
    }
});
console.log(`Total files modified: ${filesFixed}`);
