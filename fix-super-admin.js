const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'app', 'api');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  if (!content.includes('session.user.role !== "SUPER_ADMIN"')) {
    content = content.replaceAll('session.user.role !== "ADMIN"', 'session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN"');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed", filePath);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

processDirectory(dir);
