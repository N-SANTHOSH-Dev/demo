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