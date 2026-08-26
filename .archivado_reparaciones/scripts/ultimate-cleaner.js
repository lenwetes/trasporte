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

const targetLibs = [
    'lucide-react',
    '@fluentui',
    'framer-motion',
    'sonner',
    'react-day-picker',
    'lucide',
    '@radix-ui',
    'clsx',
    'tailwind-merge'
];

walk('src', (file) => {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Remove imports of visual frameworks
    const lines = content.split('\n');
    const filteredLines = lines.filter(line => {
        return !targetLibs.some(lib => line.includes(`from "${lib}"`) || line.includes(`from '${lib}'`));
    });
    content = filteredLines.join('\n');

    // 2. Clear Tailwind classes (className="...")
    content = content.replace(/className="[^"]*"/g, 'className=""');

    // 3. Replace Icon components tags
    // Matches <IconName ... /> or <IconName ...>...</IconName>
    // We target common icon names or any PascalCase tag that was likely an icon
    const iconTags = ['Loader2', 'AlertCircle', 'AlertTriangle', 'Hammer', 'ChevronRight', 'ChevronLeft', 'Search', 'Bell', 'User', 'Settings', 'LogOut', 'Plus', 'Download', 'FileText', 'Calendar', 'Clock', 'Check', 'X', 'Filter'];
    
    iconTags.forEach(tag => {
        const regex = new RegExp(`<${tag}[^>]*\\/>`, 'g');
        content = content.replace(regex, `<span>[${tag.toUpperCase()}]</span>`);
        const regexPair = new RegExp(`<${tag}[^>]*>.*?<\\/${tag}>`, 'g');
        content = content.replace(regexPair, `<span>[${tag.toUpperCase()}]</span>`);
    });

    // Also catch components ending in Icon
    content = content.replace(/<[A-Z][a-zA-Z0-9]*Icon[^>]*\/>/g, '<span>[ICON]</span>');
    content = content.replace(/<[A-Z][a-zA-Z0-9]*Icon[^>]*>.*?<\/[A-Z][a-zA-Z0-9]*Icon>/g, '<span>[ICON]</span>');

    // 4. Fix syntax errors in Promise<ActionResult<...>>
    // Pattern: Promise<ActionResult<Type> missing a >
    const syntaxPattern = /Promise<ActionResult<([a-zA-Z\[\]<> _]*)>(?!\s*>)\s*(\)[\s:]*|)([={]|=>)/g;
    content = content.replace(syntaxPattern, 'Promise<ActionResult<$1>> $2$3');

    // 5. Remove any leftover Tailwind @tailwind directives if any (unlikely in tsx but just in case)
    content = content.replace(/@tailwind\s+[a-z]+;/g, '');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Deep Cleaned: ${file}`);
    }
});
console.log('Limpieza Profunda completada.');
