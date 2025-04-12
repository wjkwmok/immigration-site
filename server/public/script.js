document.addEventListener('DOMContentLoaded', function() {
    const hamburgerButton = document.getElementById('hamburgerButton');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburgerButton && navLinks) {
        hamburgerButton.addEventListener('click', function() {
            hamburgerButton.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // 关闭菜单当点击链接时
    const mobileNavLinks = document.querySelectorAll('#navLinks a');
    if (mobileNavLinks.length > 0) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerButton.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});