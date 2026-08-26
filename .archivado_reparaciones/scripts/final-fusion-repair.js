/**
 * final-fusion-repair.js
 * Reparación terminal para los 80 errores persistentes.
 */
const fs = require('fs');
const path = require('path');

let filesModified = 0;

function repair(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Reparar searchParams rotos en props de componentes
    // searchParams : Promise < { ... } > ; 
    content = content.replace(/(searchParams\s*:\s*Promise\s*<\s*\{[^}]+\})\s*;\s*([a-zA-Z0-9?]+\s*[:=])/g, '$1, $2');
    content = content.replace(/(\{\s*searchParams\s*[:=]\s*Promise\s*<\s*\{[^}]+\})\s*;\s*/g, '$1, ');

    // 2. Reparar ternarios rotos con > interior
    // { condition ? ( > <Component /> ) : ... }
    content = content.replace(/\{\s*([^?]+)\s*\?\s*\(\s*>\s*/g, '{$1 ? (');
    content = content.replace(/\?\s*\(\s*>\s*<([a-zA-Z0-9.]+)/g, '? <$1');

    // 3. Reparar acciones que se rompieron con el strip
    // actions = { <Link ... } >
    content = content.replace(/actions\s*=\s*\{\s*<Link([^>]+)\s*\}\s*>/g, 'actions={<Link$1 />} >');
    // actions = { >
    content = content.replace(/actions\s*=\s*\{\s*>\s*/g, 'actions={');

    // 4. Reparar onClick / onChange que quedaron huerfanos
    // onClick = { () => {} } SomeAction
    content = content.replace(/onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*\{\s*\}\s*([a-zA-Z0-9]+)/g, 'onClick={() => $1');
    content = content.replace(/onChange\s*=\s*\{\s*\(\s*e\s*\)\s*=>\s*\{\s*\}\s*([a-zA-Z0-9]+)/g, 'onChange={(e) => $1');

    // 5. Reparar props icon que se rompieron
    // icon = { <Mail / } > }
    content = content.replace(/icon\s*=\s*\{\s*<\s*([a-zA-Z0-9]+)\s*\/\s*\}\s*>\s*\}\s*>/g, 'icon={<$1 />} >');
    content = content.replace(/icon\s*=\s*\{\s*<\s*([a-zA-Z0-9]+)\s*\/\s*\}\s*>\s*\}/g, 'icon={<$1 />}');

    // 6. Reparar tipos de Prisma rotos
    // type X = Prisma.YGetPayload < { ... } ; >
    content = content.replace(/(GetPayload\s*<\s*\{[^}]+\})\s*;\s*>/g, '$1>');
    content = content.replace(/(GetPayload\s*<\s*\{[^}]+\})\s*>\s*;\s*>/g, '$1>');

    // 7. Reparar desastres de Link + Button
    // <Link href={...} <Button
    content = content.replace(/<Link([^>]+)\s+<Button/g, '<Link$1> <Button');

    // 8. Reparar interface de objetos rotos (v2)
    // } = { ... }
    content = content.replace(/\}\s*=\s*\{\s*[A-Z][a-zA-Z0-9]+\s*:\s*\{/g, (match) => match.replace('=', ':'));

    // 9. Reparar fragmentos vacios rotos
    // ( <> )
    content = content.replace(/\(\s*<\s*>\s*\)/g, '(<></>)');

    // 10. Reparar cierres de map rotos
    // (e) => {} }
    content = content.replace(/=>\s*\{\s*\}\s*\)\s*;\s*/g, '=> ({}));');

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

console.log('🔥 Ejecutando reparación terminal de 80 errores...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos purificados: ${filesModified}`);
