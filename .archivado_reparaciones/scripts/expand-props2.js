const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

const customProps = `interface CustomProps { variant?: any; size?: any; asChild?: any; value?: any; onValueChange?: any; open?: any; isOpen?: any; onOpenChange?: any; label?: any; icon?: any; description?: any; header?: any; data?: any; fileName?: any; align?: any; control?: any; render?: (props: any) => React.ReactNode; name?: any; type?: any; disabled?: any; colSpan?: any; currentPage?: any; totalPages?: any; archivo?: any; placeholder?: any; options?: any; shouldFilter?: any; mode?: any; error?: any; items?: any; htmlFor?: any; rows?: any; }`;

for(const file of files) {
    const fullPath = path.join(uiDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Replace old CustomProps with new one
    content = content.replace(/interface CustomProps \{[^\}]+\}/g, customProps);

    fs.writeFileSync(fullPath, content);
}
console.log("CustomProps function fixed!");
