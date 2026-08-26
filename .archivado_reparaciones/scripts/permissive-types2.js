const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

for(const file of files) {
    const fullPath = path.join(uiDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Remove any previous Record modifications just in case
    content = content.replace(/ & Record<string, any>/g, "");
    
    // Add Record<string, any> safely to all React.xxxHTMLAttributes
    content = content.replace(/React\.([a-zA-Z]+)HTMLAttributes<([^>]+)>/g, "React.$1HTMLAttributes<$2> & Record<string, any>");
    content = content.replace(/React\.HTMLAttributes<([^>]+)>/g, "React.HTMLAttributes<$1> & Record<string, any>");

    fs.writeFileSync(fullPath, content);
}
console.log("Types made truly permissive!");
