const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace component hook imports
  content = content.replace(/import\s+{\s*useSession[^}]*}\s+from\s+["']next-auth\/react["']/g, 'import { useSession } from "@/context/FirebaseAuthContext"');
  
  // Replace backend server session imports
  content = content.replace(/import\s+{\s*getServerSession[^}]*}\s+from\s+["']next-auth.*?["']/g, 'import { getServerSession } from "@/lib/auth-server"');
  
  // Remove authOptions imports entirely since they are no longer needed
  content = content.replace(/import\s+{\s*authOptions[^}]*}\s+from\s+["']@\/app\/api\/auth\/\[\.\.\.nextauth\]\/route["']/g, '');
  content = content.replace(/import\s+{\s*authOptions[^}]*}\s+from\s+["']\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/app\/api\/auth\/\[\.\.\.nextauth\]\/route["']/g, '');
  
  // Strip authOptions arguments from getServerSession calls
  content = content.replace(/getServerSession\(authOptions\)/g, 'getServerSession()');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'app'));
processDirectory(path.join(__dirname, 'src', 'components'));
console.log('NextAuth imports replaced.');
