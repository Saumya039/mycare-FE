const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'app');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/session\.user\.role === "ADMIN"/g, '["ADMIN", "SUPER_ADMIN"].includes(session.user.role)');
  content = content.replace(/session\.user\.role !== "ADMIN"/g, '!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)');
  content = content.replace(/session\.user\.role === "DOCTOR"/g, '["DOCTOR", "SUPER_ADMIN"].includes(session.user.role)');
  content = content.replace(/session\.user\.role === "NURSE"/g, '["NURSE", "SUPER_ADMIN"].includes(session.user.role)');

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
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

processDirectory(dir);
