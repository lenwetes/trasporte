const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

for(const file of files) {
    const fullPath = path.join(uiDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    const exportsSet = new Set();
    
    // Match `export const X` or `export function X`
    let match;
    const inlineExportObj = /export\s+(?:const|function)\s+([a-zA-Z0-9_]+)/g;
    while((match = inlineExportObj.exec(content)) !== null) {
        exportsSet.add(match[1]);
    }

    // Match `export { X, Y, Z }`
    const blockExportObj = /export\s+{([^}]+)}/g;
    while((match = blockExportObj.exec(content)) !== null) {
        const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0]).filter(Boolean);
        names.forEach(n => exportsSet.add(n));
    }

    if(exportsSet.size === 0) continue;
    
    let newContent = `"use client";\nimport * as React from "react";\n\n`;
    
    for(const exp of exportsSet) {
        if(exp.startsWith('use')) {
            newContent += `export const ${exp} = () => ({} as any);\n`;
        } else if (exp[0] === exp[0].toUpperCase()) {
            let tag = 'div';
            const lower = exp.toLowerCase();
            if(lower.includes('button')) tag = 'button';
            else if(lower.includes('input') || lower.includes('textarea')) tag = 'input';
            else if(lower.includes('select')) tag = 'select';
            else if(lower.includes('form') || lower === 'baseform') tag = 'form';
            else if(lower.includes('label')) tag = 'label';
            else if(lower.includes('table')) tag = 'table';
            else if(lower.includes('thead')) tag = 'thead';
            else if(lower.includes('tbody')) tag = 'tbody';
            else if(lower.includes('tfoot')) tag = 'tfoot';
            else if(lower.includes('tr')) tag = 'tr';
            else if(lower.includes('th')) tag = 'th';
            else if(lower.includes('td')) tag = 'td';
            else if(lower.includes('checkbox') || lower.includes('switch')) {
                tag = 'input'; 
                newContent += `export const ${exp} = React.forwardRef<any, any>(({ className, asChild, type, ...props }, ref) => <${tag} type="checkbox" ref={ref} {...props} />);\n${exp}.displayName = "${exp}";\n\n`;
                continue;
            }

            // Exclude `asChild`, `variant`, `size` mostly, but spread rest.
            newContent += `export const ${exp} = React.forwardRef<any, any>(({ className, asChild, variant, size, ...props }, ref) => <${tag} ref={ref} {...props} />);\n${exp}.displayName = "${exp}";\n\n`;
        } else {
            // normal const export or lowercase export (could be an animation or util)
            newContent += `export const ${exp} = {} as any;\n`;
        }
    }
    
    fs.writeFileSync(fullPath, newContent);
    console.log(`Cleaned ${file}`);
}
