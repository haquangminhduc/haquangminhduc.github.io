// common.js
document.addEventListener('DOMContentLoaded', function() {
    // Active state cho bottom nav dựa trên trang hiện tại
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.bottom-nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
        
        // Xử lý click
        item.addEventListener('click', function(e) {
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            // Nếu là link đến trang khác, browser sẽ tự xử lý
        });
    });
});