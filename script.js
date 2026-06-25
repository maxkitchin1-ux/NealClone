// ======================
// NAVIGATION
// ======================
function openGame(page) {
    window.location.href = page;
}

function goHome() {
    window.location.href = "index.html";
}

// ======================
// RUN ONLY ON CRYSTAL PAGE
// ======================
if (window.location.pathname.includes("CrystalCollector.html")) {

    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }

    addEventListener("resize", resize);
    resize();

    // PLAYER
    const player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 22,
        speed: 4
    };

    const keys = {};
    const crystals = [];

    let score = 0;
    let timeLeft = 60;
    let gameOver = false;

    addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
    addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

    function spawnCrystal() {
        crystals.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            size: 12 + Math.random() * 10
        });
    }

    for (let i = 0; i < 15; i++) spawnCrystal();

    setInterval(() => {
        if (!gameOver) {
            timeLeft--;
            document.getElementById("time").textContent = timeLeft;
            if (timeLeft <= 0) gameOver = true;
        }
    }, 1000);

    function update() {
        if (gameOver) return;

        if (keys["w"] || keys["arrowup"]) player.y -= player.speed;
        if (keys["s"] || keys["arrowdown"]) player.y += player.speed;
        if (keys["a"] || keys["arrowleft"]) player.x -= player.speed;
        if (keys["d"] || keys["arrowright"]) player.x += player.speed;

        player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
        player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

        for (let i = crystals.length - 1; i >= 0; i--) {
            const c = crystals[i];

            const dist = Math.hypot(player.x - c.x, player.y - c.y);

            if (dist < player.radius + c.size) {
                crystals.splice(i, 1);
                score += 10;
                document.getElementById("score").textContent = score;
                spawnCrystal();
            }
        }
    }

    function drawCrystal(c) {
        ctx.save();
        ctx.translate(c.x, c.y);

        ctx.beginPath();

        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            const radius = i % 2 === 0 ? c.size : c.size / 2;

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.fillStyle = "cyan";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "cyan";
        ctx.fill();

        ctx.restore();
    }

    function render() {
        ctx.fillStyle = "#08111f";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = "white";
            ctx.fillRect((i * 97) % canvas.width, (i * 53) % canvas.height, 2, 2);
        }

        crystals.forEach(drawCrystal);

        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = "gold";
        ctx.fill();

        if (gameOver) {
            ctx.fillStyle = "white";
            ctx.textAlign = "center";

            ctx.font = "60px Arial";
            ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);

            ctx.font = "40px Arial";
            ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2 + 30);
        }
    }

    function loop() {
        update();
        render();
        requestAnimationFrame(loop);
    }

    loop();
}
