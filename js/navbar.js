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
        sidebarOverlay.addEventListener('click', closeSidebar);
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

    // --- Navbar Scroll Logic ---
    const navMenu = document.getElementById('navMenu');
    const scrollLeftBtn = document.getElementById('navScrollLeft');
    const scrollRightBtn = document.getElementById('navScrollRight');
    const mainNavbar = document.querySelector('.main-navbar');

    function updateScrollButtons() {
        if (!navMenu) return;

        const isScrollable = navMenu.scrollWidth > navMenu.clientWidth;

        if (isScrollable) {
            // Show/hide left button
            if (navMenu.scrollLeft > 20) {
                scrollLeftBtn.classList.add('visible');
            } else {
                scrollLeftBtn.classList.remove('visible');
            }

            // Show/hide right button
            if (navMenu.scrollLeft + navMenu.clientWidth < navMenu.scrollWidth - 20) {
                scrollRightBtn.classList.add('visible');
            } else {
                scrollRightBtn.classList.remove('visible');
            }
        } else {
            scrollLeftBtn.classList.remove('visible');
            scrollRightBtn.classList.remove('visible');
        }
    }

    if (navMenu && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            navMenu.scrollBy({ left: -300, behavior: 'smooth' });
        });

        scrollRightBtn.addEventListener('click', () => {
            navMenu.scrollBy({ left: 300, behavior: 'smooth' });
        });

        navMenu.addEventListener('scroll', updateScrollButtons);
        window.addEventListener('resize', updateScrollButtons);

        // Initial check
        setTimeout(updateScrollButtons, 500);
    }

    // Fix for Dropdowns being clipped by overflow-x: auto
    if (mainNavbar) {
        const navItems = document.querySelectorAll('.nav-item.has-dropdown');
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                navMenu.style.overflow = 'visible';
            });
            item.addEventListener('mouseleave', () => {
                navMenu.style.overflowX = 'auto';
            });
        });
    }

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
