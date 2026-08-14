const fs = require('fs');
let html = fs.readFileSync('c:/Users/Divyanshi123456/Videos/baba pest control/index.html', 'utf8');

let startIndex = html.indexOf('<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">');
let endIndex = html.indexOf('</section>', startIndex);
let innerGrid = html.substring(startIndex, endIndex).trim();

let gallerySectionStart = html.indexOf('<!-- Video Gallery Section -->');
if (gallerySectionStart === -1) gallerySectionStart = html.indexOf('<section class="py-16 md:py-24 bg-surface max-w-container-max mx-auto px-margin-desktop border-t border-subtle-gray" id="gallery">');
let gallerySectionEnd = html.indexOf('</section>', gallerySectionStart) + '</section>'.length;

html = html.substring(0, gallerySectionStart) + html.substring(gallerySectionEnd);

const modalHtml = `
<!-- Modal: Gallery -->
<div id="gallery-modal" class="fixed inset-0 z-[60] hidden bg-black/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-10">
    <div class="bg-surface-white/5 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-5 sm:p-8 shadow-2xl relative border border-white/10 animate-fadeIn">
        <button onclick="closeGalleryModal()" class="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined">close</span>
        </button>

        <div class="text-center mb-8 mt-2">
            <h2 class="font-headline-lg text-2xl md:text-4xl text-white font-bold">Media Gallery</h2>
            <p class="font-body-md text-body-md text-white/70 mt-2">Real footage of our clinical treatments</p>
        </div>

        ${innerGrid}
    </div>
</div>
`;

html = html.replace('<!-- JavaScript Logic -->', modalHtml + '\n<!-- JavaScript Logic -->');

// Replace nav links to use modal
html = html.replace(/<a class="text-secondary hover:text-danger-red transition-colors pb-1 border-b-2 border-transparent hover:border-danger-red" href="#action">Action Gallery<\/a>/g, '<a class="text-secondary hover:text-danger-red transition-colors pb-1 border-b-2 border-transparent hover:border-danger-red" href="javascript:void(0)" onclick="openGalleryModal()">Action Gallery</a>');

html = html.replace(/<a class="block text-secondary font-medium py-2 border-b border-subtle-gray" href="#action" onclick="toggleMobileMenu\(\)">Action Gallery<\/a>/g, '<a class="block text-secondary font-medium py-2 border-b border-subtle-gray" href="javascript:void(0)" onclick="toggleMobileMenu(); openGalleryModal()">Action Gallery</a>');

const jsFuncs = `
    function openGalleryModal() {
        document.getElementById('gallery-modal').classList.remove('hidden');
        document.body.classList.add('modal-active');
    }
    function closeGalleryModal() {
        document.getElementById('gallery-modal').classList.add('hidden');
        document.body.classList.remove('modal-active');
        document.querySelectorAll('#gallery-modal video').forEach(v => v.pause());
    }\n`;

html = html.replace('    // Modal helpers', '    // Modal helpers\n' + jsFuncs);

fs.writeFileSync('c:/Users/Divyanshi123456/Videos/baba pest control/index.html', html);
console.log("Success");
