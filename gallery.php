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
    <meta name="description" content="Photo gallery from Renfrew County Amateur Radio Club events and field days.">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Gallery – Renfrew County Amateur Radio Club">
    <meta property="og:description" content="Photo gallery from Renfrew County Amateur Radio Club events and field days.">
    <meta property="og:url" content="https://rcarc.ca/gallery.php">
    <meta property="og:image" content="https://rcarc.ca/img/rcarclogo.svg">
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header role="banner">
        <div class="header-container">
            <a href="/" class="logo" aria-label="Home">
                <img src="img/rcarclogo.svg" alt="RCARC Logo" class="logo-image">
            </a>
            
            <nav class="main-nav" role="navigation" aria-label="Main navigation">
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
<button id="hamburger-menu" class="hamburger-menu" aria-label="Toggle menu" aria-expanded="false">
    <span class="menu-text">Menu</span>
</button>
            </nav>
        </div>
        <div class="membership-banner" role="status" aria-live="polite">
            <p>New membership fees starting January 1, 2026 &ndash; $35 for Individual, $50 for a family.</p>
        </div>
    </header>

    <main role="main" id="main-content">
        <div class="content-wrapper">
            <h1>Club Gallery</h1>
            <p class="welcome-text">Events and photos from throughout the club's history.</p>
            
            <div class="gallery-container">
            <div class="gallery">
                <?php
                $images = glob("img/gallery/*.{jpg,png,gif,jpeg}", GLOB_BRACE);
                foreach ($images as $image) {
                    $alt = htmlspecialchars(ucwords(str_replace(['-', '_'], ' ', pathinfo($image, PATHINFO_FILENAME))));
                    echo '<a href="' . htmlspecialchars($image) . '" data-lightbox="gallery"><img src="' . htmlspecialchars($image) . '" alt="' . $alt . '" class="gallery-image"></a>';
                }
                ?>
            </div>
            </div>
            
        </div>
        
    </main>
    <footer role="contentinfo">
            <div class="footer-content">
                <p>&copy; <script>document.write(new Date().getFullYear())</script> Renfrew County Amateur Radio Club. All rights reserved.</p>
                <p class="egg"><a href="morse.html">-.-. .--</a></p>
                
            </div>
        </footer>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js"></script>
    <script src="mobile-menu.js"></script>
</body>
</html>
