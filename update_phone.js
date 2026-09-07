const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    content = content.replace(/\+919876543210/g, '+918570004852');
    content = content.replace(/\+91 98765 43210/g, '+91 8570004852');
    
    content = content.replace(/\+919876543211/g, '+918570004852');
    content = content.replace(/\+91 98765 43211/g, '+91 8570004852');
    
    content = content.replace(/919876543210/g, '918570004852');

    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
});
