import os
import re

def fix_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return False
    
    original = content
    
    # 1. Fix }}, or }}; or }} at end of line
    content = re.sub(r'\}\}(,|;)?(\s*)$', r'}\1\2', content, flags=re.MULTILINE)
    
    # 2. Fix =} in arrow functions
    content = re.sub(r'=\}', r'=>', content)
    
    # 3. Fix Promise<ActionResult<unknown> => {
    content = re.sub(r'Promise<ActionResult<([^>]+)>\s*=>\s*\{', r'Promise<ActionResult<\1>> {', content)
    
    # 4. Fix onChange={(e) => {}} ...
    content = re.sub(r'onChange=\{\(e\)\s*=>\s*\{\}\}\s+', r'onChange={(e) => ', content)

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    root = r'C:\web\web\src'
    count = 0
    for dirpath, dirnames, filenames in os.walk(root):
        for f in filenames:
            if f.endswith('.ts') or f.endswith('.tsx'):
                if fix_file(os.path.join(dirpath, f)):
                    count += 1
                    print(f"Fixed: {os.path.join(dirpath, f)}")
    print(f"Total fixed files: {count}")

if __name__ == '__main__':
    main()
