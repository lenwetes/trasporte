const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx'));

for(const file of files) {
    const fullPath = path.join(uiDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Replace any, any with specific types where possible.
    content = content.replace(/React\.forwardRef<any, any>\(\(\{\s*className[^\}]*\}\s*:\s*any,\s*ref\s*:\s*any\)\s*=>\s*<(button|input|textarea|select|form|label|table|thead|tbody|tfoot|tr|th|td|div)\s*(type="checkbox"\s*)?ref=\{ref\}\s*\{\.\.\.props\}\s*\/>\)/g, (match, tag, isCheckbox) => {
        const titleCaseTag = tag[0].toUpperCase() + tag.slice(1).toLowerCase();
        let elType = `HTML${titleCaseTag}Element`;
        if (tag === 'textarea') elType = 'HTMLTextAreaElement';
        if (tag === 'table' || tag === 'thead' || tag === 'tbody' || tag === 'tfoot' || tag === 'tr' || tag === 'th' || tag === 'td' || tag === 'form') {
            elType = `HTML${titleCaseTag}Element`;
            if (tag === 'form') elType = 'HTMLFormElement';
        }
        
        let attrType = `React.${titleCaseTag}HTMLAttributes<${elType}>`;
        if (tag === 'textarea') attrType = `React.TextareaHTMLAttributes<${elType}>`;
        if (tag === 'div') {elType = 'HTMLDivElement'; attrType = `React.HTMLAttributes<HTMLDivElement>`;}
        if (tag === 'label') {elType = 'HTMLLabelElement'; attrType = `React.LabelHTMLAttributes<HTMLLabelElement>`;}

        return `React.forwardRef<${elType}, ${attrType}>(({ className, asChild, ...props }: any, ref: any) => <${tag} ${isCheckbox || ''}ref={ref as any} {...props} />)`;
    });

    // Also update instances without ": any" in parameters
    content = content.replace(/React\.forwardRef<any, any>\(\(\{\s*className[^\}]*\}, ref\)\s*=>\s*<(button|input|textarea|select|form|label|table|thead|tbody|tfoot|tr|th|td|div)\s*(type="checkbox"\s*)?ref=\{ref\}\s*\{\.\.\.props\}\s*\/>\)/g, (match, tag, isCheckbox) => {
        const titleCaseTag = tag[0].toUpperCase() + tag.slice(1).toLowerCase();
        let elType = `HTML${titleCaseTag}Element`;
        if (tag === 'textarea') elType = 'HTMLTextAreaElement';
        if (tag === 'form') elType = 'HTMLFormElement';
        if (tag === 'td' || tag === 'th' || tag === 'tr' || tag === 'tbody' || tag === 'thead' || tag === 'tfoot' || tag === 'table') {
               const tableMap = {
                   'table': 'HTMLTableElement',
                   'thead': 'HTMLTableSectionElement',
                   'tbody': 'HTMLTableSectionElement',
                   'tfoot': 'HTMLTableSectionElement',
                   'tr': 'HTMLTableRowElement',
                   'th': 'HTMLTableCellElement',
                   'td': 'HTMLTableCellElement'
               };
               elType = tableMap[tag];
        }
        
        let attrType = `React.${titleCaseTag}HTMLAttributes<${elType}>`;
        if (tag === 'textarea') attrType = `React.TextareaHTMLAttributes<${elType}>`;
        if (tag === 'div') {elType = 'HTMLDivElement'; attrType = `React.HTMLAttributes<HTMLDivElement>`;}
        if (tag === 'label') {elType = 'HTMLLabelElement'; attrType = `React.LabelHTMLAttributes<HTMLLabelElement>`;}
        if (tag.startsWith('t') && tag !== 'textarea') attrType = `React.HTMLAttributes<${elType}>`;

        return `React.forwardRef<${elType}, ${attrType}>(({ className, asChild, variant, size, ...props }, ref) => <${tag} ${isCheckbox || ''}ref={ref as any} {...props} />)`;
    });

    fs.writeFileSync(fullPath, content);
}
console.log("Types upgraded!");
