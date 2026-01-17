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

    function openSidebar() {
        mobileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeSidebar() {
        mobileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
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
            closeAccountDropdownFunc();
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

    // --- Sidebar Accordion Logic ---
    const sidebarLinks = document.querySelectorAll('.sidebar-link.has-submenu');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Toggle current submenu
            const submenu = this.nextElementSibling;
            if (submenu) {
                const isOpen = submenu.style.display === 'block';

                // Close other submenus at the same level (optional - creates a true accordion)
                // const parentList = this.closest('ul');
                // const siblingSubmenus = parentList.querySelectorAll(':scope > li > ul');
                // siblingSubmenus.forEach(sub => {
                //     if (sub !== submenu) {
                //         sub.style.display = 'none';
                //         sub.previousElementSibling.classList.remove('open');
                //     }
                // });

                submenu.style.display = isOpen ? 'none' : 'block';
                this.classList.toggle('open', !isOpen);
            }
        });
    });

    // --- Navbar Pagination Logic (Replaces Scroll Logic) ---
    const navMenu = document.getElementById('navMenu');
    const scrollLeftBtn = document.getElementById('navScrollLeft');
    const scrollRightBtn = document.getElementById('navScrollRight');

    // Pagination State
    let currentPage = 0;

    function getItemsPerPage() {
        const width = window.innerWidth;
        if (width > 1680) return 10;
        if (width > 1200) return 6; // Show 6 items (6 + 6 + 3 = 15 total)
        return 10;
    }

    function updatePagination() {
        if (!navMenu) return;

        const itemsPerPage = getItemsPerPage();

        // Select direct list items only
        const navItems = Array.from(navMenu.children).filter(child => child.tagName === 'LI');
        const totalItems = navItems.length;

        // Ensure currentPage doesn't exceed new max page on resize
        const maxPage = Math.max(0, Math.ceil(totalItems / itemsPerPage) - 1);
        if (currentPage > maxPage) {
            currentPage = maxPage;
        }

        // Calculate range for current page
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;

        // Show/Hide Items
        navItems.forEach((item, index) => {
            if (index >= start && index < end) {
                item.style.display = ''; // Reset to default (show)
                item.style.opacity = '1';
                item.style.visibility = 'visible';
            } else {
                item.style.display = 'none';
            }
        });

        // Update Buttons Visibility
        if (scrollLeftBtn) {
            if (currentPage > 0) {
                scrollLeftBtn.classList.add('visible');
            } else {
                scrollLeftBtn.classList.remove('visible');
            }
        }

        if (scrollRightBtn) {
            if (end < totalItems) {
                scrollRightBtn.classList.add('visible');
            } else {
                scrollRightBtn.classList.remove('visible');
            }
        }
    }

    if (navMenu && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updatePagination();
            }
        });

        scrollRightBtn.addEventListener('click', () => {
            const itemsPerPage = getItemsPerPage();
            const navItems = Array.from(navMenu.children).filter(child => child.tagName === 'LI');
            const totalItems = navItems.length;
            if ((currentPage + 1) * itemsPerPage < totalItems) {
                currentPage++;
                updatePagination();
            }
        });

        // Initial check
        updatePagination();

        // Re-check on resize (maintain logic even if viewport changes)
        window.addEventListener('resize', updatePagination);
    }

    // Fix for Dropdowns being clipped (Removed as CSS now handles this permanently)
    // Legacy code removed to prevent conflict with 'overflow: visible' CSS.

    // Overflow Fix for Nested Dropdowns
    const nestedItems = document.querySelectorAll('.dropdown-item.has-nested, .dropdown-item.has-deep-nested');

    nestedItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            const submenu = this.querySelector('.nested-dropdown, .deep-nested-dropdown');
            if (submenu) {
                // Temporarily show to calculate width (if invisible) or just trust rect if transition allows
                // Since opacity is 0, layout is typically present if display is not none.
                // Our CSS uses visibility: hidden, but layout should be there. 
                // However, transform might affect rect.

                const rect = submenu.getBoundingClientRect();
                const viewportWidth = window.innerWidth;

                // Check if right edge exceeds viewport width
                if (rect.right > viewportWidth) {
                    submenu.classList.add('open-left');
                } else {
                    submenu.classList.remove('open-left');
                }
            }
        });
    });
});
