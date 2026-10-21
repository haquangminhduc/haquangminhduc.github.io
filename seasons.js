// ============================================================
// Seasons Engine (Xuân - Hạ - Thu - Đông)
// Hà Quang Minh Đức Portfolio
// ============================================================

const SEASONS = ['spring.html', 'summer.html', 'autumn.html', 'winter.html'];

function goToRandomSeason(current) {
    const others = SEASONS.filter(s => !window.location.pathname.endsWith(s));
    const next = others[Math.floor(Math.random() * others.length)];
    window.location.href = next;
}

// 1. Seasonal Particle System Engine
function initSeasonParticles(season) {
    const canvas = document.getElementById('season-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const isMobile = width < 768;
    const particles = [];

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Particle Classes
    if (season === 'spring') {
        // --- 🌸 SAKURA PETALS ---
        const count = isMobile ? 14 : 45;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: isMobile ? Math.random() * 6 + 6 : Math.random() * 8 + 7,
                speedX: Math.random() * 1.5 + 0.6,
                speedY: Math.random() * 1.8 + 1.0,
                angle: Math.random() * 360,
                angularSpeed: (Math.random() - 0.5) * 1.5,
                flip: Math.random() * Math.PI,
                flipSpeed: Math.random() * 0.03 + 0.015,
                color: Math.random() > 0.4 ? 'rgba(251, 113, 133, ' : 'rgba(244, 114, 182, ',
                alpha: Math.random() * 0.4 + 0.45
            });
        }

        function drawSakura(p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.angle * Math.PI) / 180);
            ctx.scale(Math.cos(p.flip), 1);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
            ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);

            const grad = ctx.createRadialGradient(0, 0, 1, 0, p.size / 2, p.size);
            grad.addColorStop(0, p.color + (p.alpha * 1.1) + ')');
            grad.addColorStop(1, p.color + (p.alpha * 0.5) + ')');
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        }

        function animateSakura() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.speedX + Math.sin(p.angle * 0.03) * 0.8;
                p.y += p.speedY;
                p.angle += p.angularSpeed;
                p.flip += p.flipSpeed;

                if (p.y > height + 20) {
                    p.y = -20;
                    p.x = Math.random() * width;
                }
                if (p.x > width + 20) {
                    p.x = -20;
                }
                drawSakura(p);
            }
            requestAnimationFrame(animateSakura);
        }
        animateSakura();

    } else if (season === 'summer') {
        // --- ☀️ SUMMER FIREFLIES & SUN SHIMMER ---
        const count = isMobile ? 16 : 55;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.5 + 1.2,
                speedX: (Math.random() - 0.5) * 0.9,
                speedY: (Math.random() - 0.5) * 0.9 - 0.2,
                baseAlpha: Math.random() * 0.5 + 0.3,
                pulseSpeed: Math.random() * 0.04 + 0.02,
                pulseOffset: Math.random() * Math.PI * 2,
                colorType: Math.random() > 0.35 ? '#fbbf24' : '#38bdf8'
            });
        }

        let time = 0;
        function animateSummer() {
            ctx.clearRect(0, 0, width, height);
            time += 0.02;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.speedX + Math.sin(time + p.pulseOffset) * 0.4;
                p.y += p.speedY + Math.cos(time + p.pulseOffset) * 0.3;

                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                if (p.y > height + 10) p.y = -10;

                const alpha = p.baseAlpha + Math.sin(time * 2 + p.pulseOffset) * 0.3;
                const safeAlpha = Math.max(0.1, Math.min(0.9, alpha));

                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.colorType;
                ctx.globalAlpha = safeAlpha;
                if (!isMobile) {
                    ctx.shadowColor = p.colorType;
                    ctx.shadowBlur = 10;
                }
                ctx.fill();
                ctx.restore();
            }
            requestAnimationFrame(animateSummer);
        }
        animateSummer();

    } else if (season === 'autumn') {
        // --- 🍁 AUTUMN MAPLE LEAVES ---
        const count = isMobile ? 12 : 36;
        const leafColors = [
            'rgba(234, 88, 12, ',  // Cam cháy (Amber/Orange)
            'rgba(245, 158, 11, ', // Vàng hổ phách (Golden Yellow)
            'rgba(220, 38, 38, ',  // Đỏ phong (Maple Red)
            'rgba(180, 83, 9, '    // Nâu ấm (Warm Cinnamon)
        ];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: isMobile ? Math.random() * 8 + 7 : Math.random() * 10 + 9,
                speedX: Math.random() * 1.6 + 0.8,
                speedY: Math.random() * 1.5 + 1.2,
                angle: Math.random() * 360,
                angularSpeed: (Math.random() - 0.5) * 2,
                swing: Math.random() * Math.PI * 2,
                swingSpeed: Math.random() * 0.03 + 0.02,
                color: leafColors[Math.floor(Math.random() * leafColors.length)],
                alpha: Math.random() * 0.35 + 0.55
            });
        }

        function drawMapleLeaf(p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.angle * Math.PI) / 180);

            // Shape of falling maple / autumn leaf
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.bezierCurveTo(p.size * 0.4, -p.size * 0.4, p.size, -p.size * 0.2, p.size * 0.7, p.size * 0.3);
            ctx.bezierCurveTo(p.size * 0.5, p.size * 0.8, 0, p.size * 0.6, 0, p.size);
            ctx.bezierCurveTo(0, p.size * 0.6, -p.size * 0.5, p.size * 0.8, -p.size * 0.7, p.size * 0.3);
            ctx.bezierCurveTo(-p.size, -p.size * 0.2, -p.size * 0.4, -p.size * 0.4, 0, -p.size);

            ctx.fillStyle = p.color + p.alpha + ')';
            if (!isMobile) {
                ctx.shadowColor = p.color + '0.4)';
                ctx.shadowBlur = 6;
            }
            ctx.fill();

            // Leaf vein
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 0.8);
            ctx.lineTo(0, p.size * 0.8);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.restore();
        }

        function animateAutumn() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.swing += p.swingSpeed;
                p.x += p.speedX + Math.sin(p.swing) * 1.5;
                p.y += p.speedY;
                p.angle += p.angularSpeed;

                if (p.y > height + 25) {
                    p.y = -25;
                    p.x = Math.random() * width;
                }
                if (p.x > width + 25) {
                    p.x = -25;
                }
                drawMapleLeaf(p);
            }
            requestAnimationFrame(animateAutumn);
        }
        animateAutumn();

    } else if (season === 'winter') {
        // --- ❄️ WINTER SNOWFLAKES ---
        const count = isMobile ? 22 : 80;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.8 + 0.8,
                speedY: Math.random() * 1.4 + 0.6,
                speedX: (Math.random() - 0.5) * 0.6,
                drift: Math.random() * Math.PI * 2,
                driftSpeed: Math.random() * 0.02 + 0.01,
                alpha: Math.random() * 0.5 + 0.4,
                isCyan: Math.random() > 0.6
            });
        }

        function animateWinter() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.drift += p.driftSpeed;
                p.x += p.speedX + Math.sin(p.drift) * 0.6;
                p.y += p.speedY;

                if (p.y > height + 10) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }
                if (p.x > width + 10) p.x = -10;
                if (p.x < -10) p.x = width + 10;

                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.isCyan ? 'rgba(186, 230, 253, ' + p.alpha + ')' : 'rgba(255, 255, 255, ' + p.alpha + ')';
                if (!isMobile) {
                    ctx.shadowColor = p.isCyan ? 'rgba(56, 189, 248, 0.7)' : 'rgba(255, 255, 255, 0.5)';
                    ctx.shadowBlur = 8;
                }
                ctx.fill();
                ctx.restore();
            }
            requestAnimationFrame(animateWinter);
        }
        animateWinter();
    }
}

