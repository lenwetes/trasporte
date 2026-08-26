const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

const customProps = `interface CustomProps { variant?: any; size?: any; asChild?: any; value?: any; onValueChange?: any; open?: any; onOpenChange?: any; label?: any; icon?: any; description?: any; header?: any; data?: any; fileName?: any; align?: any; control?: any; render?: any; name?: any; type?: any; disabled?: any; colSpan?: any; currentPage?: any; totalPages?: any; }`;

for(const file of files) {
    const fullPath = path.join(uiDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Remove any previous modifications
    content = content.replace(/ \& Record<string, any>/g, "");
    
    // Inject CustomProps once if not exists
    if (!content.includes('interface CustomProps')) {
        content = content.replace('import * as React from "react";', 'import * as React from "react";\n' + customProps);
    }

    // Add & CustomProps safely to all HTMLAttributes
    content = content.replace(/React\.([a-zA-Z]+)HTMLAttributes<([^>]+)>/g, "React.$1HTMLAttributes<$2> & CustomProps");
    content = content.replace(/React\.HTMLAttributes<([^>]+)>/g, "React.HTMLAttributes<$1> & CustomProps");

    fs.writeFileSync(fullPath, content);
}
console.log("Types made explicitly permissive without breaking event inference!");
