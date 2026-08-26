const fs = require("fs");
const path = require("path");

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (
                file.endsWith(".tsx") ||
                file.endsWith(".ts") ||
                file.endsWith(".css")
            ) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, "..", "src"));
let changedCount = 0;

files.forEach((file) => {
    let content = fs.readFileSync(file, "utf8");

    // Regex to match "dark:" class definitions
    const newContent = content.replace(/dark:[\w\-\/\[\]\.]+/g, "");

    if (content !== newContent) {
        // Simple clean up of double spaces mapping to single space
        fs.writeFileSync(file, newContent, "utf8");
        changedCount++;
        console.log(`Purged dark theme from: ${file.split("src")[1]}`);
    }
});

console.log(`\nSuccessfully purged 'dark:' classes in ${changedCount} files.`);
