document.addEventListener('DOMContentLoaded', function() {
    // List of image files in the directory
    const imageFiles = [
        '20250413_2046_AI Sauce Parody_remix_01jrrzhk51eser641tt2tqdhha.png',
        '20250413_2052_AI Sauce Mockup_remix_01jrrzwyz0ezqrf4fvnt4k5gf4.png',
        '20250413_2109_AI Sauce Mockup_remix_01jrs0w9axe2ervgyew6902xp1.png',
        '20250413_2120_AI Sauce Mockup_remix_01jrs1ffpde0gshteewdrjs3a7.png',
        '20250413_2153_AI-Themed Steak Sauce_remix_01jrs3cvr3fzkas1wg11hfsbts.png',
        '20250413_2215_AI Sauce Mockup_remix_01jrs4kn43f6zbmwc1etxjdweb.png',
        '20250413_2234_AI Sauce Bottle_remix_01jrs5q207ex5s6hwa764ss7b6.png',
        '20250413_2248_AI Sauce Bottle_remix_01jrs6h32wevvbk2kmpfgqynsy.png',
        '20250413_2302_AI Sauce Parody_remix_01jrs7a60sfmmbra579mthjkmw.png',
        '20250413_2311_AI Steak Sauce Satire_remix_01jrs7vd4kfkvs66nf5r3ksvxm.png',
        'IMG_4536.PNG',
        'IMG_4537.PNG'
    ];

    // Get elements
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentIndex = 0;

    // Generate gallery items
    imageFiles.forEach((file, index) => {
        // Create title from filename
        let title = file.replace(/\.[^/.]+$/, ""); // Remove file extension
        title = title.replace(/_remix_[^_]+$/, ""); // Remove remix ID
        title = title.split('_').slice(2).join(' '); // Remove date/time prefix
        
        // Create gallery item
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${file}" alt="${title}" loading="lazy">
            <div class="caption">${title}</div>
        `;
        
        // Add click event
        item.addEventListener('click', () => {
            openLightbox(index);
        });
        
        gallery.appendChild(item);
    });

    // Lightbox functionality
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    function updateLightbox() {
        const file = imageFiles[currentIndex];
        let title = file.replace(/\.[^/.]+$/, ""); // Remove file extension
        title = title.replace(/_remix_[^_]+$/, ""); // Remove remix ID
        title = title.split('_').slice(2).join(' '); // Remove date/time prefix
        
        lightboxImg.src = file;
        lightboxCaption.textContent = title;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % imageFiles.length;
        updateLightbox();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + imageFiles.length) % imageFiles.length;
        updateLightbox();
    }

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        }
    });

    // Preload images for smoother experience
    imageFiles.forEach(file => {
        const img = new Image();
        img.src = file;
    });
});
