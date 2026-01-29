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
                categorySearchToggle.classList.remove('text-primary'); // Remove highlight

                categorySearchContainer.style.height = categorySearchContainer.scrollHeight + 'px';
                categorySearchContainer.style.opacity = '1';

                void categorySearchContainer.offsetWidth;

                categorySearchContainer.style.height = '0';
                categorySearchContainer.style.opacity = '0';

                setTimeout(() => {
                    categorySearchContainer.style.display = 'none';
                    categorySearchInput.value = '';
                    filterCategories('');
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
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        }

        // Prevent click on input from bubbling (optional safety)
        categorySearchInput.addEventListener('click', (e) => e.stopPropagation());
    }

    // MY ACCOUNT TAB SWITCHING
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


    const rowsContainer = document.getElementById('quick-order-rows-container');
    const addEntryBtn = document.getElementById('add-entry-btn');
    const totalItemsTop = document.getElementById('total-items-top');
    const totalItemsBottom = document.getElementById('total-items-bottom');
    const subtotalTop = document.getElementById('subtotal-value-top');
    const subtotalBottom = document.getElementById('subtotal-value-bottom');
    const downloadCsvBtn = document.getElementById('download-csv-btn');

    const mockProducts = {
        "G3017637": {
            title: "Vise-Grip 11\" Locking C-Clamp, 11R, Easy Release Trigger, 3-3/8\" Jaw Opening, Alloy Steel",
            price: 15.00,
            originalPrice: 21.99,
            discount: "31% off"
        },
        "G1234567": {
            title: "Industrial Safety Gloves, Heavy Duty, Large",
            price: 9.50,
            originalPrice: 12.00,
            discount: "20% off"
        },
        "G7654321": {
            title: "Office Chair, Ergonomic Mesh Back",
            price: 85.00,
            originalPrice: 110.00,
            discount: "22% off"
        }
    };

    if (rowsContainer) {
        addRows(5);

        addEntryBtn.addEventListener('click', () => {
            addRows(5);
        });

        rowsContainer.addEventListener('input', handleRowInput);
        rowsContainer.addEventListener('click', handleRowClick);

        if (downloadCsvBtn) {
            downloadCsvBtn.addEventListener('click', (e) => {
                e.preventDefault();
                downloadCSV();
            });
        }
    }

    function addRows(count) {
        for (let i = 0; i < count; i++) {
            const row = document.createElement('div');
            row.className = 'row-item';
            row.innerHTML = `
                <div class="input-field">
                    <label>Item Number*</label>
                    <input type="text" class="item-number-input" placeholder="Item Number*">
                </div>
                <div class="product-info-cell">
                    <!-- Loaded dynamically -->
                </div>
                <div class="input-field">
                    <label>Qty*</label>
                    <input type="number" class="qty-input" value="1" min="1">
                </div>
                <div class="price-cell">
                    <div class="price-display">$0.00 <span class="price-unit">/ea</span></div>
                    <div class="price-subtotal">Subtotal: $0.00</div>
                </div>
                <button class="btn-delete">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            rowsContainer.appendChild(row);
        }
        updateTotals();
    }

    function handleRowInput(e) {
        const target = e.target;
        const row = target.closest('.row-item');

        if (target.classList.contains('item-number-input')) {
            const val = target.value.toUpperCase().trim();
            const infoCell = row.querySelector('.product-info-cell');
            const priceCell = row.querySelector('.price-cell');

            if (val.length >= 3) {
                infoCell.innerHTML = `
                    <div class="loading-dots">
                        <span></span><span></span><span></span>
                    </div>
                `;

                setTimeout(() => {
                    const product = mockProducts[val];
                    if (product) {
                        infoCell.innerHTML = product.title;
                        infoCell.setAttribute('data-price', product.price);

                        let priceHtml = '';
                        if (product.originalPrice) {
                            priceHtml += `<span class="price-old">$${product.originalPrice.toFixed(2)}</span>`;
                        }
                        if (product.discount) {
                            priceHtml += `<span class="price-discount">${product.discount}</span>`;
                        }
                        priceHtml += `<div class="price-actual">$${product.price.toFixed(2)} <span class="price-unit">/ea</span></div>`;

                        priceCell.innerHTML = `
                            <div class="price-display">${priceHtml}</div>
                            <div class="price-subtotal">Subtotal: $${product.price.toFixed(2)}</div>
                        `;
                    } else {
                        infoCell.innerHTML = '<span class="text-danger">Item not found</span>';
                        priceCell.innerHTML = `
                            <div class="price-display">$0.00 <span class="price-unit">/ea</span></div>
                            <div class="price-subtotal">Subtotal: $0.00</div>
                        `;
                        infoCell.removeAttribute('data-price');
                    }
                    updateTotals();
                }, 800);
            } else {
                infoCell.innerHTML = '';
                infoCell.removeAttribute('data-price');
                priceCell.innerHTML = `
                    <div class="price-display">$0.00 <span class="price-unit">/ea</span></div>
                    <div class="price-subtotal">Subtotal: $0.00</div>
                `;
                updateTotals();
            }
        }

        if (target.classList.contains('qty-input')) {
            updateRowSubtotal(row);
            updateTotals();
        }
    }

    function handleRowClick(e) {
        const btn = e.target.closest('.btn-delete');
        if (btn) {
            const row = btn.closest('.row-item');
            row.remove();
            updateTotals();
        }
    }

    function updateRowSubtotal(row) {
        const infoCell = row.querySelector('.product-info-cell');
        const qtyInput = row.querySelector('.qty-input');
        const priceSubtotal = row.querySelector('.price-subtotal');
        const price = parseFloat(infoCell.getAttribute('data-price')) || 0;
        const qty = parseInt(qtyInput.value) || 0;

        const subtotal = price * qty;
        priceSubtotal.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    }

    function updateTotals() {
        const rows = rowsContainer.querySelectorAll('.row-item');
        let total = 0;
        let itemCount = 0;

        rows.forEach(row => {
            const infoCell = row.querySelector('.product-info-cell');
            const qtyInput = row.querySelector('.qty-input');
            const price = parseFloat(infoCell.getAttribute('data-price'));

            if (price) {
                const qty = parseInt(qtyInput.value) || 0;
                total += price * qty;
                itemCount += qty;
            }
        });

        totalItemsTop.textContent = itemCount;
        totalItemsBottom.textContent = itemCount;
        subtotalTop.textContent = `$${total.toFixed(2)}`;
        subtotalBottom.textContent = `$${total.toFixed(2)}`;
    }

    function downloadCSV() {
        const rows = rowsContainer.querySelectorAll('.row-item');
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Item Number,Product Title,Qty,Price,Subtotal\n";

        let hasData = false;
        rows.forEach(row => {
            const itemNum = row.querySelector('.item-number-input').value.trim();
            const productTitle = row.querySelector('.product-info-cell').textContent.trim();
            const qty = row.querySelector('.qty-input').value;
            const price = row.querySelector('.product-info-cell').getAttribute('data-price');

            if (price && itemNum) {
                hasData = true;
                const subtotal = parseFloat(price) * parseInt(qty);
                // Simple CSV escaping (replace double quotes with two double quotes)
                const safeTitle = productTitle.replace(/"/g, '""');
                csvContent += `"${itemNum}","${safeTitle}",${qty},${price},${subtotal.toFixed(2)}\n`;
            }
        });

        if (!hasData) {
            alert("No items to download. Please enter valid item numbers.");
            return;
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "quick_order_txley.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // SEE ALL PAGE - CATALOG FILTER
    const catalogSearch = document.getElementById('catalogSearch');
    const catalogList = document.getElementById('catalogList');

    if (catalogSearch && catalogList) {
        catalogSearch.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            const items = catalogList.querySelectorAll('.sidebar-option-item');

            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // SEE ALL PAGE - BANNER SLIDER
    const bannerTrack = document.getElementById('bannerTrack');
    const seeAllBanner = document.querySelector('.see-all-banner-slider');

    if (bannerTrack && seeAllBanner) {
        let currentSlide = 0;
        const totalSlides = bannerTrack.querySelectorAll('.banner-slide').length;

        function nextSeeAllSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            bannerTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        // Auto move every 4 seconds
        setInterval(nextSeeAllSlide, 4000);
    }
});

