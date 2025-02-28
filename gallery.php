<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallery - The Renfrew County Amateur Radio Club</title>
    <link rel="stylesheet" href="globals.css">
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
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
            <p class="welcome-text">Browse through our collection of club activities, events, and projects.</p>
            
            <div class="gallery-container">
                <?php
               $images = glob("img/gallery/*.{jpg,png,gif,jpeg}", GLOB_BRACE);
                foreach ($images as $img) {
                    echo "<div class='gallery-item'><img src='$img' loading='lazy' alt='Gallery Image'></div>";
                }
                ?>
            </div>
        </div>
    </main>

    <script>
        document.querySelectorAll(".gallery-item img").forEach(img => {
            img.addEventListener("click", () => {
                document.getElementById("lightbox-img").src = img.src;
                document.getElementById("lightbox").style.display = "flex";
            });
        });

        document.getElementById("lightbox").addEventListener("click", () => {
            document.getElementById("lightbox").style.display = "none";
        });
    </script>

    <!-- Lightbox for enlarged image -->
    <div class="lightbox" id="lightbox">
        <img id="lightbox-img">
    </div>

</body>
</html>
