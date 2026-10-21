const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-menu");


// Mobile navigation
menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("active");

});


// Close menu after clicking a link
const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

    });

});

/* =====================================================
   CHERRY ON TOP
   PIXEL LOGO FORMATION
===================================================== */

const loader = document.getElementById("loader");
const cakeVideo = document.getElementById("cakeVideo");
const canvas = document.getElementById("logoCanvas");

const ctx = canvas.getContext("2d");

let particles = [];
let logoImage = new Image();

let animationStart;
let animationFinished = false;


/* =====================================================
   LOGO IMAGE
===================================================== */

logoImage.src = "assets/logo.png";


/* =====================================================
   CANVAS SIZE
===================================================== */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


/* =====================================================
   GET LOGO PIXELS
===================================================== */

function createLogoParticles() {

    const offCanvas =
        document.createElement("canvas");

    const offCtx =
        offCanvas.getContext("2d");


    /*
       Logo size.

       Change this if you want the logo
       bigger/smaller on the cake.
    */

    const logoWidth =
        Math.min(
            window.innerWidth * 0.42,
            430
        );

    const logoHeight =
        logoWidth *
        (logoImage.height / logoImage.width);


    offCanvas.width = logoWidth;
    offCanvas.height = logoHeight;


    offCtx.clearRect(
        0,
        0,
        logoWidth,
        logoHeight
    );


    offCtx.drawImage(
        logoImage,
        0,
        0,
        logoWidth,
        logoHeight
    );


    const imageData =
        offCtx.getImageData(
            0,
            0,
            logoWidth,
            logoHeight
        );


    const centerX =
        canvas.width / 2;

    /*
       This controls where the logo
       finally appears.

       Adjust Y depending on your cake.
    */

    const centerY =
        canvas.height * 0.48;


    /*
       Pixel spacing.

       Smaller number =
       more detailed logo.

       3 = detailed
       4 = balanced
       5 = fewer particles
    */

    const pixelSize = 4;


    for (
        let y = 0;
        y < logoHeight;
        y += pixelSize
    ) {

        for (
            let x = 0;
            x < logoWidth;
            x += pixelSize
        ) {

            const index =
                (y * logoWidth + x) * 4;

            const alpha =
                imageData.data[index + 3];


            /*
               Only create particles
               where the logo exists.
            */

            if (alpha > 80) {

                const red =
                    imageData.data[index];

                const green =
                    imageData.data[index + 1];

                const blue =
                    imageData.data[index + 2];


                particles.push({

                    /* FINAL POSITION */

                    targetX:
                        centerX -
                        logoWidth / 2 +
                        x,

                    targetY:
                        centerY -
                        logoHeight / 2 +
                        y,


                    /* START POSITION */

                    x:
                        Math.random() *
                        canvas.width,

                    y:
                        Math.random() *
                        canvas.height,


                    /* Particle size */

                    size:
                        Math.random() * 1.8 + 1,


                    /* Animation speed */

                    delay:
                        Math.random() * 1200,


                    speed:
                        Math.random() * 0.025 +
                        0.015,


                    /* Logo color */

                    r: red,
                    g: green,
                    b: blue,


                    opacity: 0

                });

            }

        }

    }

}


/* =====================================================
   DRAW PARTICLES
===================================================== */

function drawParticles(timestamp) {

    if (!animationStart) {
        animationStart = timestamp;
    }

    const elapsed = timestamp - animationStart;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(particle => {

        const particleTime =
            elapsed - particle.delay;

        if (particleTime <= 0) {
            return;
        }

        /*
           Pixel formation
           0 → 1
        */

        let progress =
            particleTime / 2500;

        progress =
            Math.min(progress, 1);

        /*
           Smooth movement
        */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        /*
           Current particle position
        */

        const currentX =
            particle.x +
            (
                particle.targetX -
                particle.x
            ) * eased;

        const currentY =
            particle.y +
            (
                particle.targetY -
                particle.y
            ) * eased;

        /*
           Particle opacity
        */

        let opacity =
            Math.min(
                progress * 2,
                1
            );

        /*
           Fade particles slightly
           when final logo appears
        */

        if (elapsed > 2700) {

            const fade =
                1 -
                Math.min(
                    (elapsed - 2700) / 700,
                    1
                );

            opacity *= fade;
        }

        ctx.fillStyle =
            `rgba(
                ${particle.r},
                ${particle.g},
                ${particle.b},
                ${opacity}
            )`;

        ctx.shadowBlur = 4;

        ctx.shadowColor =
            `rgba(
                ${particle.r},
                ${particle.g},
                ${particle.b},
                ${opacity}
            )`;

        ctx.fillRect(
            currentX,
            currentY,
            particle.size,
            particle.size
        );

    });

    ctx.shadowBlur = 0;


    /*
       ==============================================
       SHOW CLEAR LOGO
       ==============================================
       
       Particles finish around 2.5 sec.
       Clear logo appears around 2.7 sec.
    */

    if (
        elapsed > 2600 &&
        !animationFinished
    ) {

        const finalLogo =
            document.getElementById(
                "finalLogo"
            );

        if (finalLogo) {

            finalLogo.classList.add(
                "show"
            );

        }
    }


    /*
       Keep animation running until
       loader disappears.
    */

    if (elapsed < 5000) {

        requestAnimationFrame(
            drawParticles
        );

    }

}

/* =====================================================
   START LOGO ANIMATION
===================================================== */

logoImage.onload = () => {

    createLogoParticles();

    requestAnimationFrame(
        drawParticles
    );

};


/* =====================================================
   VIDEO
===================================================== */

if (cakeVideo) {

    cakeVideo.muted = true;

    cakeVideo.currentTime = 0;

    cakeVideo.play().catch(() => {

        console.log(
            "Video autoplay waiting for browser."
        );

    });

}


