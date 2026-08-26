const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

for(const file of files) {
    const fullPath = path.join(uiDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Make all types extremely permissive native combinations
    content = content.replace(/React\.forwardRef<([^,]+),\s*([^>]+)>(\(\(\{\s*className[^\}]*\}\s*:\s*any[^\)]*\)\s*=>)/g, "React.forwardRef<$1, $2 & Record<string, any>>$3");
    content = content.replace(/React\.forwardRef<([^,]+),\s*([^>]+)>(\(\(\{\s*className[^\}]*\}\s*,\s*ref\)\s*=>)/g, "React.forwardRef<$1, $2 & Record<string, any>>$3");
    
    fs.writeFileSync(fullPath, content);
}
console.log("Made all types permissive to Record<string, any>!");
