const fs = require("fs");
const content = fs.readFileSync("eslint_to_fix.json");
const str = content.toString("utf16le");
const data = JSON.parse(str.replace(/^\uFEFF/, ""));
data.forEach((f) => {
    const msgs = f.messages.filter(
        (m) => m.ruleId === "react/no-unescaped-entities",
    );
    if (msgs.length > 0) {
        console.log(`${f.filePath}: ${msgs.map((m) => m.line).join(", ")}`);
    }
});
