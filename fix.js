const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix Call floating button
    content = content.replace(/<a href="tel:\+919876543210" class="w-13 h-13[^>]+title="Call Us Now \(\+91 98765 43210\)">/g, 
        '<a href="tel:+919876543210" class="w-13 h-13 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 p-3 relative group" title="Call Us Now (+91 98765 43210)">'
    );
    // Fix ping ring inside Call button (it was accidentally changed from bg-red-300 or bg-emerald-300 to -red-300)
    content = content.replace(/<span class="relative inline-flex rounded-full h-3\.5 w-3\.5 [^"]+"><\/span>/g, 
        '<span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-300"></span>'
    );

    // Fix WhatsApp floating button
    content = content.replace(/<a href="https:\/\/wa\.me\/919876543210\?text=Hi%20Baba%20Pest%20Control,%20I%20want%20to%20book%20an%20inspection" target="_blank"[^>]+title="Chat on WhatsApp">/g, 
        '<a href="https://wa.me/919876543210?text=Hi%20Baba%20Pest%20Control,%20I%20want%20to%20book%20an%20inspection" target="_blank" class="w-13 h-13 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 p-3" title="Chat on WhatsApp">'
    );

    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
});
