const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');

    // Mappings from old green shades to red shades
    content = content.replace(/#16a34a/gi, '#dc2626'); // green-600 -> red-600
    content = content.replace(/#15803d/gi, '#b91c1c'); // green-700 -> red-700
    content = content.replace(/#86efac/gi, '#fca5a5'); // green-300 -> red-300
    content = content.replace(/#dcfce7/gi, '#fee2e2'); // green-100 -> red-100
    content = content.replace(/#14532d/gi, '#7f1d1d'); // green-900 -> red-900
    content = content.replace(/#166534/gi, '#991b1b'); // green-800 -> red-800
    content = content.replace(/#22c55e/gi, '#ef4444'); // green-500 -> red-500

    fs.writeFileSync(f, content);
});

console.log('Hex colors replaced in all HTML files.');
