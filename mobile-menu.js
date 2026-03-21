document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-menu');
    const navList = document.querySelector('.nav-list');

    if (!hamburger || !navList) return;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function setupMobileMenu() {
        document.querySelectorAll('.mobile-only').forEach(item => item.remove());

        if (isMobile()) {
            const getStartedItem = document.createElement('li');
            getStartedItem.className = 'mobile-only';
            getStartedItem.innerHTML = '<a href="get-started.html" class="nav-link">GET STARTED</a>';

            const getLicensedItem = document.createElement('li');
            getLicensedItem.className = 'mobile-only';
            getLicensedItem.innerHTML = '<a href="get-licensed.html" class="nav-link">GET LICENSED</a>';

            const aboutItem = document.querySelector('.nav-dropdown');
            if (aboutItem && aboutItem.nextSibling) {
                navList.insertBefore(getStartedItem, aboutItem.nextSibling);
                navList.appendChild(getLicensedItem);
            }
        }
    }

    hamburger.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!isExpanded));
        navList.classList.toggle('show');
        setupMobileMenu();
    });

    window.addEventListener('resize', function() {
        if (!isMobile()) {
            navList.classList.remove('show');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    setupMobileMenu();
});
