/**
 * Script de reparación masiva de sintaxis JSX
 * Patrones a corregir:
 * 1. `href={value }}` → `href={value}`  (doble llave de cierre en atributos JSX)
 * 2. `disabled={value }}` → `disabled={value}`
 * 3. `  }})` en llamadas de función → `  })`
 * 4. Botones con texto fuera del `>`: `<Button\n  TEXT\n>` → ya son correctos, pero `<Button TEXT\n>` → broken
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob").sync;

const files = glob("src/**/*.{tsx,ts}", {
  cwd: "C:/web/web",
  absolute: true,
});

let totalChanged = 0;
let filesChanged = 0;

for (const file of files) {
  let original;
  try {
    original = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }

  let content = original;

  // 1. Fix `href={expr /} >` broken pattern: `href={...LINK... /} >` → `href={...LINK...}>`
  //    Pattern: `<Link href="/something" /} >` → `<Link href="/something" >`
  content = content.replace(/href=\{([^}]+)\s*\/\}\s*\}/g, "href={$1}");

  // 2. Fix `  }})` inside JSX tsx attributes where } was doubled — e.g., `{ align: "right"  }})` → `{ align: "right" })`
  content = content.replace(/(\s*\}\s*)\}\)/g, "$1)");

  // 3. Fix JSX attribute with extra `}}` closing: `attr={expr }}`  → `attr={expr }`
  //    e.g.: `disabled={isSubmitting }}>`  OR `icon={ShieldCheck }}>`
  content = content.replace(/=\{([^}]*[^}])\s*\}\}/g, "={$1}");

  // 4. Fix `<Link href={x /} >` pattern  → `<Link href={x}>`
  content = content.replace(/(\w+=\{[^}]+)\s*\/\}\s*/g, "$1} ");

  // 5. Fix ` }})` at end of toast calls or similar: `.toast(x, { id: "y"  }})` → `.toast(x, { id: "y" })`
  content = content.replace(/,\s*\{\s*id:\s*"([^"]+)"\s*\}\}([\)\;])/g, ', { id: "$1" }$2');

  if (content !== original) {
    fs.writeFileSync(file, content, "utf8");
    filesChanged++;
    totalChanged++;
    console.log("Fixed:", path.relative("C:/web/web", file));
  }
}

console.log(`\nTotal files changed: ${filesChanged}`);
