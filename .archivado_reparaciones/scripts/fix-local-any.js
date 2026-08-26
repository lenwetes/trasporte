const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Fix implicit any on (v) => ...
            if (content.includes('(v) =>')) {
                content = content.replace(/\(v\)\s*=>/g, "(v: any) =>");
                modified = true;
            }
            if (content.includes('({ field }) =>')) {
                content = content.replace(/\(\{\s*field\s*\}\)\s*=>/g, "({ field }: any) =>");
                modified = true;
            }
            if (content.includes('(open) =>')) {
                content = content.replace(/\(open\)\s*=>/g, "(open: any) =>");
                modified = true;
            }
            if (content.includes('(isOpen) =>')) {
                content = content.replace(/\(isOpen\)\s*=>/g, "(isOpen: any) =>");
                modified = true;
            }
            
            if (modified) fs.writeFileSync(fullPath, content);
        }
    }
}

processDir(path.join(__dirname, 'src', 'app'));
processDir(path.join(__dirname, 'src', 'components'));
console.log("Implicit any local callbacks strictly cast to any!");
