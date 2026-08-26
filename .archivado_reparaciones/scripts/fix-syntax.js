const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFiles() {
    let filesFixed = 0;
    walkDir('./src', (filePath) => {
        if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
        
        const originalContent = fs.readFileSync(filePath, 'utf8');
        let content = originalContent;

        // Fix: onClick={() => {}} setSomething(true)}  missing closing >
        // Convert to: onClick={() => setSomething(true)}>
        content = content.replace(/onClick=\{\(\)\s*=>\s*\{\}\}\s*([a-zA-Z0-9_\-]+\([^)]*\))\}/g, 'onClick={() => $1}>');

        // Fix: onClick={() => {}} setValue(...) ... } missing closing >
        content = content.replace(/onClick=\{\(\)\s*=>\s*\{\}\}\s*([a-zA-Z0-9_\-]+\([\s\S]*?\))\}/g, 'onClick={() => $1}>');


        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed: ${filePath}`);
            filesFixed++;
        }
    });
    console.log(`Total files fixed: ${filesFixed}`);
}

processFiles();
