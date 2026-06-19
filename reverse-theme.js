commconst fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  const replacements = [
    { regex: /bg-slate-50 dark:bg-slate-950/g, replacement: 'bg-slate-950' },
    { regex: /bg-white\/60 dark:bg-slate-900\/50/g, replacement: 'bg-slate-900/50' },
    { regex: /bg-white dark:bg-slate-900/g, replacement: 'bg-slate-900' },
    { regex: /bg-white dark:bg-\[\#0b1437\]/g, replacement: 'bg-[#0b1437]' },
    { regex: /bg-slate-50 dark:bg-\[\#111c44\]/g, replacement: 'bg-[#111c44]' },
    { regex: /bg-slate-100 dark:bg-slate-800/g, replacement: 'bg-slate-800' },
    { regex: /text-slate-800 dark:text-slate-100/g, replacement: 'text-slate-100' },
    { regex: /text-slate-700 dark:text-slate-200/g, replacement: 'text-slate-200' },
    { regex: /text-slate-600 dark:text-slate-300/g, replacement: 'text-slate-300' },
    { regex: /text-slate-500 dark:text-slate-400/g, replacement: 'text-slate-400' },
    { regex: /border-slate-200 dark:border-slate-800/g, replacement: 'border-slate-800' },
    { regex: /border-slate-300 dark:border-slate-700/g, replacement: 'border-slate-700' },
  ];

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Reverted ${filePath}`);
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

processDirectory(directoryPath);
console.log('Done reverting dark mode classes.');