/* =====================================================
   REMOVE LOADER AFTER 5 SECONDS
===================================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        if (
            animationFinished ||
            !loader
        ) {
            return;
        }


        animationFinished = true;


        loader.classList.add(
            "hide"
        );


        setTimeout(() => {

            loader.remove();

        }, 900);


    }, 5000);

});

/* =========================================================
   ABOUT CARD DECK
   Cherry on Top
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const aboutCards = Array.from(
        document.querySelectorAll(".about-card")
    );

    const aboutDots = Array.from(
        document.querySelectorAll(".about-dot")
    );

    /*
       Stop if About section does not exist.
       This also prevents errors from affecting
       the rest of the website.
    */
    if (aboutCards.length === 0) {
        return;
    }


    /* =====================================================
       SETTINGS
    ===================================================== */

    let aboutIndex = 0;

    let aboutTimer = null;

    const ABOUT_DURATION = 7000;


    /* =====================================================
       UPDATE CARD POSITIONS
    ===================================================== */

    function updateAboutStack() {

        const total = aboutCards.length;


        aboutCards.forEach(function (card, index) {

            /*
               Remove previous position classes
            */

            card.classList.remove(
                "card-front",
                "card-left",
                "card-right",
                "card-hidden",
                "card-moving-left",
                "card-moving-right"
            );


            /*
               Calculate position
            */

            const position =
                (index - aboutIndex + total) % total;


            /* ---------------------------------------------
               CURRENT CARD
            --------------------------------------------- */

            if (position === 0) {

                card.classList.add(
                    "card-front"
                );

            }


            /* ---------------------------------------------
               NEXT CARD - RIGHT
            --------------------------------------------- */

            else if (position === 1) {

                card.classList.add(
                    "card-right"
                );

            }


            /* ---------------------------------------------
               PREVIOUS CARD - LEFT
            --------------------------------------------- */

            else if (position === total - 1) {

                card.classList.add(
                    "card-left"
                );

            }


            /* ---------------------------------------------
               OTHER CARD
            --------------------------------------------- */

            else {

                card.classList.add(
                    "card-hidden"
                );

            }

        });


        /* =================================================
           UPDATE DOTS
        ================================================= */

        aboutDots.forEach(function (dot, index) {

            dot.classList.toggle(
                "active",
                index === aboutIndex
            );

        });

    }


    /* =====================================================
       NEXT CARD
    ===================================================== */

    function nextAboutCard() {

        aboutIndex =
            (aboutIndex + 1) %
            aboutCards.length;


        updateAboutStack();


        restartAboutLoop();

    }


    /* =====================================================
       PREVIOUS CARD
    ===================================================== */

    function previousAboutCard() {

        aboutIndex =
            (aboutIndex - 1 + aboutCards.length) %
            aboutCards.length;


        updateAboutStack();


        restartAboutLoop();

    }


    /* =====================================================
       RESTART AUTO LOOP
    ===================================================== */

    function restartAboutLoop() {

        /*
           Clear old timer
        */

        if (aboutTimer !== null) {

            clearTimeout(aboutTimer);

        }


        /*
           Start new timer
        */

        aboutTimer = setTimeout(
            function () {

                nextAboutCard();

            },
            ABOUT_DURATION
        );

    }


    /* =====================================================
       CLICK CARD
    ===================================================== */

    aboutCards.forEach(
        function (card, index) {

            card.addEventListener(
                "click",
                function () {

                    /*
                       If this is already the current card,
                       do nothing.
                    */

                    if (index === aboutIndex) {

                        restartAboutLoop();

                        return;

                    }


                    /*
                       Move clicked card to center
                    */

                    aboutIndex = index;


                    updateAboutStack();


                    restartAboutLoop();

                }
            );

        }
    );


    /* =====================================================
       DOT CLICK
    ===================================================== */

    aboutDots.forEach(
        function (dot, index) {

            dot.addEventListener(
                "click",
                function (event) {

                    /*
                       Prevent event bubbling
                    */

                    event.stopPropagation();


                    /*
                       Move selected card to center
                    */

                    aboutIndex = index;


                    updateAboutStack();


                    restartAboutLoop();

                }
            );

        }
    );


    /* =====================================================
       TOUCH SWIPE
       Optional mobile interaction
    ===================================================== */

    let touchStartX = 0;

    let touchEndX = 0;


    aboutCards.forEach(
        function (card) {

            card.addEventListener(
                "touchstart",
                function (event) {

                    touchStartX =
                        event.changedTouches[0].screenX;

                },
                {
                    passive: true
                }
            );


            card.addEventListener(
                "touchend",
                function (event) {

                    touchEndX =
                        event.changedTouches[0].screenX;


                    handleAboutSwipe();

                },
                {
                    passive: true
                }
            );

        }
    );


    function handleAboutSwipe() {

        const difference =
            touchEndX - touchStartX;


        /*
           Swipe threshold
        */

        if (Math.abs(difference) < 50) {

            return;

        }


        /*
           Swipe left
           -> next card
        */

        if (difference < 0) {

            nextAboutCard();

        }


        /*
           Swipe right
           -> previous card
        */

        else {

            previousAboutCard();

        }

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateAboutStack();

    restartAboutLoop();

});

/* =========================================================
   NAVBAR ACTIVE SECTION
   SAFE VERSION
========================================================= */

(function () {

    const navLinks = document.querySelectorAll(
        ".nav-menu .nav-link"
    );

    if (!navLinks.length) {
        return;
    }

    const sectionIds = [
        "home",
        "about",
        "menu",
        "contact"
    ];

    const sections = sectionIds
        .map(function (id) {
            return document.getElementById(id);
        })
        .filter(function (section) {
            return section !== null;
        });


    function setActiveSection(id) {

        navLinks.forEach(function (link) {

            const linkTarget =
                link.getAttribute("href");

            if (linkTarget === "#" + id) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }

        });

    }


    function checkActiveSection() {

        let currentSection = "home";

        const scrollPosition =
            window.scrollY + 250;


        sections.forEach(function (section) {

            if (
                scrollPosition >=
                section.offsetTop
            ) {

                currentSection =
                    section.id;

            }

        });


        setActiveSection(currentSection);
    }


    window.addEventListener(
        "scroll",
        checkActiveSection,
        {
            passive: true
        }
    );


    checkActiveSection();

})();
/* =====================================================
   CHERRY ON TOP - MENU NAVIGATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ---------------------------------------------
       ELEMENTS
    --------------------------------------------- */

    const menuChoiceGrid =
        document.getElementById("menuChoiceGrid");

    const dailyOrderBtn =
        document.getElementById("dailyOrderBtn");

    const dailyMenuPanel =
        document.getElementById("dailyMenuPanel");

    const backFromDaily =
        document.getElementById("backFromDaily");


    const dessertOrderBtn =
        document.getElementById("dessertOrderBtn");

    const dessertMenuPanel =
        document.getElementById("dessertMenuPanel");

    const backFromDesserts =
        document.getElementById("backFromDesserts");


    const savouryOrderBtn =
        document.getElementById("savouryOrderBtn");

    const savouryMenuPanel =
        document.getElementById("savouryMenuPanel");

    const backFromSavouries =
        document.getElementById("backFromSavouries");


    const dailyCategoryButtons =
        document.querySelectorAll(".daily-category-btn");

    const dailyProductsGrid =
        document.getElementById("dailyProductsGrid");


    /* ---------------------------------------------
       HELPER
    --------------------------------------------- */

    function hideAllMenuPanels() {

        if (dailyMenuPanel) {
            dailyMenuPanel.hidden = true;
        }

        if (dessertMenuPanel) {
            dessertMenuPanel.hidden = true;
        }

        if (savouryMenuPanel) {
            savouryMenuPanel.hidden = true;
        }

        if (menuChoiceGrid) {
            menuChoiceGrid.style.display = "";
        }

    }


    function scrollToMenuPanel(panel) {

        if (!panel) return;

        setTimeout(function () {

            panel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    }


    /* ---------------------------------------------
       DAILY ORDER
    --------------------------------------------- */

    if (dailyOrderBtn) {

        dailyOrderBtn.addEventListener("click", function () {

            if (menuChoiceGrid) {
                menuChoiceGrid.style.display = "none";
            }

            if (dailyMenuPanel) {
                dailyMenuPanel.hidden = false;
            }

            scrollToMenuPanel(dailyMenuPanel);

        });

    }


    /* ---------------------------------------------
       BACK FROM DAILY
    --------------------------------------------- */

    if (backFromDaily) {

        backFromDaily.addEventListener("click", function () {

            hideAllMenuPanels();

            scrollToMenuPanel(menuChoiceGrid);

        });

    }


    /* ---------------------------------------------
       DESSERTS
    --------------------------------------------- */

    if (dessertOrderBtn) {

        dessertOrderBtn.addEventListener("click", function () {

            if (menuChoiceGrid) {
                menuChoiceGrid.style.display = "none";
            }

            if (dessertMenuPanel) {
                dessertMenuPanel.hidden = false;
            }

            scrollToMenuPanel(dessertMenuPanel);

        });

    }


    /* ---------------------------------------------
       BACK FROM DESSERTS
    --------------------------------------------- */

    if (backFromDesserts) {

        backFromDesserts.addEventListener("click", function () {

            hideAllMenuPanels();

            scrollToMenuPanel(menuChoiceGrid);

        });

    }


    /* ---------------------------------------------
       SAVOURIES
    --------------------------------------------- */

    if (savouryOrderBtn) {

        savouryOrderBtn.addEventListener("click", function () {

            if (menuChoiceGrid) {
                menuChoiceGrid.style.display = "none";
            }

            if (savouryMenuPanel) {
                savouryMenuPanel.hidden = false;
            }

            scrollToMenuPanel(savouryMenuPanel);

        });

    }


    /* ---------------------------------------------
       BACK FROM SAVOURIES
    --------------------------------------------- */

    if (backFromSavouries) {

        backFromSavouries.addEventListener("click", function () {

            hideAllMenuPanels();

            scrollToMenuPanel(menuChoiceGrid);

        });

    }


    /* ---------------------------------------------
       DAILY SUB-CATEGORIES
    --------------------------------------------- */

    dailyCategoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            dailyCategoryButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            const selectedCategory =
                button.dataset.category;

            loadDailyProducts(selectedCategory);

        });

    });


    /* ---------------------------------------------
       DAILY PRODUCTS
    --------------------------------------------- */

    function loadDailyProducts(category) {

        if (!dailyProductsGrid) return;


         
         const dailyProducts = {
         
           "daily-desserts": [
              {
                  name: "Triple Chocolate Brownie",
                  price: 160,
                  image: "assets/menu/daily order/Triple Chocolate Brownie.jpg"
               },
               {
                  name: "Tiramisu",
                  price: 180,
                  image: "assets/menu/daily order/Tiramisu.jpg"
               }
            ],
         
            "daily-cakes": [
              {
                   name: "Chocolate Cake",
                   price: 500,
                  image: "assets/menu/chocolate-cake.jpg"
              }
            ]
         
          };
         
         

        // dailyProductsGrid.innerHTML = `
        //     <div class="daily-empty-message">
        //         <span>🍰</span>
        //         <h4>Today's items will appear here</h4>
        //         <p>
        //             Select another category or check back
        //             for today's fresh menu.
        //         </p>
        //     </div>
        // `;

    }


    /* ---------------------------------------------
       LOAD FIRST DAILY CATEGORY
    --------------------------------------------- */

    loadDailyProducts("daily-desserts");

});

