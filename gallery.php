<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallery - The Renfrew County Amateur Radio Club</title>
    <link rel="stylesheet" href="globals.css">
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-QRZJ62CCZR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-QRZJ62CCZR');
</script>
</head>
<body>
    <header>
        <div class="header-container">
            <a href="/" class="logo">
                <img src="img/rcarclogo.svg" alt="RCARC Logo" class="logo-image">
            </a>
            
            <nav class="main-nav">
                <ul class="nav-list">
                    <li><a href="index.html" class="nav-link">HOME</a></li>
                    <li class="nav-dropdown">
                        <a href="about.html" class="nav-link">ABOUT</a>
                        <ul class="dropdown-menu">
                            <li><a href="about.html">About RCARC</a></li>
                            <li><a href="get-started.html">Getting Started</a></li>
                        </ul>
                    </li>
                    <li><a href="history.html" class="nav-link">HISTORY</a></li>
                    <li><a href="events.html" class="nav-link">EVENTS</a></li>
                    <li><a href="gallery.php" class="nav-link active">GALLERY</a></li>
                    <li><a href="contact.html" class="nav-link">CONTACT</a></li>
                </ul>
                <a href="get-licensed.html" class="license-button">GET LICENSED</a>
                   <!-- mobile text "Menu" -->
<div id="hamburger-menu" class="hamburger-menu">
    <span class="menu-text">Menu</span>
</div>
            </nav>
        </div>
        <div class="membership-banner" role="status" aria-live="polite">
            <p>New membership fees starting January 1, 2026 &ndash; $35 for Individual, $50 for a family.</p>
        </div>
    </header>

    <main>
        <div class="content-wrapper">
            <h1>Club Gallery</h1>
            <p class="welcome-text">Events and photos from throughout the club's history.</p>
            
            <div class="gallery-container">
            <div class="gallery">
                <?php
                $images = glob("img/gallery/*.{jpg,png,gif,jpeg}", GLOB_BRACE);
                foreach ($images as $image) {
                 echo '<a href="'.$image.'" data-lightbox="gallery"><img src="'.$image.'" class="gallery-image"></a>';
                }
                ?>
            </div>
            </div>
            
        </div>
        
    </main>
    <footer>
            <div class="footer-content">
                <p>&copy; 2025 Renfrew County Amateur Radio Club. All rights reserved.</p>
                <p class="egg"><a href="morse.html">-.-. .--</a></p>
                
            </div>
        </footer>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const hamburger = document.getElementById('hamburger-menu');
            const navList = document.querySelector('.nav-list');
            
            // Check if we're on mobile
            function isMobile() {
                return window.innerWidth <= 768;
            }
            
            // Setup mobile menu
            function setupMobileMenu() {
                // Clean up any existing mobile-specific elements
                const existingMobileItems = document.querySelectorAll('.mobile-only');
                existingMobileItems.forEach(item => item.remove());
                
                // Add "Get Started" as a separate menu item in mobile view
                if (isMobile()) {
                    // Create a new list item for Get Started
                    const getStartedItem = document.createElement('li');
                    getStartedItem.className = 'mobile-only';
                    getStartedItem.innerHTML = '<a href="get-started.html" class="nav-link">GET STARTED</a>';
                    
                    // Create a new list item for Get Licensed 
                    const getLicensedItem = document.createElement('li');
                    getLicensedItem.className = 'mobile-only';
                    getLicensedItem.innerHTML = '<a href="get-licensed.html" class="nav-link">GET LICENSED</a>';
                    
                    // Insert after the ABOUT item
                    const aboutItem = document.querySelector('.nav-dropdown');
                    if (aboutItem && aboutItem.nextSibling) {
                        navList.insertBefore(getStartedItem, aboutItem.nextSibling);
                        navList.appendChild(getLicensedItem);
                    }
                }
            }
            
            // Toggle mobile menu
            hamburger.addEventListener('click', function() {
                navList.classList.toggle('show');
                setupMobileMenu();
            });
            
            // Handle window resize
            window.addEventListener('resize', function() {
                if (!isMobile()) {
                    navList.classList.remove('show');
                }
            });
            
            // Initial setup
            setupMobileMenu();
        });
    </script>
</body>
</html>
