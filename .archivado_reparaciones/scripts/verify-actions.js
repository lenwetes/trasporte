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

const folders = ['src/actions', 'src/services'];

folders.forEach(folder => {
    walk(folder, (file) => {
        if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;
        let content = fs.readFileSync(file, 'utf8');
        let lines = content.split('\n');
        let changed = false;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('ActionResult')) {
                // Check if this line or the next one has a brace or arrow
                let context = lines.slice(i, i + 3).join(' ');
                
                // If it's a regular function declaration
                if (context.includes('async function') && context.includes('=>') && !context.includes('=> {')) {
                    // This is likely wrong
                    lines[i] = lines[i].replace('=>', '{');
                    changed = true;
                }
                
                // If it has => but is an async function
                if (context.match(/async\s+function.*=>/)) {
                     lines[i] = lines[i].replace('=>', '{');
                     changed = true;
                }

                // If it's missing { or => { entirely
                if (lines[i].includes('): Promise<ActionResult') && !lines[i].includes('{') && !lines[i].includes('=>')) {
                    // Check next line
                    if (i + 1 < lines.length && !lines[i+1].includes('{') && !lines[i+1].includes('=>')) {
                       // Add it
                       if (lines[i].includes('async function')) {
                           lines[i] += ' {';
                       } else {
                           lines[i] += ' => {';
                       }
                       changed = true;
                    }
                }
            }
        }

        if (changed) {
            fs.writeFileSync(file, lines.join('\n'));
            console.log(`Verified & Fixed: ${file}`);
        }
    });
});
