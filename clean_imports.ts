import * as fs from "node:fs/promises";
import * as path from "node:path";

async function walk(dir: string, fileList: string[] = []) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const stat = await fs.stat(path.join(dir, file));
    if (stat.isDirectory()) {
      await walk(path.join(dir, file), fileList);
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        fileList.push(path.join(dir, file));
      }
    }
  }
  return fileList;
}

async function fixImports() {
  const files = await walk("src");
  for (const file of files) {
    let content = await fs.readFile(file, "utf-8");
    let changed = false;

    // Regex to find import { ... } from "../../..." or "../" or "./..."
    const importRegex = /from\s+["'](\.\.?\/.*?)["']/g;
    
    content = content.replace(importRegex, (match, relPath) => {
      // Calculate absolute path relative to project root
      const fileDir = path.dirname(file);
      const absPath = path.resolve(fileDir, relPath);
      const rootPath = path.resolve(".");
      
      if (absPath.startsWith(rootPath + "/src/")) {
        const aliasPath = absPath.replace(rootPath + "/src/", "@/");
        changed = true;
        return `from "${aliasPath}"`;
      }
      return match;
    });

    if (changed) {
      await fs.writeFile(file, content);
      console.log(`Updated ${file}`);
    }
  }
}

fixImports().catch(console.error);
