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

                submenu.style.display = isOpen ? 'none' : 'block';
                this.classList.toggle('open', !isOpen);
            }
        });
    });

    // --- Desktop Paginated Navbar Logic ---
    const navMenu = document.getElementById('navMenu');
    const navPrevBtn = document.getElementById('navPrevBtn');
    const navNextBtn = document.getElementById('navNextBtn');

    if (navMenu && navPrevBtn && navNextBtn) {
        const navItems = Array.from(navMenu.querySelectorAll(':scope > .nav-item'));
        const itemsPerPage = 6;
        let currentPage = 0;
        const totalPages = Math.ceil(navItems.length / itemsPerPage);

        function updateNavbar() {
            if (window.innerWidth <= 1200) {
                // On mobile, show all for the horizontal scroll if needed, 
                // but usually the sidebar handles it.
                // However, we added arrow buttons in index.html, so we hide them.
                navPrevBtn.style.display = 'none';
                navNextBtn.style.display = 'none';
                navItems.forEach(item => item.style.display = '');
                return;
            }

            navPrevBtn.style.display = 'flex';
            navNextBtn.style.display = 'flex';

            const start = currentPage * itemsPerPage;
            const end = start + itemsPerPage;

            navItems.forEach((item, index) => {
                if (index >= start && index < end) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Update arrow states
            navPrevBtn.disabled = currentPage === 0;
            navNextBtn.disabled = currentPage === totalPages - 1;

            // Optional: Hide arrows if they aren't needed
            navPrevBtn.style.visibility = currentPage === 0 ? 'hidden' : 'visible';
            navNextBtn.style.visibility = currentPage === totalPages - 1 ? 'hidden' : 'visible';
        }

        navNextBtn.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                updateNavbar();
            }
        });

        navPrevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updateNavbar();
            }
        });

        // Initialize and handle resize
        window.addEventListener('resize', updateNavbar);
        updateNavbar();
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
