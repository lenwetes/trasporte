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

    // Fix style={ key: value } to style={{ key: value }}
    // This is likely what broke
    content = content.replace(/style=\{[ \t]*([a-zA-Z0-9]+:)/g, 'style={{ $1');
    content = content.replace(/(\b\w+:\s*['"][^'"]*['"]\s*)\}/g, '$1 }}');
    
    // Fix onClick={() => {}} ... } to onClick={() => { ... }}
    // The previous script might have mis-replaced these
    content = content.replace(/onClick=\{\(\)\s*=>\s*\{\}\s*([^}]+)\}/g, 'onClick={() => { $1 }}');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Deep Repaired: ${file}`);
    }
});
