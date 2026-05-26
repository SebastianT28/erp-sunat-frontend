const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const frontendDir = path.join(__dirname, 'src', 'app');
const excludeDirs = ['login', 'marketing'];

walkDir(frontendDir, function(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  
  // Skip excluded directories
  for (let exclude of excludeDirs) {
    if (filePath.includes(path.join('src', 'app', exclude))) {
      return;
    }
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Check if it has fetch(
  if (content.includes('fetch(')) {
    content = content.replace(/fetch\(/g, 'fetchWithAuth(');
    hasChanges = true;
  }

  // If we changed it, make sure the import is there
  if (hasChanges && !content.includes('fetchWithAuth')) {
    // Add import right after 'use client' or at the top
    const importStmt = `import { fetchWithAuth } from "@/utils/fetchWithAuth";\n`;
    if (content.startsWith('"use client"')) {
      content = content.replace('"use client"', `"use client"\n${importStmt}`);
    } else if (content.startsWith("'use client'")) {
      content = content.replace("'use client'", `'use client'\n${importStmt}`);
    } else {
      content = importStmt + content;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
});
