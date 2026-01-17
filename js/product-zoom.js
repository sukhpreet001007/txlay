document.addEventListener('DOMContentLoaded', function () {
    const mainImg = document.getElementById('mainProductImg');
    const wrapper = document.getElementById('mainImageWrapper');
    const result = document.getElementById('zoomResult');
    const lens = document.getElementById('zoomLens');
    const thumbnails = document.querySelectorAll('.thumb-box');

    // 1. Thumbnail Switching Logic
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function () {
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Swap Image
            const imgInside = this.querySelector('img');
            if (imgInside && mainImg) {
                const newSrc = imgInside.getAttribute('src');
                // Optional: Fade effect
                mainImg.style.opacity = '0.5';
                setTimeout(() => {
                    mainImg.src = newSrc;
                    mainImg.style.opacity = '1';

                    // Update zoom background immediately if visible
                    if (result.style.display === 'block') {
                        result.style.backgroundImage = `url('${newSrc}')`;
                    }
                }, 150);
            }
        });
    });

    // 2. Zoom Effect Logic
    // Only initialize if elements exist and we are on a large screen (mouse device typical)
    if (!mainImg || !wrapper || !result || !lens) return;

    // Ratios
    let cx, cy;

    function initZoomInfo() {
        // Calculate the ratio between result div and lens
        // We assume the background image in result will be scaled by this ratio
        // But commonly, we just want to show the original image size vs the displayed image size
        // If the original image is 2000px and displayed is 500px, ratio is 4.

        // However, standard "Zoom" plugins often simply magnify the displayed image by a factor (e.g. 2x)
        // Let's implement a standard magnification factor logic.

        /* 
           Approach:
           lens size should be: result size / magnification factor.
           background size of result should be: image size * magnification factor.
        */

        // Let's assume result div is approx 400x400 or matches constraints.
        // We calculate lens size based on that.

        // Wait for image load to get dimensions
        if (!mainImg.complete) {
            mainImg.onload = initZoomInfo;
            return;
        }

        // Configure magnification
        // Amazon-like feel often implies 1:1 with source image if source is high res, 
        // OR a fix 2x/3x zoom.
        // As we don't have a separate "data-zoom-image" with high res, we'll assume the current image IS high res enough
        // or we just scale it up.

        result.style.backgroundImage = `url('${mainImg.src}')`;
    }

    // Call init
    initZoomInfo();

    // Re-init on mouse enter to ensure dimensions are fresh (responsive resizing)
    wrapper.addEventListener('mouseenter', function () {
        // Show lens and result
        // Only on non-mobile
        if (window.innerWidth < 992) return;

        lens.style.display = 'block';
        result.style.display = 'block';

        // Refresh Source in case it changed
        result.style.backgroundImage = `url('${mainImg.src}')`;

        // Calculate Ratios
        // Let's define the ratio. Width of Result / Width of Lens = Ratio.
        // But usually we want the result background size to be e.g. 2.5x the Main Image.
        const scaleFactor = 2.5;

        // Resize lens based on Scale Factor
        // Lens width = Main Image Width / Scale Factor
        // (Because Result Window Width / Lens Width = Scale Factor) -> if Result Window Width is flexible...
        // Actually typically Result Window is Fixed Size (e.g. 500px).
        // Scale Factor = (Original Image Width) / (Displayed Image Width) ?? 
        // Let's force a scale factor of 2.5 relative to displayed size.

        const imgWidth = mainImg.offsetWidth;
        const imgHeight = mainImg.offsetHeight;

        // Set background size of result: imgWidth * scale * imgHeight * scale
        const bgWidth = imgWidth * scaleFactor;
        const bgHeight = imgHeight * scaleFactor;

        result.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;

        // Now calculate lens size
        // Lens W = Result W / Scale Factor
        // Lens H = Result H / Scale Factor
        const resultRect = result.getBoundingClientRect();

        lens.style.width = (resultRect.width / scaleFactor) + 'px';
        lens.style.height = (resultRect.height / scaleFactor) + 'px';

        cx = resultRect.width / lens.offsetWidth;
        cy = resultRect.height / lens.offsetHeight;
    });

    wrapper.addEventListener('mouseleave', function () {
        lens.style.display = 'none';
        result.style.display = 'none';
    });

    wrapper.addEventListener('mousemove', moveLens);

    function moveLens(e) {
        // Only run if lens is visible
        if (lens.style.display === 'none') return;

        e.preventDefault();

        const pos = getCursorPos(e);
        let x = pos.x - (lens.offsetWidth / 2);
        let y = pos.y - (lens.offsetHeight / 2);

        // Boundary checks
        if (x > mainImg.offsetWidth - lens.offsetWidth) {
            x = mainImg.offsetWidth - lens.offsetWidth;
        }
        if (x < 0) {
            x = 0;
        }
        if (y > mainImg.offsetHeight - lens.offsetHeight) {
            y = mainImg.offsetHeight - lens.offsetHeight;
        }
        if (y < 0) {
            y = 0;
        }

        lens.style.left = x + 'px';
        lens.style.top = y + 'px';

        // Move result background
        result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
    }

    function getCursorPos(e) {
        const a = mainImg.getBoundingClientRect();
        // Calculate cursor position relative to image
        let x = e.pageX - a.left;
        let y = e.pageY - a.top;

        // Adjust for scrolling
        x = x - window.scrollX;
        y = y - window.scrollY;

        return { x: x, y: y };
    }
});
