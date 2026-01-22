document.addEventListener('DOMContentLoaded', function () {
    const shopSidebar = document.getElementById('shopSidebar');
    const shopSidebarOverlay = document.getElementById('shopSidebarOverlay');
    const closeShopSidebar = document.getElementById('closeShopSidebar');
    const shopAllDesktopBtn = document.getElementById('shopAllDesktopBtn');
    const shopAllMobileBtn = document.getElementById('shopAllMobileBtn');

    // Toggle Logic
    // Toggle Logic
    function openSidebar() {
        shopSidebar.classList.add('active');
        shopSidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Calculate Position for Desktop
        if (window.innerWidth >= 992) {
            const navbar = document.querySelector('.main-navbar');
            const header = document.querySelector('.main-header');

            // Try to get the bottom of the sticky or main nav
            let topPos = 0;
            if (navbar) {
                const rect = navbar.getBoundingClientRect();
                // If navbar is in view or fixed
                topPos = rect.bottom;
            }
            // Ensure positive
            if (topPos < 0) topPos = 0;

            shopSidebar.style.top = topPos + 'px';
            shopSidebar.style.height = `calc(100vh - ${topPos}px)`;
        } else {
            // Mobile reset
            shopSidebar.style.top = '0';
            shopSidebar.style.height = '100vh';
        }
    }

    function closeSidebar() {
        shopSidebar.classList.remove('active');
        shopSidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Reset mobile views
        document.querySelectorAll('.shop-sidebar-subs-panel.active').forEach(panel => {
            panel.classList.remove('active');
        });
    }

    if (shopAllDesktopBtn) shopAllDesktopBtn.addEventListener('click', openSidebar);
    if (shopAllMobileBtn) shopAllMobileBtn.addEventListener('click', openSidebar);
    if (closeShopSidebar) closeShopSidebar.addEventListener('click', closeSidebar);
    if (shopSidebarOverlay) shopSidebarOverlay.addEventListener('click', closeSidebar);



    // Populate Sidebar
    const navMenu = document.getElementById('navMenu');
    const sidebarParents = document.getElementById('shopSidebarParents');
    const sidebarSubs = document.getElementById('shopSidebarSubs');

    // Featured Images Pool
    const featuredImages = [
        'products/product1.avif',
        'products/product2.jpg',
        'products/product3.png',
        'products/product4.png',
        'products/product5.png',
        'products/product6.png',
        'products/product7.png'
    ];

    if (navMenu && sidebarParents && sidebarSubs) {
        // Clear previous content
        sidebarParents.innerHTML = '';
        sidebarSubs.innerHTML = '';

        // --- 1. Top Featured Section (Above Parent List) ---
        const topFeaturedDiv = document.createElement('div');
        topFeaturedDiv.className = 'sidebar-featured-top';

        const topFeatNames = ["New Arrivals", "Best Sellers", "On Sale", "Trending"];
        topFeatNames.forEach((name, i) => {
            const imgPath = featuredImages[i % featuredImages.length];
            const item = document.createElement('a');
            item.href = '#';
            item.className = 'sidebar-featured-item';
            item.innerHTML = `
                <div class="sidebar-feat-img-wrapper">
                    <img src="${imgPath}" class="sidebar-feat-img" alt="${name}">
                </div>
                <span class="sidebar-feat-text">${name}</span>
            `;
            topFeaturedDiv.appendChild(item);
        });
        sidebarParents.appendChild(topFeaturedDiv);


        // --- 2. Parent Items & Sub Menus ---
        const navItems = navMenu.querySelectorAll(':scope > .nav-item');

        navItems.forEach((item, index) => {
            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown-menu-custom');

            if (!link) return;

            const categoryName = link.childNodes[0].textContent.trim();
            const parentId = `sidebar-parent-${index}`;
            const subId = `sidebar-sub-${index}`;
            const parentImgPath = featuredImages[index % featuredImages.length];

            // Create Parent Item
            const parentEl = document.createElement('div');
            parentEl.className = 'shop-parent-item';
            parentEl.dataset.target = subId;
            parentEl.innerHTML = `
                <div class="parent-item-content">
                    <img src="${parentImgPath}" class="parent-item-img" alt="">
                    <span>${categoryName}</span>
                </div>
                <i class="fa-solid fa-chevron-right"></i>
            `;

            sidebarParents.appendChild(parentEl);

            // Create Sub Content
            const subPanel = document.createElement('div');
            subPanel.id = subId;
            subPanel.className = 'shop-sidebar-subs-panel custom-scrollbar';

            // Mobile Back Button
            const backBtn = document.createElement('div');
            backBtn.className = 'mobile-sub-header d-lg-none';
            backBtn.innerHTML = `<i class="fa-solid fa-chevron-left"></i> ${categoryName}`;
            backBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                subPanel.classList.remove('active');
            });
            subPanel.appendChild(backBtn);

            // Desktop Header (Title of current category)
            const desktopTitle = document.createElement('h4');
            desktopTitle.className = 'd-none d-lg-block mb-3 pb-2 border-bottom';
            desktopTitle.textContent = categoryName;
            subPanel.appendChild(desktopTitle);

            // Featured Categories (Fake Data)
            const featuredTitle = document.createElement('h5');
            featuredTitle.className = 'mb-3 mt-3 fw-bold';
            featuredTitle.textContent = 'Featured Categories';
            subPanel.appendChild(featuredTitle);

            const featureGrid = document.createElement('div');
            featureGrid.className = 'feature-cats-grid';

            const featureNames = ["Tools & Machining", "Shipping Supplies", "Safety", "Plumbing"];

            featureNames.forEach((featName, i) => {
                const imgIndex = (index + i + 2) % featuredImages.length;
                const featItem = document.createElement('a');
                featItem.href = '#';
                featItem.className = 'feature-cat-item';
                featItem.innerHTML = `
                    <div class="feature-cat-img-wrapper">
                        <img src="${featuredImages[imgIndex]}" class="feature-cat-img" alt="${featName}">
                    </div>
                    <span class="feature-cat-title">${featName}</span>
                `;
                featureGrid.appendChild(featItem);
            });
            subPanel.appendChild(featureGrid);

            // Copy Subcategories from Navbar
            if (dropdown) {
                const mainTitle = document.createElement('h5');
                mainTitle.className = 'mb-3 mt-4 fw-bold';
                mainTitle.textContent = 'Shop Categories';
                subPanel.appendChild(mainTitle);

                // Iterate nested items
                const listItems = dropdown.querySelectorAll('.dropdown-list > li');

                const subCatContainer = document.createElement('div');
                subCatContainer.className = 'sub-cat-container';

                listItems.forEach(li => {
                    const anchor = li.querySelector('a');
                    const nestedDiv = li.querySelector('.nested-dropdown');

                    if (anchor) {
                        const groupDiv = document.createElement('div');
                        groupDiv.className = 'sub-cat-group';

                        // Title
                        const title = document.createElement('div');
                        title.className = 'sub-cat-title';
                        title.innerHTML = `<a href="${anchor.href}" style="color:inherit; text-decoration:none;">${anchor.textContent.replace('View All', '').trim()}</a>`;
                        groupDiv.appendChild(title);

                        // List
                        if (nestedDiv) {
                            const subUl = document.createElement('ul');
                            subUl.className = 'sub-cat-list';
                            const nestedLinks = nestedDiv.querySelectorAll('li a');
                            nestedLinks.forEach(nLink => {
                                const subLi = document.createElement('li');
                                const sl = document.createElement('a');
                                sl.className = 'sub-cat-link';
                                sl.href = nLink.href;
                                sl.textContent = nLink.textContent;
                                subLi.appendChild(sl);
                                subUl.appendChild(subLi);
                            });
                            groupDiv.appendChild(subUl);
                        }
                        subCatContainer.appendChild(groupDiv);
                    }
                });
                subPanel.appendChild(subCatContainer);
            }

            sidebarSubs.appendChild(subPanel);

            // Events
            // Desktop Hover
            parentEl.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 992) {
                    // Deactivate all
                    document.querySelectorAll('.shop-parent-item').forEach(el => el.classList.remove('active'));
                    document.querySelectorAll('.shop-sidebar-subs-panel').forEach(el => el.classList.remove('active'));

                    // Activate this
                    parentEl.classList.add('active');
                    subPanel.classList.add('active');
                }
            });

            // Mobile Click
            parentEl.addEventListener('click', (e) => {
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    subPanel.classList.add('active');
                }
            });
        });

        // Initial Active State (Desktop) - Activate first one by default if desktop?
        // Or wait for hover? Usually wait for hover.

        // Desktop: Close sub-menu when mouse leaves the sidebar area
        const shopSidebarV = document.getElementById('shopSidebar'); // Re-select to be safe or use existing var
        if (shopSidebarV) {
            shopSidebarV.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 992) {
                    document.querySelectorAll('.shop-parent-item').forEach(el => el.classList.remove('active'));
                    document.querySelectorAll('.shop-sidebar-subs-panel').forEach(el => el.classList.remove('active'));
                }
            });
        }
    }
});
