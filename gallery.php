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
                    <li><a href="about.html" class="nav-link">ABOUT</a></li>
                    <li><a href="history.html" class="nav-link">HISTORY</a></li>
                    <li><a href="gallery.php" class="nav-link active">GALLERY</a></li>
                    <li><a href="contact.html" class="nav-link">CONTACT</a></li>
                </ul>
                <a href="get-licensed.html" class="license-button">GET LICENSED</a>
            </nav>
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js"></script>

</body>
</html>
