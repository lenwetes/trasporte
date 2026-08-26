const fs = require('fs');
const path = require('path');

function purgeTabs(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // 1. Eliminar importaciones de fluent-tabs
    content = content.replace(/import\s*\{\s*CoopetraesTabsWrapper\s*as\s*Tabs,\s*CoopetraesTabPanel\s*as\s*TabsContent,\s*CoopetraesTabs\s*as\s*TabsList,\s*CoopetraesTab\s*as\s*TabsTrigger\s*\}\s*from\s*["']@\/components\/ui\/fluent-tabs["'];?/g, '');
    content = content.replace(/import\s*\{\s*CoopetraesTabsWrapper,\s*CoopetraesTabPanel,\s*CoopetraesTabs,\s*CoopetraesTab\s*\}\s*from\s*["']@\/components\/ui\/fluent-tabs["'];?/g, '');
    
    // 2. Reemplazar componentes por divs/buttons nativos
    // <Tabs ...> -> <div className="tabs-container" ...>
    content = content.replace(/<Tabs\s*([^>]*?)\s*>/g, '<div className="tabs-container" $1>');
    content = content.replace(/<\/Tabs>/g, '</div>');

    // <TabsList ...> -> <div className="tabs-list" style={{display:'flex', gap:'10px', borderBottom:'1px solid #eee'}} ...>
    content = content.replace(/<TabsList\s*([^>]*?)\s*>/g, '<div className="tabs-list" style={{display:"flex", gap:"10px", borderBottom:"1px solid #eee"}} $1>');
    content = content.replace(/<\/TabsList>/g, '</div>');

    // <TabsTrigger ...> -> <button className="tab-trigger" style={{padding:"8px 16px", background:"none", border:"none", cursor:"pointer"}} ...>
    content = content.replace(/<TabsTrigger\s*([^>]*?)\s*>/g, '<button className="tab-trigger" style={{padding:"8px 16px", background:"none", border:"none", cursor:"pointer"}} $1>');
    content = content.replace(/<\/TabsTrigger>/g, '</button>');

    // <TabsContent ...> -> <div className="tab-content" ...>
    content = content.replace(/<TabsContent\s*([^>]*?)\s*>/g, '<div className="tab-content" $1>');
    content = content.replace(/<\/TabsContent>/g, '</div>');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        return true;
    }
    return false;
}

function processDir(dir) {
    let count = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
            count += processDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.tsx'))) {
            if (purgeTabs(fullPath)) {
                count++;
            }
        }
    }
    return count;
}

const targetDir = path.join(__dirname, 'src');
console.log(`🧹 Purgando componentes de pestañas en ${targetDir}...`);
const total = processDir(targetDir);
console.log(`✅ Purgados ${total} archivos!`);
