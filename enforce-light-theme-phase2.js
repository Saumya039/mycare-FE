const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceInFile(filePath) {
  // Do not modify the main login page again since it has specific branding
  if (filePath.includes('src\\app\\login\\page.tsx') || filePath.includes('src/app/login/page.tsx')) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  const replacements = [
    // Backgrounds
    { regex: /bg-slate-950/g, replacement: 'bg-slate-50' },
    { regex: /bg-slate-900\/80/g, replacement: 'bg-white' },
    { regex: /bg-slate-900\/50/g, replacement: 'bg-white' },
    { regex: /bg-slate-900\/40/g, replacement: 'bg-slate-100' }, // Table headers
    { regex: /bg-slate-900/g, replacement: 'bg-white' },
    { regex: /bg-slate-800\/50/g, replacement: 'bg-slate-50' },
    { regex: /bg-slate-800\/20/g, replacement: 'bg-slate-50' },
    { regex: /bg-slate-800/g, replacement: 'bg-slate-100' },
    
    // Text colors
    { regex: /text-slate-100/g, replacement: 'text-slate-900' },
    { regex: /text-slate-200/g, replacement: 'text-slate-800' },
    { regex: /text-slate-300/g, replacement: 'text-slate-700' },
    { regex: /text-slate-400/g, replacement: 'text-slate-600' },
    
    // Borders
    { regex: /border-slate-800\/50/g, replacement: 'border-slate-200' },
    { regex: /border-slate-800/g, replacement: 'border-slate-200' },
    { regex: /border-slate-700/g, replacement: 'border-slate-300' },
    
    // Hover states
    { regex: /hover:bg-slate-800\/20/g, replacement: 'hover:bg-slate-100' },
    { regex: /hover:bg-slate-800/g, replacement: 'hover:bg-slate-100' },
    { regex: /hover:text-slate-100/g, replacement: 'hover:text-slate-900' },

    // Divide
    { regex: /divide-slate-800\/50/g, replacement: 'divide-slate-200' },
    { regex: /divide-slate-800/g, replacement: 'divide-slate-200' },
  ];

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory(path.join(srcDir, 'app'));
processDirectory(path.join(srcDir, 'components'));
console.log('Done enforcing light theme phase 2.');
