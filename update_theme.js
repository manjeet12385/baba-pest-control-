const fs = require('fs');
const files = ['index.html', 'gallery.html', 'blog.html'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace emerald, teal, and blue colors with red
    content = content.replace(/(bg|text|border|ring|from|to|via)-emerald-/g, '$1-red-');
    content = content.replace(/(bg|text|border|ring|from|to|via)-teal-/g, '$1-red-');
    content = content.replace(/(bg|text|border|ring|from|to|via)-blue-/g, '$1-red-');
    
    // In case there is a primary custom CSS class or variables
    content = content.replace(/--primary-color:\s*#[a-fA-F0-9]+/g, '--primary-color: #dc2626');
    content = content.replace(/bg-primary/g, 'bg-red-600 hover:bg-red-700 transition-colors');
    content = content.replace(/hover:bg-emerald-700/g, 'hover:bg-red-700');
    content = content.replace(/hover:bg-blue-700/g, 'hover:bg-red-700');
    
    fs.writeFileSync(f, content);
    console.log(`Updated ${f}`);
  }
});
