const fs = require('fs');
const path = require('path');

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
        
        let originalContent = fs.readFileSync(filePath, 'utf8');
        let content = originalContent;

        // Fix missing closing brackets for Button components that lost them during migration.
        // e.g. <Button variant="outline"\n size="sm"\n Pendientes </Button>
        // We look for </Button> and trace back to find if the opening <Button lacks a closing >
        // It's easier to just find instances of `() => {}} ` and replace with `() => `
        content = content.replace(/\(\)\s*=>\s*\{\}\}\s*/g, '() => ');
        content = content.replace(/([a-zA-Z0-9_]+)\s*=>\s*\{\}\}\s*/g, '$1 => ');
        content = content.replace(/\(([^)]*)\)\s*=>\s*\{\}\}\s*/g, '($1) => ');

        // Fix the <Button missing > issue if there is any text directly on newlines before </Button>
        // No, let's just make sure <Button ...> is closed. 
        // We'll replace {}} with nothing to fix `onClick={() => {}} router.push()`
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed: ${filePath}`);
            filesFixed++;
        }
    });
    console.log(`Total files fixed: ${filesFixed}`);
}

processFiles();
