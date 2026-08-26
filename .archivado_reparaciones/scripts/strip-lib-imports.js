/**
 * strip-lib-imports.js
 * Elimina imports de librerías UI que ya no existen:
 * - @fluentui/react-components
 * - class-variance-authority
 * - cmdk
 * - framer-motion
 * - tailwind-merge
 * - clsx
 * - @radix-ui/* (Shadcn)
 * - vaul
 * - sonner (notificaciones - mantener pero limpiar si no usa)
 */
const fs = require('fs');
const path = require('path');

const FORBIDDEN_IMPORTS = [
    '@fluentui/react-components',
    'class-variance-authority',
    'cmdk',
    'framer-motion',
    'tailwind-merge',
    '@radix-ui/',
    'vaul',
    'react-day-picker',   // solo si no se usa
];

let filesModified = 0;

function cleanImports(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    for (const lib of FORBIDDEN_IMPORTS) {
        // Eliminar líneas de import que incluyan estas librerías
        const importRegex = new RegExp(`^import\\s+.*from\\s+['"]${lib.replace('/', '\\/')}[^'"]*['"];?\\s*$`, 'gm');
        content = content.replace(importRegex, '// [REMOVED IMPORT]');
        
        // Eliminar también import type
        const importTypeRegex = new RegExp(`^import\\s+type\\s+.*from\\s+['"]${lib.replace('/', '\\/')}[^'"]*['"];?\\s*$`, 'gm');
        content = content.replace(importTypeRegex, '// [REMOVED IMPORT TYPE]');
    }

    // Eliminar usos de cn() y clsx() y twMerge() dejando el primer argumento
    content = content.replace(/\bcn\(([^)]+)\)/g, '""');
    content = content.replace(/\bclsx\(([^)]+)\)/g, '""');
    content = content.replace(/\btwMerge\(([^)]+)\)/g, '""');

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
            if (['node_modules', '.next', '.git', 'prisma'].includes(entry.name)) continue;
            processDirectory(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
            const skipFiles = ['strip-tailwind.js', 'strip-lib-imports.js'];
            if (skipFiles.includes(entry.name)) continue;
            cleanImports(fullPath);
        }
    }
}

console.log('🧹 Limpiando imports de librerías eliminadas...');
processDirectory(path.join(__dirname, 'src'));
console.log(`✅ Archivos modificados: ${filesModified}`);
console.log('🏁 Limpieza de imports completada.');