/* =====================================================
   CHERRY ON TOP - SITE CONFIG  (EDIT THESE FIRST)
   Replace the placeholder values with the client's details.
===================================================== */

const SITE_CONFIG = {
    whatsappNumber: "917826062794",     // country code + number, no + or spaces
    phoneDisplay:   "+91 78260 62794",
    instagramUser:  "Cherryontop_cbe",  // without @
    youtubeUser:    "Cherryontop_04",   // without @
    mapQuery:       "Neelambur, Coimbatore",
    address:        "Neelambur, Coimbatore",
    currency:       "₹",
    minDaysAdvance: 2
};


/* =====================================================
   CHERRY ON TOP - MENU DATA  (CLIENT'S REAL MENU)
   Single price:   { name, desc, emoji, price: 350 }
   Several sizes:  { name, desc, emoji, sizes: sz(LABELS, [prices]) }
   Images (optional): put files in assets/menu/ and add
   image: "assets/menu/filename.jpg" to any item.
===================================================== */

const sz = (labels, prices) =>
    labels.map((label, i) => ({ label: label, price: prices[i] }));

/* Per-piece items: quantity chips (1 pc, 3 pcs, ...) with auto total */
const PCS = [1, 3, 6, 12];
const pcs = (unit) =>
    PCS.map(n => ({ label: n + (n === 1 ? " pc" : " pcs"), price: unit * n }));

/* Bombolonie: minimum 4 pieces */
const BOMBO_PCS = [4, 6, 8, 12];
const bombo = (unit) =>
    BOMBO_PCS.map(n => ({ label: n + " pcs", price: unit * n }));

const TUB   = ["150g", "300g", "500g"];
const HALF  = ["250g", "500g"];
const CAKE  = ["500g", "1kg"];

/* Notes shown above a category's products */
const MENU_NOTES = {
    bites:          "Extra charges apply for extra dips.",
    "daily-desserts": "Cookie pieces: extra charges apply for extra dips. Bombolonie: minimum 4 pieces.",
    vegpizza:       "Extra cheese and flavours can be added as per your need.",
    nonvegpizza:    "Extra cheese and flavours can be added as per your need."
};

