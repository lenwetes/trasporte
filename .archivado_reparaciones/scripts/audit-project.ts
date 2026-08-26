import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve("src");
const MAX_LINES = 250;
const MAX_NESTING = 3;

interface AuditResult {
    file: string;
    lineCount: number;
    anyCount: number;
    maxNesting: number;
}

const results: AuditResult[] = [];

function auditFile(filePath: string) {
    if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return;
    if (filePath.includes(".test.ts")) return;

    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    let anyCount = 0;
    let maxNesting = 0;
    let currentNesting = 0;

    lines.forEach((line) => {
        // Simple any count
        const anyMatches = line.match(/: any/g);
        if (anyMatches) anyCount += anyMatches.length;

        // Simple nesting check
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        currentNesting += openBraces - closeBraces;
        if (currentNesting > maxNesting) maxNesting = currentNesting;
    });

    if (lines.length > MAX_LINES || anyCount > 0 || maxNesting > MAX_NESTING) {
        results.push({
            file: path.relative(process.cwd(), filePath),
            lineCount: lines.length,
            anyCount,
            maxNesting,
        });
    }
}

function walk(dir: string) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else {
            auditFile(fullPath);
        }
    });
}

walk(SRC_DIR);

// Output results
console.log("| File | Lines | any | Nesting |");
console.log("|---|---|---|---|");
results
    .sort((a, b) => b.lineCount - a.lineCount)
    .slice(0, 50)
    .forEach((r) => {
        console.log(
            `| ${r.file} | ${r.lineCount} | ${r.anyCount} | ${r.maxNesting} |`,
        );
    });