// 2. Thematic Starting Music Selector
function selectSeasonalTrack(season) {
    if (typeof playlist === 'undefined' || !playlist.length) return;
    let targetIndex = 0;

    if (season === 'spring') {
        const idx = playlist.findIndex(s => s.src.includes("Wrong Times"));
        if (idx !== -1) targetIndex = idx;
    } else if (season === 'summer') {
        const idx = playlist.findIndex(s => s.src.includes("thế giới của anh"));
        if (idx !== -1) targetIndex = idx;
    } else if (season === 'autumn') {
        const idx = playlist.findIndex(s => s.src.includes("mùa thu"));
        if (idx !== -1) targetIndex = idx;
    } else if (season === 'winter') {
        const idx = playlist.findIndex(s => s.src.includes("dành cho em"));
        if (idx !== -1) targetIndex = idx;
    }

    if (typeof currentSongIndex !== 'undefined' && currentSongIndex !== targetIndex) {
        currentSongIndex = targetIndex;
        const song = playlist[currentSongIndex];
        const audio = document.getElementById('bg-audio');
        if (audio && song) {
            audio.src = song.src;
        }
        const songTitleEl = document.getElementById('music-song-title');
        const songArtistEl = document.getElementById('music-song-artist');
        if (songTitleEl && song) songTitleEl.innerText = song.title;
        if (songArtistEl && song) songArtistEl.innerText = song.artist;
    }
}