const MENU_DATA = {

    /* ================= DESSERTS ================= */

    cookies: [   // Cookie tubs: 150g / 300g / 500g
        { name: "Chocolate Cookies",        desc: "Cookie tub", emoji: "🍪", image:"assets/menu/Dessert/Cookie Tubs/Chocolate Cookies Bites.jpg",sizes: sz(TUB, [170, 330, 430]) },
        { name: "Milk Chocolate Cookies", desc: "Cookie tub", emoji: "🍪", image: "assets/menu/Dessert/Cookie Tubs/Milk Chocolate Cookie.jpg", sizes: sz(TUB, [180, 350, 450]) },
        { name: "White Chocolate Cookies",  desc: "Cookie tub", emoji: "🍪",image: "assets/menu/Dessert/Cookie Tubs/White Chocolate Cookie.jpg", sizes: sz(TUB, [185, 380, 480]) },
        { name: "Nutella Cookies",          desc: "Cookie tub", emoji: "🍪",image: "assets/menu/Dessert/Cookie Tubs/Nutella Cookie.jpg", sizes: sz(TUB, [190, 350, 450]) },
        { name: "Double Chocolate Cookies", desc: "Cookie tub", emoji: "🍪",image: "assets/menu/Dessert/Cookie Tubs/Double Chocolate Cookie.jpg", sizes: sz(TUB, [180, 380, 480]) },
        { name: "Triple Chocolate Cookies", desc: "Cookie tub", emoji: "🍪",image: "assets/menu/Dessert/Cookie Tubs/Triple Chocolate Cookie.jpg", sizes: sz(TUB, [190, 390, 490]) },
        { name: "Kunafa Chocolate Cookies", desc: "Cookie tub", emoji: "🍪",image: "assets/menu/Dessert/Cookie Tubs/Kunafa Chocolate Cookie.jpg", sizes: sz(TUB, [200, 350, 480]) },
        { name: "Kunafa Nutella Cookies",   desc: "Cookie tub", emoji: "🍪",image: "assets/menu/Dessert/Cookie Tubs/Kunafa Nutella Cookie.jpg", sizes: sz(TUB, [200, 380, 480]) },
        { name: "Brookie Tub",              desc: "Brownie + cookie tub", emoji: "🍪",image: "assets/menu/Dessert/Cookie Tubs/Brookie Tub.jpg", sizes: sz(TUB, [170, 290, 420]) }
    ],

    bites: [     // Cookie bites: 250g / 500g
        { name: "Chocolate Cookie Bites",        desc: "Bite-sized cookies", emoji: "🍪",image: "assets/menu/Dessert/Cookie Bites/Chocolate Cookie Bites.webp", sizes: sz(HALF, [230, 440]) },
        { name: "Milk Chocolate Cookie Bites",   desc: "Bite-sized cookies", emoji: "🍪",image: "assets/menu/Dessert/Cookie Bites/Milk Chocolate Cookie Bites.webp", sizes: sz(HALF, [240, 440]) },
        { name: "White Chocolate Cookie Bites",  desc: "Bite-sized cookies", emoji: "🍪",image: "assets/menu/Dessert/Cookie Bites/White Chocolate Cookie Bites.webp", sizes: sz(HALF, [260, 450]) },
        { name: "Nutella Cookie Bites",          desc: "Bite-sized cookies", emoji: "🍪",image: "assets/menu/Dessert/Cookie Bites/Nutella Cookie Bites.webp", sizes: sz(HALF, [260, 450]) },
        { name: "Double Chocolate Cookie Bites", desc: "Bite-sized cookies", emoji: "🍪",image: "assets/menu/Dessert/Cookie Bites/Double Chocolate Cookie Bites.webp", sizes: sz(HALF, [260, 450]) },
        { name: "Triple Chocolate Cookie Bites", desc: "Bite-sized cookies", emoji: "🍪",image: "assets/menu/Dessert/Cookie Bites/Triple Chocolate Cookie Bites.webp", sizes: sz(HALF, [270, 460]) }
    ],

    brownie: [   // Brownie tubs: 250g / 500g
        { name: "Classic Brownie Tub",          desc: "Brownie tub", emoji: "🍫",image: "assets/menu/Dessert/Brownie Tubs/Classic Brownie Tub.jpg", sizes: sz(HALF, [280, 430]) },
        { name: "KitKat Brownie Tub",           desc: "Brownie tub", emoji: "🍫",image: "assets/menu/Dessert/Brownie Tubs/KitKat Brownie Tub.jpg", sizes: sz(HALF, [290, 440]) },
        { name: "Double Chocolate Brownie Tub", desc: "Brownie tub", emoji: "🍫",image: "assets/menu/Dessert/Brownie Tubs/Double Chocolate Brownie Tub.jpg", sizes: sz(HALF, [299, 440]) },
        { name: "Nutella Brownie Tub",          desc: "Brownie tub", emoji: "🍫",image: "assets/menu/Dessert/Brownie Tubs/Nutella Brownie Tub.jpg", sizes: sz(HALF, [299, 450]) },
        { name: "Triple Chocolate Brownie Tub", desc: "Brownie tub", emoji: "🍫",image: "assets/menu/Dessert/Brownie Tubs/Triple Chocolate Brownie Tub.jpg", sizes: sz(HALF, [319, 480]) },
        { name: "Kinder Bueno Brownie Tub",     desc: "Brownie tub", emoji: "🍫",image: "assets/menu/Dessert/Brownie Tubs/Kinder Bueno Brownie Tub.jpg", sizes: sz(HALF, [329, 490]) },
        { name: "Ferrero Rocher Brownie Tub",   desc: "Brownie tub", emoji: "🍫",image: "assets/menu/Dessert/Brownie Tubs/Ferrero Rocher Brownie Tub.jpg", sizes: sz(HALF, [339, 499]) }
    ],

    brookies: [  // Brookies: 250g / 500g
        { name: "Plain Brookies",                 desc: "Brownie + cookie", emoji: "🍪",image: "assets/menu/Dessert/Brookies/Plain Brookies.jpg", sizes: sz(HALF, [270, 440]) },
        { name: "Caramel Brookies",               desc: "Brownie + cookie", emoji: "🍪",image: "assets/menu/Dessert/Brookies/Caramel Brookies.jpg", sizes: sz(HALF, [280, 440]) },
        { name: "Kunafa Brookies",                desc: "Brownie + cookie", emoji: "🍪",image: "assets/menu/Dessert/Brookies/Kunafa Brookies.jpg", sizes: sz(HALF, [280, 450]) },
        { name: "Red Velvet & Plain Cookie Brookies", desc: "Brownie + cookie", emoji: "🍪",image: "assets/menu/Dessert/Brookies/Red Velvet & Plain Cookie Brookies.jpg", sizes: sz(HALF, [270, 450]) },
        { name: "Lotus Biscoff Brookies",         desc: "Brownie + cookie", emoji: "🍪",image: "assets/menu/Dessert/Brookies/Lotus Biscoff Brookies.jpg", sizes: sz(HALF, [270, 450]) }
    ],

    bento: [
        { name: "Vanilla Bento",           desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Vanilla Bento.webp", price: 320 },
        { name: "Strawberry Bento",        desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Strawberry Bento.webp", price: 340 },
        { name: "Butterscotch Bento",      desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Butterscotch Bento.webp", price: 340 },
        { name: "Chocolate Bento",         desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Chocolate Bento.webp", price: 350 },
        { name: "Chocolate Truffle Bento", desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Chocolate Truffle Bento.webp", price: 380 },
        { name: "Rose Milk Bento",         desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Rose Milk Bento.webp", price: 370 },
        { name: "Rasmalai Bento",          desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Rasmalai Bento.webp", price: 380 },
        { name: "Red Velvet Bento",        desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Red Velvet Bento.webp", price: 370 },
        { name: "Caramel Bento",           desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Caramel Bento.webp", price: 380 },
        { name: "Nutella Bento",           desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Nutella Bento.webp", price: 380 },
        { name: "Lotus Biscoff Bento",     desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Lotus Biscoff Bento.webp", price: 440 },
        { name: "Chocolate Kunafa Bento",  desc: "Bento cake", emoji: "🎂",image: "assets/menu/Dessert/Bento cake/Chocolate Kunafa Bento.webp", price: 440 }
    ],

    birthday: [  // 500g / 1kg
        { name: "Vanilla",            desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Vanilla.webp", sizes: sz(CAKE, [480, 880]) },
        { name: "Strawberry",         desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Strawberry.webp", sizes: sz(CAKE, [490, 880]) },
        { name: "Butterscotch",       desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Butterscotch.jpg", sizes: sz(CAKE, [490, 880]) },
        { name: "Chocolate",          desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Chocolate.webp", sizes: sz(CAKE, [500, 930]) },
        { name: "Chocolate Truffle",  desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Chocolate Truffle.webp", sizes: sz(CAKE, [600, 1100]) },
        { name: "Rose Milk",          desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Rose Milk.webp", sizes: sz(CAKE, [600, 1100]) },
        { name: "Rasmalai",           desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Rasmalai.webp", sizes: sz(CAKE, [650, 1150]) },
        { name: "Red Velvet",         desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Red Velvet.jpg", sizes: sz(CAKE, [500, 900]) },
        { name: "Caramel",            desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Caramel.webp", sizes: sz(CAKE, [600, 1050]) },
        { name: "Nutella",            desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Nutella.webp", sizes: sz(CAKE, [700, 1300]) },
        { name: "Lotus Biscoff",      desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Lotus Biscoff.webp", sizes: sz(CAKE, [750, 1400]) },
        { name: "Chocolate Kunafa",   desc: "Birthday cake", emoji: "🎂",image: "assets/menu/Dessert/Birthday cake/Chocolate Kunafa.webp", sizes: sz(CAKE, [760, 1400]) }
    ],

    cupcakes: [  // per piece
        { name: "Vanilla Cupcake",            desc: "₹45 per piece", emoji: "🧁",image: "assets/menu/Dessert/Cupcakes/Vanilla Cupcake.webp", sizes: pcs(45) },
        { name: "Strawberry Cupcake",         desc: "₹50 per piece", emoji: "🧁",image: "assets/menu/Dessert/Cupcakes/Strawberry Cupcake.webp", sizes: pcs(50) },
        { name: "Butterscotch Cupcake",       desc: "₹50 per piece", emoji: "🧁",image: "assets/menu/Dessert/Cupcakes/Butterscotch Cupcake.webp", sizes: pcs(50) },
        { name: "Chocolate Nutella Cupcake",  desc: "₹55 per piece", emoji: "🧁",image: "assets/menu/Dessert/Cupcakes/Chocolate Nutella Cupcake.webp", sizes: pcs(55) },
        { name: "Rose Milk Cupcake",          desc: "₹50 per piece", emoji: "🧁",image: "assets/menu/Dessert/Cupcakes/Rose Milk Cupcake.webp", sizes: pcs(50) },
        { name: "Rasmalai Cupcake",           desc: "₹55 per piece", emoji: "🧁",image: "assets/menu/Dessert/Cupcakes/Rasmalai Cupcake.webp", sizes: pcs(55) },
        { name: "Red Velvet Cupcake",         desc: "₹50 per piece", emoji: "🧁",image: "assets/menu/Dessert/Cupcakes/Red Velvet Cupcake.webp", sizes: pcs(50) },
        { name: "Caramel Cupcake",            desc: "₹50 per piece", emoji: "🧁",image: "assets/menu/Dessert/Cupcakes/Caramel Cupcake.webp", sizes: pcs(50) },
        { name: "Nutella Cupcake",            desc: "₹55 per piece", emoji: "🧁",image: "assets/menu/Dessert/Cupcakes/Nutella Cupcake.webp", sizes: pcs(55) },
        { name: "Lotus Biscoff Cupcake",      desc: "₹60 per piece", emoji: "🧁",image: "assets/menu/Dessert/Cupcakes/Lotus Biscoff Cupcake.webp", sizes: pcs(60) },
        { name: "Tiramisu Cupcake",           desc: "₹55 per piece", emoji: "🧁",image: "assets/menu/Dessert/Cupcakes/Tiramisu Cupcake.webp", sizes: pcs(55) }
    ],

    tresleches: [  // 100g
        { name: "Classic Vanilla Tres Leches", desc: "Tres leches", emoji: "🍰",image: "assets/menu/Dessert/Tres Leches/Classic Vanilla Tres Leches.webp", sizes: sz(["100g"], [100]) },
        { name: "Chocolate Delight Tres Leches", desc: "Tres leches", emoji: "🍰",image: "assets/menu/Dessert/Tres Leches/Chocolate Delight Tres Leches.webp", sizes: sz(["100g"], [110]) },
        { name: "Rose Milk Tres Leches",       desc: "Tres leches", emoji: "🍰",image: "assets/menu/Dessert/Tres Leches/Rose Milk Tres Leches.webp", sizes: sz(["100g"], [110]) },
        { name: "Rasmalai Tres Leches",        desc: "Tres leches", emoji: "🍰",image: "assets/menu/Dessert/Tres Leches/Rasmalai Tres Leches.webp", sizes: sz(["100g"], [130]) },
        { name: "Boost Tres Leches",           desc: "Tres leches", emoji: "🍰",image: "assets/menu/Dessert/Tres Leches/Boost Tres Leches.webp", sizes: sz(["100g"], [130]) },
        { name: "Milo Tres Leches",            desc: "Tres leches", emoji: "🍰",image: "assets/menu/Dessert/Tres Leches/Milo Tres Leches.webp", sizes: sz(["100g"], [130]) },
        { name: "Mango Tres Leches",           desc: "Tres leches", emoji: "🍰",image: "assets/menu/Dessert/Tres Leches/Mango Tres Leches.webp", sizes: sz(["100g"], [130]) },
        { name: "Coffee Tres Leches",          desc: "Tres leches", emoji: "🍰",image: "assets/menu/Dessert/Tres Leches/Coffee Tres Leches.webp", sizes: sz(["100g"], [120]) }
    ],

    tiramisu: [
        { name: "Classic Tiramisu",         desc: "Tiramisu", emoji: "☕",image: "assets/menu/Dessert/Tiramisu/Classic Tiramisu.webp", price: 140 },
        { name: "Mango Tiramisu",           desc: "Tiramisu", emoji: "☕",image: "assets/menu/Dessert/Tiramisu/Mango Tiramisu.webp", price: 150 },
        { name: "Nutella Tiramisu",         desc: "Tiramisu", emoji: "☕",image: "assets/menu/Dessert/Tiramisu/Nutella Tiramisu.webp", price: 150 },
        { name: "Lotus Biscoff Tiramisu",   desc: "Tiramisu", emoji: "☕",image: "assets/menu/Dessert/Tiramisu/Lotus Biscoff Tiramisu.webp", price: 155 },
        { name: "Strawberry Tiramisu",      desc: "Tiramisu", emoji: "☕",image: "assets/menu/Dessert/Tiramisu/Strawberry Tiramisu.webp", price: 150 },
        { name: "Oreo Tiramisu",            desc: "Tiramisu", emoji: "☕",image: "assets/menu/Dessert/Tiramisu/Oreo Tiramisu.webp", price: 150 },
        { name: "Caramel Tiramisu",         desc: "Tiramisu", emoji: "☕",image: "assets/menu/Dessert/Tiramisu/Caramel Tiramisu.webp", price: 150 }
    ],

    jarcakes: [
        { name: "Vanilla Jar Cake",           desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Vanilla Jar Cake.webp", price: 90 },
        { name: "Strawberry Jar Cake",        desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Strawberry Jar Cake.webp", price: 100 },
        { name: "Butterscotch Jar Cake",      desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Butterscotch Jar Cake.webp", price: 100 },
        { name: "Chocolate Delight Jar Cake", desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Chocolate Delight Jar Cake.webp", price: 110 },
        { name: "Matilda Jar Cake",           desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Matilda Jar Cake.webp", price: 130 },
        { name: "Chocolate Nutella Jar Cake", desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Chocolate Nutella Jar Cake.webp", price: 135 },
        { name: "Rose Milk Jar Cake",         desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Rose Milk Jar Cake.webp", price: 120 },
        { name: "Rasmalai Jar Cake",          desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Rasmalai Jar Cake.webp", price: 130 },
        { name: "Red Velvet Jar Cake",        desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Red Velvet Jar Cake.webp", price: 120 },
        { name: "Caramel Jar Cake",           desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Caramel Jar Cake.webp", price: 130 },
        { name: "Nutella Jar Cake",           desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Nutella Jar Cake.webp", price: 130 },
        { name: "Lotus Biscoff Jar Cake",     desc: "Jar cake", emoji: "🫙",image: "assets/menu/Dessert/Jar cake/Lotus Biscoff Jar Cake.webp", price: 140 }
    ],


    /* ================= SAVOURIES ================= */

    vegpizza: [
        { name: "Margherita Pizza",       desc: "Classic veg", emoji: "🍕",image: "assets/menu/Savoury/veg pizza/Margherita Pizza.jpg", price: 179 },
        { name: "Sweet Corn & Cheese",    desc: "Classic veg", emoji: "🍕",image: "assets/menu/Savoury/veg pizza/Sweet Corn & Cheese.jpg", price: 179 },
        { name: "Mushroom Classic",       desc: "Classic veg", emoji: "🍕",image: "assets/menu/Savoury/veg pizza/Mushroom Classic.jpg", price: 199 },
        { name: "Paneer Capsicum",        desc: "Classic veg", emoji: "🍕",image: "assets/menu/Savoury/veg pizza/Paneer Capsicum.jpg", price: 199 },
        { name: "Pasta Loaded",           desc: "Classic veg", emoji: "🍕",image: "assets/menu/Savoury/veg pizza/Pasta Loaded.jpg", price: 229 },
        { name: "BBQ Paneer Pizza",       desc: "Signature veg", emoji: "🍕",image: "assets/menu/Savoury/veg pizza/BBQ Paneer Pizza.jpg", price: 249 },
        { name: "Mushroom Lovers Pizza",  desc: "Signature veg", emoji: "🍕",image: "assets/menu/Savoury/veg pizza/Mushroom Lovers Pizza.jpg", price: 259 },
        { name: "Veggie Supreme",         desc: "Signature veg", emoji: "🍕",image: "assets/menu/Savoury/veg pizza/Veggie Supreme.jpg", price: 259 },
        { name: "Butter Garlic Pizza",    desc: "Signature veg", emoji: "🍕",image: "assets/menu/Savoury/veg pizza/Butter Garlic Pizza.jpg", price: 249 }
    ],

    nonvegpizza: [
        { name: "Margherita Pizza",          desc: "Classic", emoji: "🍕",image: "assets/menu/Savoury/Non veg pizza/Margherita Pizza.jpg", price: 179 },
        { name: "Sweet Corn & Cheese",       desc: "Classic", emoji: "🍕",image: "assets/menu/Savoury/Non veg pizza/Sweet Corn & Cheese.jpg", price: 179 },
        { name: "Chicken Classic",           desc: "Classic non-veg", emoji: "🍕",image: "assets/menu/Savoury/Non veg pizza/Chicken Classic.jpg", price: 279 },
        { name: "Chilli Chicken Capsicum",   desc: "Classic non-veg", emoji: "🍕",image: "assets/menu/Savoury/Non veg pizza/Chilli Chicken Capsicum.jpg", price: 279 },
        { name: "Pasta & Mealmaker Loaded",  desc: "Classic non-veg", emoji: "🍕",image: "assets/menu/Savoury/Non veg pizza/Pasta & Mealmaker Loaded.jpg", price: 279 },
        { name: "BBQ Chicken Pizza",         desc: "Signature non-veg", emoji: "🍕",image: "assets/menu/Savoury/Non veg pizza/BBQ Chicken Pizza.jpg", price: 289 },
        { name: "Tandoori Lovers Pizza",     desc: "Signature non-veg", emoji: "🍕",image: "assets/menu/Savoury/Non veg pizza/Tandoori Lovers Pizza.jpg", price: 299 },
        { name: "Chicken & Mushroom Supreme", desc: "Signature non-veg", emoji: "🍕",image: "assets/menu/Savoury/Non veg pizza/Chicken & Mushroom Supreme.jpg", price: 299 }
    ],

    buns: [
        { name: "Classic Korean Cream Cheese Bun",  desc: "Soft bun, cream cheese filling", emoji: "🥐",image: "assets/menu/Savoury/Korean Buns/Classic Korean Cream Cheese Bun.jpg", price: 100 },
        { name: "Chilli Korean Cream Cheese Bun",   desc: "Soft bun, cream cheese filling", emoji: "🥐",image: "assets/menu/Savoury/Korean Buns/Chilli Korean Cream Cheese Bun.jpg", price: 110 },
        { name: "Mushroom Korean Cream Cheese Bun", desc: "Soft bun, cream cheese filling", emoji: "🥐",image: "assets/menu/Savoury/Korean Buns/Mushroom Korean Cream Cheese Bun.jpg", price: 130 }
    ],


    /* ================= DAILY ORDERS ================= */

    "daily-desserts": [
        { name: "Triple Chocolate Brownie",     desc: "Baked fresh today", emoji: "🍫",image: "assets/menu/daily order/Triple Chocolate Brownie.jpg", price: 160 },
        { name: "Tiramisu",                     desc: "Fresh today", emoji: "☕",image: "assets/menu/daily order/Tiramisu.jpg", price: 180 },
        { name: "Chocolate Cookies Bites (piece)",  desc: "₹50 per piece", emoji: "🍪",image: "assets/menu/daily order/Chocolate Cookies Bites.jpg", sizes: pcs(50) },
        { name: "Milk Chocolate Cookie (piece)",    desc: "₹60 per piece", emoji: "🍪",image: "assets/menu/daily order/Milk Chocolate Cookie.jpg", sizes: pcs(60) },
        { name: "White Chocolate Cookie (piece)",   desc: "₹60 per piece", emoji: "🍪",image: "assets/menu/daily order/White Chocolate Cookie.jpg", sizes: pcs(60) },
        { name: "Nutella Cookie (piece)",           desc: "₹60 per piece", emoji: "🍪",image: "assets/menu/daily order/Nutella Cookie.jpg", sizes: pcs(60) },
        { name: "Double Chocolate Cookie (piece)",  desc: "₹65 per piece", emoji: "🍪",image: "assets/menu/daily order/Double Chocolate Cookie.jpg", sizes: pcs(65) },
        { name: "Triple Chocolate Cookie (piece)",  desc: "₹75 per piece", emoji: "🍪",image: "assets/menu/daily order/Triple Chocolate Cookie.jpg", sizes: pcs(75) },
        { name: "Marshmallow Cookie (piece)",       desc: "₹65 per piece", emoji: "🍪",image: "assets/menu/daily order/Marshmallow Cookie.jpg", sizes: pcs(65) },
        { name: "Vennila Bombolonie", desc: "Min. 4 pieces · ₹70 per piece", emoji: "🍩", sizes: bombo(70) },
        { name: "Strawberry Bombolonie", desc: "Min. 4 pieces · ₹70 per piece", emoji: "🍩", sizes: bombo(70) },
        { name: "Chocolate Bombolonie", desc: "Min. 4 pieces · ₹70 per piece", emoji: "🍩", sizes: bombo(70) },
        { name: "Nutella Bombolonie", desc: "Min. 4 pieces · ₹80 per piece", emoji: "🍩", sizes: bombo(80) },
        { name: "Butterscotch Bombolonie", desc: "Min. 4 pieces · ₹70 per piece", emoji: "🍩", sizes: bombo(70) },
        { name: "Salted Caramel Bombolonie", desc: "Min. 4 pieces · ₹80 per piece", emoji: "🍩", sizes: bombo(80) },
        { name: "White Chocolate Bombolonie", desc: "Min. 4 pieces · ₹80 per piece", emoji: "🍩", sizes: bombo(80) },
        { name: "Milk Chocolate Bombolonie", desc: "Min. 4 pieces · ₹80 per piece", emoji: "🍩", sizes: bombo(80) },
        { name: "Pista Bombolonie", desc: "Min. 4 pieces · ₹80 per piece", emoji: "🍩", sizes: bombo(80) },
        { name: "Mango Bombolonie", desc: "Min. 4 pieces · ₹70 per piece", emoji: "🍩", sizes: bombo(70) },
        { name: "Oreo Bombolonie", desc: "Min. 4 pieces · ₹70 per piece", emoji: "🍩", sizes: bombo(70) },
        { name: "Caramel Bombolonie", desc: "Min. 4 pieces · ₹80 per piece", emoji: "🍩", sizes: bombo(80) }
    ],

    "daily-cakes": [
        { name: "Crunch Cake",           desc: "Ready for today", emoji: "🍰",image: "assets/menu/daily order/Crunch Cake.jpg", price: 110 },
        { name: "London Caramel Cake",   desc: "Ready for today", emoji: "🍰",image: "assets/menu/daily order/London Caramel Cake.jpg", price: 110 },
        { name: "Dream Cake (250 g)",    desc: "Ready for today", emoji: "🍰",image: "assets/menu/daily order/Dream Cake.jpg", price: 240 },
        { name: "Matilda Cake",          desc: "Ready for today", emoji: "🍰",image: "assets/menu/daily order/Matilda Cake.jpg", price: 120 }
    ],

    "daily-savouries": [
        { name: "Korean Buns",           desc: "Fresh & tasty", emoji: "🥐",image: "assets/menu/daily order/Korean Buns.jpg", price: 100 }
    ]
};


/* =====================================================
   CHERRY ON TOP - PRODUCT IMAGES  (image "API")
   ----------------------------------------------------
   Every item gets its photo automatically from a folder
   and the item's name. No need to edit the menu list.

   HOW IT FINDS A PHOTO (first match wins):
     1. image: "..." written on the item inside MENU_DATA
     2. an entry in MENU_IMAGES below
     3. the automatic path:
          <basePath>/<category>/<item-name-slug>.<extension>
        e.g.  assets/menu/items/cookies/chocolate-cookies.jpg

   If no photo is found, the item's emoji is shown instead.
===================================================== */

const IMAGE_CONFIG = {
    auto: true,                          // turn automatic lookup on / off
    basePath: "assets/menu/items",       // folder that holds the category folders
    extensions: ["png", "jpg", "webp"]   // tried in this order. Use one (e.g. ["png"]) for fewer requests
};

/* Manual overrides. Use whichever is easier:
     "Item Name":            "path/to/image.jpg"
     "category/Item Name":   "path/to/image.jpg"    (when the same name exists in 2 categories)
     "Item Name":            ["a.jpg", "b.png"]     (several candidates) */
const MENU_IMAGES = {
    // "Chocolate Cookies":        "assets/menu/items/cookies/choco-cookies.png",
    // "vegpizza/Margherita Pizza": "assets/menu/pizza/margherita.jpg",
    // "Tiramisu":                 "assets/menu/items/tiramisu/classic-tiramisu.jpg"
};

/* "Chocolate Kunafa Bento" -> "chocolate-kunafa-bento" */
function imageSlug(text) {
    return String(text)
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/* returns the list of image paths to try, in order */
function getImageCandidates(category, item) {

    const list = [];

    if (item.image) list.push(item.image);

    const manual = MENU_IMAGES[category + "/" + item.name] || MENU_IMAGES[item.name];
    if (manual) list.push.apply(list, [].concat(manual));

    if (IMAGE_CONFIG.auto) {
        const slug = imageSlug(item.name);
        IMAGE_CONFIG.extensions.forEach(function (ext) {
            list.push(IMAGE_CONFIG.basePath + "/" + category + "/" + slug + "." + ext);
        });
    }

    return list.filter(function (path, i) { return list.indexOf(path) === i; });
}


/* =====================================================
   CHERRY ON TOP - PRODUCT CARDS, FILTERS, ORDER LINKS
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const cfg = SITE_CONFIG;

    function escapeHTML(text) {
        const el = document.createElement("div");
        el.textContent = text;
        return el.innerHTML;
    }

    function formatPrice(price) {
        if (typeof price === "number") return cfg.currency + price;
        return cfg.currency + String(price).replace(/^[₹]/, "");
    }

    function whatsappLink(message) {
        return "https://wa.me/" + cfg.whatsappNumber +
               "?text=" + encodeURIComponent(message);
    }

    /* ---------- order message ---------- */
    function orderMessage(name, sizeLabel, price, isDaily) {
        return "Hi Cherry on Top! I'd like to place " +
               (isDaily ? "a daily order" : "an order") + " for: " +
               name + (sizeLabel ? " (" + sizeLabel + ")" : "") +
               " - " + formatPrice(price);
    }

    /* ---------- build one card ---------- */
    function productCardHTML(item, isDaily, category) {

        const hasSizes = Array.isArray(item.sizes) && item.sizes.length;
        const first = hasSizes ? item.sizes[0] : null;
        const startPrice = hasSizes ? first.price : item.price;

        const candidates = getImageCandidates(category, item).map(encodeURI);

        const media = candidates.length
            ? '<img class="product-img" src="' + escapeHTML(candidates[0]) + '"' +
              ' data-fallbacks="' + escapeHTML(candidates.slice(1).join("|")) + '"' +
              ' alt="' + escapeHTML(item.name) + '" loading="lazy" decoding="async">'
            : "";

        const sizeChips = hasSizes
            ? '<div class="size-options' + (item.sizes.length > 3 ? ' size-options--many' : '') +
              '" role="group" aria-label="Choose option for ' +
              escapeHTML(item.name) + '">' +
              item.sizes.map(function (opt, i) {
                  return '<button type="button" class="size-chip' +
                         (i === 0 ? ' active' : '') + '" aria-pressed="' +
                         (i === 0) + '" data-price="' + opt.price +
                         '" data-label="' + escapeHTML(opt.label) + '">' +
                         escapeHTML(opt.label) + '</button>';
              }).join("") +
              '</div>'
            : "";

        return '' +
        '<article class="product-card" data-name="' + escapeHTML(item.name) +
            '" data-daily="' + (isDaily ? "1" : "") + '">' +
            '<div class="product-media' + (candidates.length ? '' : ' no-image') + '" ' +
                 'data-emoji="' + item.emoji + '">' + media + '</div>' +
            '<div class="product-body">' +
                '<h4>' + escapeHTML(item.name) + '</h4>' +
                '<p>' + escapeHTML(item.desc) + '</p>' +
                sizeChips +
                '<div class="product-footer">' +
                    '<strong class="product-price">' +
                        formatPrice(startPrice) +
                    '</strong>' +
                    '<a class="product-order-btn" href="' +
                       whatsappLink(orderMessage(item.name, first ? first.label : "", startPrice, isDaily)) +
                       '" target="_blank" rel="noopener">Order</a>' +
                '</div>' +
            '</div>' +
        '</article>';
    }

    /* size / quantity chips: update price + WhatsApp link */
    document.addEventListener("click", function (e) {

        const chip = e.target.closest(".size-chip");
        if (!chip) return;

        const card = chip.closest(".product-card");

        card.querySelectorAll(".size-chip").forEach(function (c) {
            c.classList.remove("active");
            c.setAttribute("aria-pressed", "false");
        });

        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");

        const price = Number(chip.dataset.price);

        card.querySelector(".product-price").textContent = formatPrice(price);
        card.querySelector(".product-order-btn").href = whatsappLink(
            orderMessage(card.dataset.name, chip.dataset.label, price, !!card.dataset.daily)
        );
    });

    /* if a photo is missing, try the next path, then show the emoji */
    document.addEventListener("error", function (e) {

        const img = e.target;

        if (!img || img.tagName !== "IMG" || !img.classList.contains("product-img")) return;

        const rest = (img.dataset.fallbacks || "").split("|").filter(Boolean);

        if (rest.length) {
            img.dataset.fallbacks = rest.slice(1).join("|");
            img.src = rest[0];
        } else {
            img.parentNode.classList.add("no-image");
            img.remove();
        }

    }, true);

    /* size / quantity chips: update price + WhatsApp link */
    document.addEventListener("click", function (e) {

        const chip = e.target.closest(".size-chip");
        if (!chip) return;

        const card = chip.closest(".product-card");

        card.querySelectorAll(".size-chip").forEach(function (c) {
            c.classList.remove("active");
            c.setAttribute("aria-pressed", "false");
        });

        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");

        const price = Number(chip.dataset.price);

        card.querySelector(".product-price").textContent = formatPrice(price);
        card.querySelector(".product-order-btn").href = whatsappLink(
            orderMessage(card.dataset.name, chip.dataset.label, price, !!card.dataset.daily)
        );
    });

    function renderProducts(gridEl, category, isDaily) {

        if (!gridEl) return;

        const items = MENU_DATA[category] || [];

        if (!items.length) {
            gridEl.innerHTML =
                '<div class="daily-empty-message">' +
                    '<span>🍰</span>' +
                    '<h4>Nothing listed here right now</h4>' +
                    '<p>Check back soon or message us to ask what\'s fresh today.</p>' +
                '</div>';
            return;
        }

        const note = MENU_NOTES[category]
            ? '<p class="menu-category-note">ⓘ ' + escapeHTML(MENU_NOTES[category]) + '</p>'
            : "";

        gridEl.innerHTML = note + items
            .map(function (item) { return productCardHTML(item, isDaily, category); })
            .join("");
    }

    /* ---------- filter groups (desserts + savouries) ---------- */
    function setupFilters(filterId, gridId) {

        const wrap = document.getElementById(filterId);
        const grid = document.getElementById(gridId);

        if (!wrap || !grid) return;

        const buttons = wrap.querySelectorAll(".menu-filter");

        buttons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                buttons.forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
                renderProducts(grid, btn.dataset.category, false);
            });
        });

        const first = wrap.querySelector(".menu-filter.active") || buttons[0];
        if (first) renderProducts(grid, first.dataset.category, false);
    }

    setupFilters("dessertFilters", "menuGrid");
    setupFilters("savouryFilters", "savouryGrid");

    /* ---------- daily orders: replace the placeholder loader ---------- */
    const dailyGrid = document.getElementById("dailyProductsGrid");
    const dailyButtons = document.querySelectorAll(".daily-category-btn");

    dailyButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            renderProducts(dailyGrid, btn.dataset.category, true);
        });
    });

    // Runs after the older handler's initial placeholder render
    renderProducts(dailyGrid, "daily-desserts", true);


    /* =================================================
       CONTACT: fill details from config
    ================================================= */
    const setHref = function (id, href) {
        const el = document.getElementById(id);
        if (el) el.href = href;
    };
    const setText = function (id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setHref("contactWhatsapp", whatsappLink("Hi Cherry on Top! I'd like to know more."));
    setText("contactWhatsappText", cfg.phoneDisplay);
    setHref("contactPhone", "tel:+" + cfg.whatsappNumber);
    setText("contactPhoneText", cfg.phoneDisplay);
    setHref("contactInstagram", "https://instagram.com/" + cfg.instagramUser);
    setText("contactInstagramText", "@" + cfg.instagramUser);
    setHref("contactYoutube", "https://www.youtube.com/@" + cfg.youtubeUser);
    setText("contactYoutubeText", "@" + cfg.youtubeUser);
    setHref("contactLocation", "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(cfg.mapQuery));
    setText("contactAddress", cfg.address);
    setText("footerYear", new Date().getFullYear());


    /* =================================================
       ORDER FORM -> WhatsApp
    ================================================= */
    const form = document.getElementById("orderForm");
    const dateInput = document.getElementById("orderDate");
    const errorBox = document.getElementById("formError");

    function isoDate(daysAhead) {
        const d = new Date();
        d.setDate(d.getDate() + daysAhead);
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return d.getFullYear() + "-" + m + "-" + day;
    }

    // Daily orders can be same-day; everything else needs advance notice
    function updateMinDate() {
        if (!dateInput) return;
        const typeEl = document.getElementById("orderType");
        const isDaily = typeEl && typeEl.value === "Daily Orders";
        dateInput.min = isoDate(isDaily ? 0 : cfg.minDaysAdvance);
    }

    updateMinDate();
    const typeSelect = document.getElementById("orderType");
    if (typeSelect) typeSelect.addEventListener("change", updateMinDate);

    function showError(msg) {
        if (!errorBox) return;
        errorBox.textContent = msg;
        errorBox.hidden = !msg;
    }

    if (form) {
        form.addEventListener("submit", function (e) {

            e.preventDefault();

            const name = document.getElementById("orderName").value.trim();
            const phone = document.getElementById("orderPhone").value.trim();
            const type = document.getElementById("orderType").value;
            const date = document.getElementById("orderDate").value;
            const note = document.getElementById("orderMessage").value.trim();

            if (!name || !phone || !date || !note) {
                showError("Please fill in all the fields.");
                return;
            }

            if (!/^[0-9+\-\s]{10,15}$/.test(phone)) {
                showError("Please enter a valid phone number.");
                return;
            }

            if (date < dateInput.min) {
                showError("Please choose a date at least " +
                          cfg.minDaysAdvance + " days from today.");
                return;
            }

            showError("");

            const message =
                "Hi Cherry on Top! 🍒\n\n" +
                "*Name:* " + name + "\n" +
                "*Phone:* " + phone + "\n" +
                "*Order type:* " + type + "\n" +
                "*Date:* " + date + "\n\n" +
                "*Order details:*\n" + note;

            window.open(whatsappLink(message), "_blank", "noopener");
        });
    }

});


/* =====================================================
   FLOATING "BACK TO MENU" BUTTON
   Visible only while a menu panel is open and the
   menu section is on screen.
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const floatBtn = document.getElementById("floatingBackBtn");
    const menuSection = document.getElementById("menu");

    const panels = [
        "dailyMenuPanel",
        "dessertMenuPanel",
        "savouryMenuPanel"
    ]
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

    if (!floatBtn || !menuSection || !panels.length) return;

    let menuInView = false;

    function openPanel() {
        return panels.find(function (panel) { return !panel.hidden; });
    }

    function updateFloatingBtn() {
        floatBtn.classList.toggle("show", !!openPanel() && menuInView);
    }

    /* react whenever a panel is opened or closed */
    const observer = new MutationObserver(updateFloatingBtn);
    panels.forEach(function (panel) {
        observer.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
    });

    /* only show while the menu section is on screen */
    if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            menuInView = entries[0].isIntersecting;
            updateFloatingBtn();
        }, { threshold: 0.05 }).observe(menuSection);
    } else {
        menuInView = true;
    }

    /* close the open panel and return to the menu choices */
    floatBtn.addEventListener("click", function () {

        panels.forEach(function (panel) { panel.hidden = true; });

        const choiceGrid = document.getElementById("menuChoiceGrid");

        if (choiceGrid) {
            choiceGrid.style.display = "";

            setTimeout(function () {
                choiceGrid.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    });

    updateFloatingBtn();
});


/* =====================================================
   CATEGORY BUTTONS - keep the chosen one in view,
   and allow mouse drag-to-scroll on narrow desktop windows
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll("#dessertFilters, #savouryFilters").forEach(function (row) {

        /* chosen button slides to the centre of the row */
        row.addEventListener("click", function (e) {

            const btn = e.target.closest(".menu-filter");
            if (!btn || row.scrollWidth <= row.clientWidth) return;

            const target = btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2;
            row.scrollTo({ left: target, behavior: "smooth" });
        });

        /* mouse drag-to-scroll (touch already swipes natively) */
        let down = false, startX = 0, startLeft = 0, moved = false;

        row.addEventListener("pointerdown", function (e) {
            if (e.pointerType !== "mouse") return;
            down = true; moved = false;
            startX = e.clientX; startLeft = row.scrollLeft;
        });

        window.addEventListener("pointermove", function (e) {
            if (!down) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 5) moved = true;
            row.scrollLeft = startLeft - dx;
        });

        window.addEventListener("pointerup", function () { down = false; });

        /* a drag must not count as a click on a button */
        row.addEventListener("click", function (e) {
            if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
        }, true);
    });
});