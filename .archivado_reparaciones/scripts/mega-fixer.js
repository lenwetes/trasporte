const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Fix event handlers with logical blocks immediately following empty function
    // onClick={() => {}} { logic } -> onClick={() => { logic }}
    content = content.replace(/(onClick|onChange|onValueChange|onOpenChange|onSelect|onSubmit)\s*=\s*\{\s*\(\s*([^)]*)\)\s*=>\s*\{\s*\}\s*\{\s*([\s\S]*?)\s*\}\s*\}/g, '$1={($2) => { $3 }}');

    // 2. Fix event handlers with single statement following empty function
    // onClick={() => {}} logic() } -> onClick={() => logic()}
    content = content.replace(/(onClick|onChange|onValueChange|onOpenChange|onSelect|onSubmit)\s*=\s*\{\s*\(\s*([^)]*)\)\s*=>\s*\{\s*\}\s*([a-zA-Z0-9_.]+\s*\([^}]*\))\s*\}/g, '$1={($2) => $3}');

    // 3. Fix cases with multiple statements but no braces (common in some cleaned files)
    // onClick={() => {}} logic1(); logic2(); } -> onClick={() => { logic1(); logic2(); }}
    content = content.replace(/(onClick|onChange|onValueChange|onOpenChange|onSelect|onSubmit)\s*=\s*\{\s*\(\s*([^)]*)\)\s*=>\s*\{\s*\}\s*([^}]*?;\s*[^}]*?)\s*\}/g, (match, p1, p2, p3) => {
        // If it looks like it already has a logic block from pattern 1, don't double fix
        if (p3.trim().startsWith('{')) return match;
        return `${p1}={(${p2}) => { ${p3} }}`;
    });

    // 4. Fix Readonly type semicolon error (like in layout.tsx)
    content = content.replace(/Readonly\s*<\s*\{\s*children\s*:\s*React\.ReactNode\s*\}\s*>\s*;\s*\}\s*>\s*\)\s*\{/g, 'Readonly<{children: React.ReactNode}>) {');

    // 5. Fix empty tags <div > -> <div>
    content = content.replace(/<([a-z0-9]+)\s+>/gi, '<$1>');

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
console.log(`🚀 Starting mega-fixer on ${targetDir}...`);
const total = processDir(targetDir);
console.log(`✅ Fixed ${total} files!`);
