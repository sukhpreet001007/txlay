document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('dynamicSearch');
    const words = [
        "Janitorial Supplies",
        "Industrial Safety",
        "Paper Products",
        "Cleaning Chemicals",
        "Office Supplies",
        "Facility Equipment",
        "Gloves",
        "Disinfectants"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentWord = '';
    let baseText = "Search for ";
    let typeSpeed = 100;
    let pauseEnd = 2000;

    // Typewriter effect logic
    function type() {
        const fullWord = words[wordIndex];

        if (isDeleting) {
            // Remove characters
            currentWord = fullWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster deleting
        } else {
            // Add characters
            currentWord = fullWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing
        }

        searchInput.setAttribute('placeholder', baseText + currentWord);

        if (!isDeleting && charIndex === fullWord.length) {
            // Finished typing word, pause before deleting
            isDeleting = true;
            typeSpeed = pauseEnd;
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, move to next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 200; // Pause before typing new word
        }

        setTimeout(type, typeSpeed);
    }

    // Start the typing loop
    if (searchInput) {
        type();
    }

    // --- Mobile Sidebar Logic ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebarMainContainer = document.getElementById('sidebarMainContainer');

    function openSidebar() {
        if (mobileSidebar) mobileSidebar.classList.add('active');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeSidebar() {
        if (mobileSidebar) mobileSidebar.classList.remove('active');
        // Only remove overlay if mobile account dropdown is NOT active
        const mobileAccountDropdown = document.getElementById('mobileAccountDropdown');
        if (sidebarOverlay && (!mobileAccountDropdown || !mobileAccountDropdown.classList.contains('active'))) {
            sidebarOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';

        // Reset panels
        if (sidebarMainContainer) sidebarMainContainer.classList.remove('slide-out');
        document.querySelectorAll('.sidebar-submenu-panel.active').forEach(panel => {
            panel.classList.remove('active');
        });
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openSidebar);
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            closeSidebar();
            if (typeof closeAccountDropdownFunc === 'function') {
                closeAccountDropdownFunc();
            }
        });
    }

    // --- Mobile Account Dropdown Logic ---
    const mobileAccountBtn = document.getElementById('mobileAccountBtn');
    const mobileAccountDropdown = document.getElementById('mobileAccountDropdown');
    const closeAccountDropdown = document.getElementById('closeAccountDropdown');

    function openAccountDropdown() {
        mobileAccountDropdown.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeAccountDropdownFunc() {
        if (mobileAccountDropdown) {
            mobileAccountDropdown.classList.remove('active');
        }
        if (!mobileSidebar.classList.contains('active')) {
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (mobileAccountBtn) {
        mobileAccountBtn.addEventListener('click', openAccountDropdown);
    }

    if (closeAccountDropdown) {
        closeAccountDropdown.addEventListener('click', closeAccountDropdownFunc);
    }

    // --- Dynamic Mobile Sidebar Population ---
    const navMenu = document.getElementById('navMenu');
    const mobileSidebarMenu = document.getElementById('mobileSidebarMenu');
    const sidebarPanelsContainer = document.getElementById('sidebarPanelsContainer');

    function populateMobileSidebar() {
        if (!navMenu || !mobileSidebarMenu || !sidebarPanelsContainer) return;

        // Clear existing
        mobileSidebarMenu.innerHTML = '';
        sidebarPanelsContainer.innerHTML = '';

        const navItems = navMenu.querySelectorAll(':scope > .nav-item');

        navItems.forEach((item, catIndex) => {
            const link = item.querySelector('.nav-link');
            if (!link) return;

            const catName = link.textContent.trim();
            const megaMenu = item.querySelector('.mega-menu-custom');
            const dropdown = item.querySelector('.dropdown-menu-custom');

            // 1. Add to Main Menu (Level 0)
            const li = document.createElement('li');
            li.className = 'sidebar-item';

            const hasSub = megaMenu || dropdown;
            const catPanelId = `ms-panel-cat-${catIndex}`;

            li.innerHTML = `
                <div class="sidebar-link-wrapper">
                    <a href="${link.href}" class="sidebar-link">${catName}</a>
                    ${hasSub ? `<span class="sidebar-arrow" data-target="${catPanelId}"><i class="fa-solid fa-chevron-right"></i></span>` : ''}
                </div>
            `;
            mobileSidebarMenu.appendChild(li);

            if (!hasSub) return;

            // 2. Create Category Panel (Level 1)
            const catPanel = document.createElement('div');
            catPanel.id = catPanelId;
            catPanel.className = 'sidebar-submenu-panel';
            catPanel.innerHTML = `
                <div class="sidebar-back-btn" data-level="1"><i class="fa-solid fa-chevron-left"></i> Back</div>
                <div class="sidebar-submenu-title">${catName}</div>
                <ul class="sidebar-submenu-list" id="${catPanelId}-list"></ul>
            `;
            sidebarPanelsContainer.appendChild(catPanel);

            const catList = catPanel.querySelector('.sidebar-submenu-list');

            if (megaMenu) {
                const groups = megaMenu.querySelectorAll('.mega-group');
                groups.forEach((group, groupIndex) => {
                    const groupTitle = group.querySelector('.mega-group-title');
                    const groupLinks = group.querySelectorAll('.mega-links-list li a');
                    if (!groupTitle) return;

                    const groupName = groupTitle.textContent.trim();
                    const groupPanelId = `ms-panel-group-${catIndex}-${groupIndex}`;

                    const groupLi = document.createElement('li');
                    groupLi.innerHTML = `
                        <div class="sidebar-link-wrapper">
                            <a href="#" class="sidebar-link">${groupName}</a>
                            <span class="sidebar-arrow" data-target="${groupPanelId}"><i class="fa-solid fa-chevron-right"></i></span>
                        </div>
                    `;
                    catList.appendChild(groupLi);

                    // 3. Create Group Panel (Level 2)
                    const groupPanel = document.createElement('div');
                    groupPanel.id = groupPanelId;
                    groupPanel.className = 'sidebar-submenu-panel';
                    groupPanel.innerHTML = `
                        <div class="sidebar-back-btn" data-level="2"><i class="fa-solid fa-chevron-left"></i> Back</div>
                        <div class="sidebar-submenu-title">${groupName}</div>
                        <ul class="sidebar-submenu-list"></ul>
                    `;
                    sidebarPanelsContainer.appendChild(groupPanel);

                    const groupUl = groupPanel.querySelector('.sidebar-submenu-list');
                    groupLinks.forEach(gLink => {
                        const li = document.createElement('li');
                        li.innerHTML = `<a href="${gLink.href}">${gLink.textContent.trim()}</a>`;
                        groupUl.appendChild(li);
                    });
                    // Add See All link at bottom of group
                    const seeAllLi = document.createElement('li');
                    seeAllLi.innerHTML = `<a href="see-all.html" class="fw-bold text-primary">See All ${groupName}</a>`;
                    groupUl.appendChild(seeAllLi);
                });

                // Add "We Recommend" section to Category Panel (Level 1)
                const recommendation = megaMenu.querySelector('.mega-recommendation');
                if (recommendation) {
                    const recHeader = recommendation.querySelector('.recommend-header');
                    const images = recommendation.querySelectorAll('.recommend-img-wrapper img');

                    const recSection = document.createElement('div');
                    recSection.className = 'sidebar-recommend-section';
                    recSection.innerHTML = `
                        <div class="sidebar-recommend-title">${recHeader ? recHeader.textContent.trim() : 'We Recommend'}</div>
                        <div class="sidebar-recommend-grid"></div>
                    `;
                    const grid = recSection.querySelector('.sidebar-recommend-grid');
                    images.forEach(img => {
                        const item = document.createElement('div');
                        item.className = 'sidebar-recommend-item';
                        item.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
                        grid.appendChild(item);
                    });
                    catPanel.appendChild(recSection);
                }

            } else if (dropdown) {
                // Simple dropdown logic for categories like "Clearance" (if any)
                const dLinks = dropdown.querySelectorAll('a');
                dLinks.forEach(dLink => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${dLink.href}">${dLink.textContent.trim()}</a>`;
                    catList.appendChild(li);
                });
            }
        });

        // Initialize event listeners for dynamic elements
        initDynamicEvents();
    }

    function initDynamicEvents() {
        // Re-attach arrow clicks
        document.querySelectorAll('.sidebar-arrow').forEach(arrow => {
            arrow.addEventListener('click', function (e) {
                e.stopPropagation();
                const targetId = this.getAttribute('data-target');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    // Check if we are opening a Level 1 panel from Level 0
                    const isFromMain = this.closest('.sidebar-main-container');
                    if (isFromMain) {
                        sidebarMainContainer.classList.add('slide-out');
                    }
                    targetPanel.classList.add('active');
                }
            });
        });

        // Re-attach back button clicks
        document.querySelectorAll('.sidebar-back-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const panel = this.closest('.sidebar-submenu-panel');
                const level = this.getAttribute('data-level');
                if (panel) {
                    panel.classList.remove('active');
                    // If returning from Level 1 to Level 0
                    if (level === '1') {
                        sidebarMainContainer.classList.remove('slide-out');
                    }
                }
            });
        });
    }

    // Call population
    populateMobileSidebar();

    // --- Desktop Mega Menu Overlay Logic ---
    const navItems = document.querySelectorAll('.nav-item');

    if (navItems.length > 0 && sidebarOverlay) {
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Only show overlay if there is a menu to show
                const hasMenu = item.querySelector('.mega-menu-custom, .dropdown-menu-custom');
                if (hasMenu) {
                    sidebarOverlay.classList.add('active');
                    // We don't hide body scroll for desktop hover to keep it smooth
                }
            });

            item.addEventListener('mouseleave', () => {
                // Hide overlay when leaving the nav item
                // But check if we're not just moving to another nav item (handled by next enter)
                sidebarOverlay.classList.remove('active');
            });
        });
    }

    // Function to handle long dropdowns (20+ items)
    function applyDropdownScrolling() {
        const dropdowns = document.querySelectorAll('.nested-dropdown, .deep-nested-dropdown');
        dropdowns.forEach(dropdown => {
            const list = dropdown.querySelector('ul');
            if (list) {
                const items = list.querySelectorAll(':scope > li');
                if (items.length >= 20) {
                    dropdown.classList.add('scrollable-dropdown');
                } else {
                    dropdown.classList.remove('scrollable-dropdown');
                }
            }
        });
    }

    // Apply on load
    applyDropdownScrolling();

    // Overflow Fix for Nested Dropdowns
    const navbarContainer = document.querySelector('.main-navbar');
    if (navbarContainer) {
        navbarContainer.addEventListener('mouseenter', function (e) {
            const item = e.target.closest('.dropdown-item.has-nested, .dropdown-item.has-deep-nested');
            if (!item) return;

            const submenu = item.querySelector('.nested-dropdown, .deep-nested-dropdown');
            if (submenu) {
                const rect = submenu.getBoundingClientRect();
                const viewportWidth = window.innerWidth;

                if (rect.right > viewportWidth) {
                    submenu.classList.add('open-left');
                } else {
                    submenu.classList.remove('open-left');
                }
            }
        }, true);
    }
});
