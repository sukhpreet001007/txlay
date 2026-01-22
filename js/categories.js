document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('categoriesGrid');
    const prevBtn = document.getElementById('catPrevBtn');
    const nextBtn = document.getElementById('catNextBtn');

    if (!grid || !prevBtn || !nextBtn) return;

    nextBtn.addEventListener('click', () => {
        const card = grid.querySelector('.category-card');
        // Get generic gap (approx 15px)
        const gap = 15;
        const scrollAmount = card ? (card.offsetWidth + gap) : 300;
        grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        const card = grid.querySelector('.category-card');
        const gap = 15;
        const scrollAmount = card ? (card.offsetWidth + gap) : 300;
        grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
});
