const fs = require('fs');

const indexPath = 'c:/Users/Divyanshi123456/Videos/baba pest control/index.html';
const galleryPath = 'c:/Users/Divyanshi123456/Videos/baba pest control/gallery.html';

let corruptedHtml = fs.readFileSync(indexPath, 'utf8');

// 1. Recover original index.html state (with links updated)
const docTypeIndex = corruptedHtml.indexOf('<!DOCTYPE html>', corruptedHtml.indexOf('bg-blac'));
if (docTypeIndex === -1) {
    console.error("Could not find the duplicated doctype. Aborting.");
    process.exit(1);
}

// recoveredHtml is the full file with gallery links updated (from the first script)
let recoveredHtml = corruptedHtml.substring(docTypeIndex);

// 2. Properly find Modal and extract it
const modalStart = recoveredHtml.indexOf('<!-- Modal: Gallery -->');
// Let's find the closing div of the modal.
// The modal has a backdrop div, then an inner div.
// Or we can just find '<!-- JavaScript Logic -->' or '<script>' tag
let modalEnd = recoveredHtml.indexOf('<!-- JavaScript Logic -->');
if (modalEnd === -1) {
    modalEnd = recoveredHtml.indexOf('<script>', modalStart);
}

if (modalStart === -1 || modalEnd === -1) {
    console.error("Could not find modal start or end");
    process.exit(1);
}

let modalHtml = recoveredHtml.substring(modalStart, modalEnd);
let gridStart = modalHtml.indexOf('<div class="grid grid-cols-1');
let gridEnd = modalHtml.indexOf('</div>\n        </div>\n    </div>');
if (gridEnd === -1) gridEnd = modalHtml.lastIndexOf('</div>');

let gridContent = modalHtml.substring(gridStart, gridEnd);
// Adjust grid closing divs if necessary, we just need the grid.
// Wait, safer to just use regex or manual slice for the grid.
let gridRegex = /<div class="grid grid-cols-1[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*<!--)/;
let match = modalHtml.match(/<div class="grid grid-cols-1[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>)/);
if (match) {
    gridContent = match[0];
} else {
    // fallback
    let endOfGrid = modalHtml.lastIndexOf('</div>', modalHtml.lastIndexOf('</div>') - 1);
    gridContent = modalHtml.substring(gridStart, endOfGrid);
}

// Let's just manually slice it correctly to avoid issues.
gridStart = modalHtml.indexOf('<div class="grid grid-cols-1');
// The grid has 4 items. We just want everything from gridStart up to the end of the modal container.
gridContent = modalHtml.substring(gridStart);
// Remove the last 2 closing divs of the modal container
gridContent = gridContent.replace(/<\/div>\s*<\/div>\s*$/, '');


// 3. Build gallery.html
const headStart = recoveredHtml.indexOf('<!DOCTYPE html>');
const bodyStart = recoveredHtml.indexOf('<body');
const headContent = recoveredHtml.substring(headStart, recoveredHtml.indexOf('>', bodyStart) + 1);

const headerStart = recoveredHtml.indexOf('<!-- Top Bar Contact Info -->');
const headerEnd = recoveredHtml.indexOf('</header>') + '</header>'.length;
let headerContent = recoveredHtml.substring(headerStart, headerEnd);

const footerStart = recoveredHtml.indexOf('<footer');
const footerEnd = recoveredHtml.indexOf('</body>');
let footerContent = recoveredHtml.substring(footerStart, footerEnd);

let galleryHeader = headerContent.replace(/href="#home"/g, 'href="index.html"');
galleryHeader = galleryHeader.replace(/href="#services"/g, 'href="index.html#services"');
galleryHeader = galleryHeader.replace(/href="#contact"/g, 'href="index.html#contact"');

const galleryPageHtml = `${headContent}
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
fs.writeFileSync(galleryPath, galleryPageHtml);

// 4. Update index.html
// Remove the modal entirely from recoveredHtml
let newIndexHtml = recoveredHtml.substring(0, modalStart) + recoveredHtml.substring(modalEnd);

// Remove JS logic
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

fs.writeFileSync(indexPath, newIndexHtml);

console.log("Fix completed successfully.");
