const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

walk('src', (file) => {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Pattern 1: Missing brace after Promise<ActionResult<...>>
    // This catches "Promise<ActionResult<unknown>>" followed by newline and "try" or "const" without a brace
    // Actually let's just force all signatures to have their braces/arrows
    
    // Fix 1: If it's a function declaration: async function name(...): Promise<ActionResult<T>> {
    const fnDeclPattern = /(async\s+function\s+\w+\s*\([^)]*\)\s*:\s*Promise\s*<\s*ActionResult\s*<\s*[^>]*\s*>\s*>)\s*(?!\s*\{)/g;
    content = content.replace(fnDeclPattern, '$1 {');

    // Fix 2: If it's an arrow function: const name = (...): Promise<ActionResult<T>> => {
    const arrowFnPattern = /(\([^)]*\)\s*:\s*Promise\s*<\s*ActionResult\s*<\s*[^>]*\s*>\s*>)\s*(?!\s*=>)/g;
    // This one is trickier because we need to check if it's actually an arrow function
    // But in this codebase, almost everything using ActionResult is a Server Action or Service method
    content = content.replace(arrowFnPattern, '$1 =>');

    // Fix 3: Ensure double closure for those that have => but no {
    const orphanArrowPattern = /(\):\s*Promise\s*<\s*ActionResult\s*<\s*[^>]*\s*>\s*>\s*=>\s*)(?!\s*\{)/g;
    content = content.replace(orphanArrowPattern, '$1 {');

    // Fix 4: Deduplicate closures (e.g. { {)
    content = content.replace(/\{\s*\{/g, '{');
    content = content.replace(/=>\s*=>/g, '=>');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Syntax Repaired: ${file}`);
    }
});
