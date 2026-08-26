const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Fix style={{ ... } followed by children (missing } and >)
    // style={{ ... } {children} -> style={{ ... }}>{children}
    content = content.replace(/style=\{\{\s*([^}]*?)\s*\}\s*([<{])/g, 'style={{ $1 }}>$2');

    // 2. Fix style={{ ... }} followed by children (missing >)
    // style={{ ... }} {children} -> style={{ ... }}>{children}
    // Note: We need to be careful not to match valid style={{}} props that are followed by other props.
    // However, in JSX, a prop followed by {children} or <tag> MUST have a >.
    content = content.replace(/style=\{\{\s*([^}]*?)\s*\}\}\s*([<{])/g, 'style={{ $1 }}>$2');

    // 3. Fix cases where content is immediately following a half-closed style prop
    // <Text style={{ fontSize: 18 } TEXT -> <Text style={{ fontSize: 18 }}>TEXT
    content = content.replace(/<([A-Z][a-zA-Z0-9]*|View|Text|Image|Page|Document|Button)\s+([^>]*?style=\{\{\s*[^}]*?)\s*\}\s+([A-Z0-9{<])/g, '<$1 $2 }}>$3');

    // 4. More general: Look for tags that seem to end abruptly with a } and are followed by { or < or uppercase text
    // This is risky but based on the patterns we've seen.
    content = content.replace(/<([A-Z][a-zA-Z0-9]*|View|Text|Image|Page|Document|Button)\s+([^>]*?)\}\s+([<{])/g, (match, p1, p2, p3) => {
        // If the prop already has a closing brace for an object, count them.
        const openBraces = (match.match(/\{/g) || []).length;
        const closeBraces = (match.match(/\}/g) || []).length;
        if (openBraces > closeBraces) {
            // Missing a } and a >
            return `<${p1} ${p2} }}>${p3}`;
        } else if (openBraces === closeBraces) {
            // Missing just a >
            return `<${p1} ${p2}>${p3}`;
        }
        return match;
    });

    // 5. Specific fix for generated PDF lines like: <Text style={{ fontSize: 18 } COMPROBANTE
    content = content.replace(/<Text\s+style=\{\{\s*([^}]*?)\s*\}\s+([A-ZÁÉÍÓÚÑ])/g, '<Text style={{ $1 }}>$2');

    // 6. Fix any residual >>>> from previous attempts
    content = content.replace(/>{2,}/g, '>');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        return true;
    }
    return false;
}

function processDir(dir) {
    let count = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
            count += processDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
            if (fixFile(fullPath)) {
                count++;
            }
        }
    }
    return count;
}

const targetDir = path.join(__dirname, 'src');
console.log(`🚀 Starting PDF and Style fixer on ${targetDir}...`);
const total = processDir(targetDir);
console.log(`✅ Fixed ${total} files!`);
