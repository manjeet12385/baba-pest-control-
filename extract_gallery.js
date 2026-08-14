const fs = require('fs');

const indexHtmlPath = 'c:/Users/Divyanshi123456/Videos/baba pest control/index.html';
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Extract Head
const headStart = html.indexOf('<!DOCTYPE html>');
const bodyStart = html.indexOf('<body');
const headContent = html.substring(headStart, html.indexOf('>', bodyStart) + 1);

// 2. Extract Top Bar and Header
const headerStart = html.indexOf('<!-- Top Bar Contact Info -->');
const headerEnd = html.indexOf('</header>') + '</header>'.length;
let headerContent = html.substring(headerStart, headerEnd);

// 3. Extract Footer
const footerStart = html.indexOf('<footer');
const footerEnd = html.indexOf('</body>');
let footerContent = html.substring(footerStart, footerEnd);

// 4. Extract Gallery Grid Content from Modal
const modalStart = html.indexOf('<!-- Modal: Gallery -->');
const modalEnd = html.indexOf('<!-- JS for Animations & Modals -->'); // just before this
let modalHtml = html.substring(modalStart, modalEnd);

const gridStart = modalHtml.indexOf('<div class="grid grid-cols-1');
const gridEnd = modalHtml.indexOf('</div>\n    </div>\n</div>'); // The end of the grid inside the modal
let gridContent = modalHtml.substring(gridStart, gridEnd + '</div>'.length);

// 5. Build gallery.html
// Need to modify links in header to point back to index.html
let galleryHeader = headerContent.replace(/href="#home"/g, 'href="index.html"');
galleryHeader = galleryHeader.replace(/href="#services"/g, 'href="index.html#services"');
galleryHeader = galleryHeader.replace(/href="#contact"/g, 'href="index.html#contact"');
// Action gallery should not have href back to itself, just # or current page, and no onclick
galleryHeader = galleryHeader.replace(/href="javascript:void\(0\)" onclick="openGalleryModal\(\)"/g, 'href="gallery.html" class="text-danger-red"');
galleryHeader = galleryHeader.replace(/href="javascript:void\(0\)" onclick="toggleMobileMenu\(\); openGalleryModal\(\)"/g, 'href="gallery.html"');

const galleryPageHtml = `
${headContent}
${galleryHeader}

<main class="min-h-screen bg-surface-container py-12 md:py-20">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-black text-deep-navy mb-4">Media Gallery</h1>
            <p class="text-lg text-secondary">Real footage of our clinical treatments</p>
        </div>
        ${gridContent}
    </div>
</main>

${footerContent}
<script>
    function toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
        } else {
            menu.classList.add('hidden');
        }
    }
</script>
</body>
</html>
`;

fs.writeFileSync('c:/Users/Divyanshi123456/Videos/baba pest control/gallery.html', galleryPageHtml);

// 6. Update index.html
// Replace links
let newIndexHtml = html;
newIndexHtml = newIndexHtml.replace(/href="javascript:void\(0\)" onclick="openGalleryModal\(\)"/g, 'href="gallery.html"');
newIndexHtml = newIndexHtml.replace(/href="javascript:void\(0\)" onclick="toggleMobileMenu\(\); openGalleryModal\(\)"/g, 'href="gallery.html"');

// Remove modal HTML
newIndexHtml = newIndexHtml.substring(0, modalStart) + newIndexHtml.substring(modalEnd);

// Remove JS logic for gallery modal
const jsToRemove = `    function openGalleryModal() {
        document.getElementById('gallery-modal').classList.remove('hidden');
        document.body.classList.add('modal-active');
    }
    function closeGalleryModal() {
        document.getElementById('gallery-modal').classList.add('hidden');
        document.body.classList.remove('modal-active');
        document.querySelectorAll('#gallery-modal video').forEach(v => v.pause());
    }`;
newIndexHtml = newIndexHtml.replace(jsToRemove, '');
newIndexHtml = newIndexHtml.replace('// Modal helpers\n\n', '// Modal helpers\n');

fs.writeFileSync(indexHtmlPath, newIndexHtml);

console.log("Extraction and update successful.");
