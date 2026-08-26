const fs = require("fs");
const path = require("path");

function processDirectory(dir) {
    fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".jsx")) {
            processFile(fullPath);
        }
    });
}

function processFile(filePath) {
    const originalContent = fs.readFileSync(filePath, "utf-8");

    // regex logic: find button definitions that contain variant="outline" AND hover:bg-slate-50 or hover:bg-muted/50
    // but do not contain hover:text-

    // Since component props can be multiline, we'll just look for occurrences of:
    // hover:bg-slate-50 and hover:bg-muted/50 and ensure they have a corresponding hover:text-
    // Actually, simply replacing 'hover:bg-slate-50' with 'hover:bg-slate-50 hover:text-slate-900'
    // where 'hover:text-' doesn't exist nearby is risky.
    // Let's do a simple string replace for known problematic patterns.

    let content = originalContent;

    const regexps = [
        /(className="[^"]*?\bvariant="outline"\b[^"]*?\bhover:bg-slate-50\b)(?!.*?\bhover:text-[^\s"]+)/gs,
        /(className=\{[^}]*?\bhover:bg-slate-50\b)(?!.*?\bhover:text-[^\s"'}]+)/gs,
        /(className="[^"]*?\bhover:bg-slate-50\b)(?!.*?\bhover:text-[^\s"]+)/gs,
        /(className="[^"]*?\bhover:bg-muted\/50\b)(?!.*?\bhover:text-[^\s"]+)/gs,
        /(className=\{[^}]*?\bhover:bg-muted\/50\b)(?!.*?\bhover:text-[^\s"'}]+)/gs,
    ];

    content = content.replace(
        /hover:bg-slate-50(?!.*hover:text-.*["'`}])/g,
        (match, offset, str) => {
            // Look ahead for up to 100 characters to see if hover:text is defined.
            const lookahead = str.substring(offset, offset + 150);
            if (lookahead.includes("hover:text-")) {
                return match;
            }
            return "hover:bg-slate-50 hover:text-slate-900";
        },
    );

    content = content.replace(
        /hover:bg-muted\/50(?!.*hover:text-.*["'`}])/g,
        (match, offset, str) => {
            const lookahead = str.substring(offset, offset + 150);
            if (lookahead.includes("hover:text-")) {
                return match;
            }
            return "hover:bg-muted/50 hover:text-foreground";
        },
    );

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`Updated: ${filePath}`);
    }
}

processDirectory(path.join(__dirname, "src"));
console.log("Done.");
