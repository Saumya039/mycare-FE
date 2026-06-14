const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // We are removing dark: classes completely to clean up the code,
  // and changing translucent white backgrounds to solid white.
  
  const replacements = [
    { regex: /bg-white\/[0-9]+/g, replacement: 'bg-white' }, // Remove translucency
    { regex: /backdrop-blur-[a-z]+/g, replacement: '' }, // Remove blurs
    { regex: /dark:bg-\[[^\]]+\]\/?[0-9]*/g, replacement: '' }, // Remove dark custom backgrounds
    { regex: /dark:bg-[a-z]+-[0-9]+\/?[0-9]*/g, replacement: '' }, // Remove dark slate backgrounds
    { regex: /dark:border-\[[^\]]+\]\/?[0-9]*/g, replacement: '' }, // Remove dark borders
    { regex: /dark:border-[a-z]+-[0-9]+\/?[0-9]*/g, replacement: '' }, 
    { regex: /dark:text-[a-z]+-[0-9]+/g, replacement: '' }, // Remove dark text overrides
    { regex: /dark:hover:[^ "']+/g, replacement: '' }, // Remove dark hover overrides
    { regex: /text-slate-100/g, replacement: 'text-slate-900' }, // High contrast text
    { regex: /text-slate-200/g, replacement: 'text-slate-800' },
    { regex: /text-slate-300/g, replacement: 'text-slate-700' },
    { regex: /text-slate-400/g, replacement: 'text-slate-500' },
    { regex: /bg-\[\#111c44\]/g, replacement: 'bg-slate-50' }, // Replace remaining dark backgrounds
    { regex: /bg-\[\#0b1437\]/g, replacement: 'bg-white' },
    { regex: /border-slate-800/g, replacement: 'border-slate-200' },
    { regex: /border-slate-700/g, replacement: 'border-slate-300' },
    // Fix double spaces that might occur after removing dark: classes
    { regex: /  +/g, replacement: ' ' }
  ];

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  // Clean up empty class attributes or trailing spaces
  content = content.replace(/className=" "/g, 'className=""');

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

processDirectory(directoryPath);
console.log('Done enforcing light theme classes.');
