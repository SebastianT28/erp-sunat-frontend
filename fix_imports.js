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

walkDir(frontendDir, function(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it uses fetchWithAuth but lacks the import
  if (content.includes('fetchWithAuth(') && !content.includes('import { fetchWithAuth }')) {
    const importStmt = `import { fetchWithAuth } from "@/utils/fetchWithAuth";\n`;
    
    if (content.includes('"use client"')) {
      content = content.replace('"use client"', `"use client"\n${importStmt}`);
    } else if (content.includes("'use client'")) {
      content = content.replace("'use client'", `'use client'\n${importStmt}`);
    } else {
      content = importStmt + content;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed import in:', filePath);
  }
});
