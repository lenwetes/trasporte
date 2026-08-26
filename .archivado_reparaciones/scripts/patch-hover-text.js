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
    let content = originalContent;

    // Apply ! to all text color modifiers with hover: inside variant="outline" buttons
    // Actually, simply replacing 'hover:text-red-700' with 'hover:!text-red-700' globally for all text colors works.
    // Let's replace hover:text-(color) with hover:!text-(color) everywhere in className strings.

    // First, find all hover:text-xyz inside classNames
    content = content.replace(
        /className=(["']|{`.*?|{cn\()([^}]*?)hover:text-([a-z0-9-]+)([^}]*?)(["'}]|`})/gs,
        (match) => {
            // We do a global replacement of hover:text- with hover:!text- inside this className block
            // careful not to replace hover:!text- multiple times
            return match.replace(/hover:text-([a-z0-9-]+)/g, (m, color) => {
                if (color === "accent-foreground") return m;
                return `hover:!text-${color}`;
            });
        },
    );

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`Updated: ${filePath}`);
    }
}

// Just safely patch a few specific problem files.
const files = [
    "src/components/delete-user-button.tsx",
    "src/components/delete-vehicle-button.tsx",
    "src/components/delete-document-button.tsx",
    "src/app/dashboard/safety/operatividad/_components/owners-table.tsx",
    "src/app/dashboard/safety/operatividad/_components/vehicles-blocking-table.tsx",
    "src/app/dashboard/usuarios/page.tsx",
    "src/components/reports/report-card.tsx",
    "src/app/dashboard/safety/indicadores/_components/report-actions.tsx",
];

files.forEach((f) => {
    const p = path.join(__dirname, f);
    if (fs.existsSync(p)) processFile(p);
});
console.log("Done.");
