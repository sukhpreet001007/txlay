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

    // --- Navbar "More" Button Logic ---
    const navMenu = document.getElementById('navMenu');

    function handleNavbarOverflow() {
        if (!navMenu || window.innerWidth <= 1200) return;

        // Reset: Move all items back to main menu first
        const moreBtn = document.getElementById('moreNavBtn');
        const moreRow = document.getElementById('moreNavRow');

        if (moreBtn) moreBtn.remove();
        if (moreRow) {
            const itemsToMove = Array.from(moreRow.querySelectorAll('.nav-item'));
            itemsToMove.forEach(item => {
                navMenu.appendChild(item);
            });
            moreRow.remove();
        }

        const items = Array.from(navMenu.children).filter(child => child.tagName === 'LI');
        const containerWidth = navMenu.parentElement.offsetWidth;
        let currentWidth = 0;
        const moreBtnWidth = 120;
        let overflowIndex = -1;

        // Find overflow point
        items.forEach((item, index) => {
            const itemWidth = item.getBoundingClientRect().width;
            if (currentWidth + itemWidth > containerWidth - moreBtnWidth && overflowIndex === -1) {
                overflowIndex = index;
            }
            currentWidth += itemWidth;
        });

        // Handle Overflow
        if (overflowIndex !== -1) {
            // Create More Button
            const moreButton = document.createElement('button');
            moreButton.id = 'moreNavBtn';
            moreButton.className = 'more-nav-btn';
            moreButton.innerHTML = 'More <i class="fa-solid fa-chevron-down"></i>';

            // Create More Row
            const moreRowContainer = document.createElement('div');
            moreRowContainer.id = 'moreNavRow';
            moreRowContainer.className = 'more-nav-row';
            moreRowContainer.innerHTML = '<ul class="nav-menu more-nav-list"></ul>';

            const moreList = moreRowContainer.querySelector('.more-nav-list');
            items.slice(overflowIndex).forEach(item => {
                moreList.appendChild(item);
            });

            // Add click handler
            moreButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = moreRowContainer.classList.toggle('active');
                moreButton.querySelector('i').style.transform = isActive ? 'rotate(180deg)' : '';

                // Calculate absolute position (including scroll)
                const navbarRect = navMenu.parentElement.parentElement.getBoundingClientRect();
                const absoluteTop = navbarRect.bottom + window.scrollY;
                moreRowContainer.style.setProperty('--navbar-top', `${absoluteTop}px`);
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!moreRowContainer.contains(e.target) && !moreButton.contains(e.target)) {
                    moreRowContainer.classList.remove('active');
                    moreButton.querySelector('i').style.transform = '';
                }
            });

            navMenu.parentElement.appendChild(moreButton);
            document.body.appendChild(moreRowContainer);
        }
    }

    // Initial and resize handlers
    window.addEventListener('load', handleNavbarOverflow);
    window.addEventListener('resize', handleNavbarOverflow);
    setTimeout(handleNavbarOverflow, 100);
    setTimeout(handleNavbarOverflow, 500);

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
