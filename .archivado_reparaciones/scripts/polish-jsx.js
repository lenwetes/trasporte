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

    // Fix style={ key: 'val' } or style={ {key: 'val'} } or style={ {key: 'val'}}
    // Goal: Normalize to style={{ key: 'val' }}
    
    // 1. If it has single brace and looks like an object
    content = content.replace(/style=\{[ \t]*([a-zA-Z]+:)/g, 'style={{ $1');
    
    // 2. Fix triple braces resulting from previous repairs
    content = content.replace(/\}\}\s*\}/g, '}}');
    
    // 3. Ensure closing double braces if starting with double
    content = content.replace(/style=\{\{\s*([^}]+)\}(?!\s*\})/g, 'style={{ $1 }}');

    // 4. Fix broken onClick handlers
    content = content.replace(/onClick=\{\s*\(\)\s*=>\s*\{\}\s*([^}]+)\}/g, 'onClick={() => { $1 }}');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Polished JSX: ${file}`);
    }
});
