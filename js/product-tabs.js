document.addEventListener('DOMContentLoaded', function () {
    // Handle Read More buttons
    const readMoreBtns = document.querySelectorAll('.read-more-btn');

    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const container = this.previousElementSibling; // The .mobile-collapse-container

            if (container) {
                // Toggle collapsed classes
                container.classList.toggle('description-collapsed');
                container.classList.toggle('properties-collapsed');

                // Update button text
                if (this.innerText === 'Read More') {
                    this.innerText = 'Read Less';
                } else {
                    this.innerText = 'Read More';
                }
            }
        });
    });
});
