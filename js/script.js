document.addEventListener('DOMContentLoaded', function () {
    const banners = document.querySelectorAll('.hero-banner');

    banners.forEach((banner) => {
        const slidesContainer = banner.querySelector('.banner-slides');
        const originalSlides = banner.querySelectorAll('.banner-slide');
        const prevBtn = banner.querySelector('.banner-arrow.prev');
        const nextBtn = banner.querySelector('.banner-arrow.next');

        if (!slidesContainer || originalSlides.length === 0) return;

        // Clone first and last slides for infinite loop effect
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

        slidesContainer.appendChild(firstClone);
        slidesContainer.insertBefore(lastClone, originalSlides[0]);

        const allSlides = banner.querySelectorAll('.banner-slide');
        const totalSlides = allSlides.length;
        let currentIndex = 1; // Start at the first real slide
        let isTransitioning = false;
        let slideInterval;

        // Initial position (show first real slide)
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

        function moveSlide(index, animate = true) {
            if (animate) {
                slidesContainer.style.transition = 'transform 0.5s ease-in-out';
                isTransitioning = true;
            } else {
                slidesContainer.style.transition = 'none';
                isTransitioning = false;
            }
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        }

        // Handle transition end to jump if necessary (infinite loop illusion)
        slidesContainer.addEventListener('transitionend', () => {
            isTransitioning = false;
            // If we are at the cloned last slide (index 0), jump to real last slide
            if (currentIndex === 0) {
                moveSlide(totalSlides - 2, false);
            }
            // If we are at the cloned first slide (last index), jump to real first slide
            if (currentIndex === totalSlides - 1) {
                moveSlide(1, false);
            }
        });

        function nextSlide() {
            if (isTransitioning) return;
            moveSlide(currentIndex + 1);
        }

        function prevSlide() {
            if (isTransitioning) return;
            moveSlide(currentIndex - 1);
        }

        function startAutoSlide() {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 3000);
        }

        function resetAutoSlide() {
            clearInterval(slideInterval);
            startAutoSlide();
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevSlide();
                resetAutoSlide();
            });
        }

        startAutoSlide();
    });


    // Category Search & Filter Logic
    const categorySearchToggle = document.getElementById('categorySearchToggle');
    const categorySearchContainer = document.getElementById('categorySearchContainer');
    const categorySearchInput = document.getElementById('categorySearchInput');
    const sidebarCategories = document.getElementById('sidebarCategories');

    if (categorySearchToggle && categorySearchContainer && categorySearchInput && sidebarCategories) {
        // Toggle Search Bar
        categorySearchToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent toggling the accordion on mobile if inside header

            const isHidden = categorySearchContainer.style.display === 'none';

            if (isHidden) {
                // Open
                categorySearchToggle.classList.add('text-primary'); // Highlight icon
                categorySearchContainer.style.display = 'block';
                categorySearchContainer.style.height = '0';
                categorySearchContainer.style.opacity = '0';

                // Force reflow
                void categorySearchContainer.offsetWidth;

                // Animate to full height
                categorySearchContainer.style.transition = 'height 0.3s ease, opacity 0.3s ease';
                categorySearchContainer.style.height = categorySearchContainer.scrollHeight + 'px';
                categorySearchContainer.style.opacity = '1';

                setTimeout(() => {
                    categorySearchContainer.style.height = 'auto'; // Reset to auto for responsiveness
                    categorySearchInput.focus();
                }, 300);

            } else {
                // Close
                categorySearchToggle.classList.remove('text-primary'); // Remove highlight

                // Set explicit height to animate from
                categorySearchContainer.style.height = categorySearchContainer.scrollHeight + 'px';
                categorySearchContainer.style.opacity = '1';

                // Force reflow
                void categorySearchContainer.offsetWidth;

                // Animate to 0
                categorySearchContainer.style.height = '0';
                categorySearchContainer.style.opacity = '0';

                setTimeout(() => {
                    categorySearchContainer.style.display = 'none';
                    categorySearchInput.value = ''; // Clear input
                    filterCategories(''); // Reset list
                }, 300);
            }
        });

        // Filter Logic
        categorySearchInput.addEventListener('input', function () {
            filterCategories(this.value.toLowerCase().trim());
        });

        function filterCategories(query) {
            const listItems = sidebarCategories.querySelectorAll('.list-group-item');

            listItems.forEach(item => {
                const link = item.querySelector('a');
                if (link) {
                    const text = link.textContent.toLowerCase();
                    // Check if text matches query
                    if (text.includes(query)) {
                        item.style.display = '';
                        // Highlight match? maybe overkill for now, just filtering
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        }

        // Prevent click on input from bubbling (optional safety)
        categorySearchInput.addEventListener('click', (e) => e.stopPropagation());
    }

    // ===================================
    // MY ACCOUNT TAB SWITCHING
    // ===================================
    const sidebarLinks = document.querySelectorAll('.sidebar-link1');
    const tabContents = document.querySelectorAll('.tab-content');

    if (sidebarLinks.length > 0 && tabContents.length > 0) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetTab = this.getAttribute('data-tab');

                // Remove active class from all links and contents
                sidebarLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked link and corresponding content
                this.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
});
