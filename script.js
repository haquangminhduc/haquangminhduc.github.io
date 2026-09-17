// 1. Realtime Local Clock
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const clockEl = document.getElementById('live-clock');
    if (clockEl) clockEl.innerText = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// 2. Realtime Weather Engine (Nghệ An)
async function fetchWeather() {
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=18.6734&longitude=105.6813&current=temperature_2m,weather_code,is_day');
        if (!res.ok) return;
        const data = await res.json();
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const isDay = data.current.is_day === 1;

        const tempEl = document.getElementById('weather-temp');
        const iconEl = document.getElementById('weather-icon');

        if (tempEl) tempEl.innerText = `${temp}°C`;

        if (iconEl) {
            let iconClass = 'fa-solid ';
            if (code === 0) {
                iconClass += isDay ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-300';
            } else if (code <= 3) {
                iconClass += isDay ? 'fa-cloud-sun text-amber-300' : 'fa-cloud-moon text-indigo-300';
            } else if (code <= 48) {
                iconClass += 'fa-smog text-slate-300';
            } else if (code <= 67 || (code >= 80 && code <= 82)) {
                iconClass += 'fa-cloud-showers-heavy text-sky-400';
            } else if (code >= 71 && code <= 77) {
                iconClass += 'fa-snowflake text-cyan-200';
            } else if (code >= 95) {
                iconClass += 'fa-cloud-bolt text-yellow-400';
            } else {
                iconClass += 'fa-cloud text-slate-300';
            }
            iconEl.className = iconClass + ' text-[10px]';
        }
    } catch (err) {
        console.log('Weather update failed:', err);
    }
}
fetchWeather();
setInterval(fetchWeather, 15 * 60 * 1000); // Tự động cập nhật mỗi 15 phút

// 3. Interactive 3D Card Tilt (Desktop only)
const card = document.getElementById('card-element');
if (card && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = -(y / (rect.height / 2)) * 5;
        const rotY = (x / (rect.width / 2)) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    window.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

// 4. Quick Copy Email
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        const btnText = document.getElementById('copy-text');
        const original = btnText.innerText;
        btnText.innerText = 'Copied!';
        btnText.classList.add('text-emerald-400');
        
        setTimeout(() => {
            btnText.innerText = original;
            btnText.classList.remove('text-emerald-400');
        }, 2000);
    });
}

// 5. Floating Star Dust Engine
(function initStarDust() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const starCount = Math.min(Math.floor((width * height) / 18000), 55);
    const stars = [];
    const colors = ['#ffffff', '#e0e7ff', '#bae6fd', '#fef08a', '#fbcfe8'];

    class Star {
        constructor() {
            this.reset(true);
        }
        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + Math.random() * 20;
            this.size = Math.random() * 1.6 + 0.4;
            this.baseAlpha = Math.random() * 0.6 + 0.2;
            this.alpha = this.baseAlpha;
            this.twinkleSpeed = Math.random() * 0.025 + 0.01;
            this.twinkleAngle = Math.random() * Math.PI * 2;
            this.speedY = Math.random() * 0.35 + 0.12;
            this.speedX = (Math.random() - 0.5) * 0.18;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.isCross = Math.random() > 0.85; // Một số hạt có hình sao 4 cánh
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.twinkleAngle += this.twinkleSpeed;
            this.alpha = this.baseAlpha + Math.sin(this.twinkleAngle) * 0.25;
            if (this.alpha < 0.05) this.alpha = 0.05;
            if (this.alpha > 0.95) this.alpha = 0.95;

            if (this.y < -10 || this.x < -10 || this.x > width + 10) {
                this.reset(false);
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.size * 4;
            ctx.shadowColor = this.color;

            if (this.isCross && this.size > 1.2) {
                // Vẽ ngôi sao 4 cánh mini
                const len = this.size * 2.2;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - len);
                ctx.lineTo(this.x, this.y + len);
                ctx.moveTo(this.x - len, this.y);
                ctx.lineTo(this.x + len, this.y);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            } else {
                // Vẽ hạt cầu tròn
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }

    function animateStars() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
            stars[i].draw();
        }
        requestAnimationFrame(animateStars);
    }
    animateStars();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
})();

// 6. Typewriter Effect
const quotes = [
    "Những gì bạn thấy chính là tôi tôi sẽ không tranh cãi",
    "Khu vườn của tôi đầy những mảnh vỡ của các vì sao"
];
let quoteIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter-text');

function typeLoop() {
    if (!typewriterEl) return;
    const currentQuote = quotes[quoteIndex];
    
    if (isDeleting) {
        typewriterEl.innerText = currentQuote.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.innerText = currentQuote.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 28 : 55;

    if (!isDeleting && charIndex === currentQuote.length) {
        typeSpeed = 2400; // Nghỉ khi gõ xong câu
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        quoteIndex = (quoteIndex + 1) % quotes.length;
        typeSpeed = 400; // Nghỉ trước khi sang câu mới
    }

    setTimeout(typeLoop, typeSpeed);
}
typeLoop();

// 7. Robust Audio Engine & Beat-Reactive RGB Glow
const bgAudio = document.getElementById('bg-audio');
let isMusicPlaying = false;
let animFrameId = null;

function startBeatPulse() {
    if (animFrameId) cancelAnimationFrame(animFrameId);

    const card = document.getElementById('card-element');
    let startTime = performance.now();

    function render(now) {
        animFrameId = requestAnimationFrame(render);

        if (!bgAudio.paused && !bgAudio.muted) {
            const elapsed = (now - startTime) / 1000;
            
            // Rhythmic harmonic beat waves
            const beat1 = Math.pow(Math.sin(elapsed * 4.2), 4);
            const beat2 = Math.pow(Math.sin(elapsed * 2.1 + 0.5), 2);
            const intensity = beat1 * 0.7 + beat2 * 0.3; // 0.0 to 1.0

            if (card) {
                const glowSpread = 24 + intensity * 36;
                const borderAlpha = 0.15 + intensity * 0.35;
                const hue = (elapsed * 60) % 360;
                const borderColor = `hsla(${hue}, 80%, 65%, ${borderAlpha})`;
                const glowColor = `hsla(${hue}, 80%, 60%, ${0.25 + intensity * 0.3})`;

                card.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px ${borderColor}, 0 0 ${glowSpread}px ${glowColor}`;
                card.style.borderColor = borderColor;
            }
        } else {
            if (card) {
                card.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06), 0 0 35px rgba(99, 102, 241, 0.2)`;
                card.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }
        }
    }
    render(performance.now());
}

function playMusic() {
    if (!bgAudio) return;
    bgAudio.muted = false;
    bgAudio.volume = 1.0;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            startBeatPulse();
        }).catch(err => {
            console.log("Audio waiting for user click/tap:", err);
        });
    }
}

// Trigger audio playback reliably on any interaction (click, touch, key, pointer)
const interactionEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'];

function handleUserInteraction() {
    playMusic();
    interactionEvents.forEach(evt => {
        window.removeEventListener(evt, handleUserInteraction);
        document.removeEventListener(evt, handleUserInteraction);
    });
}

interactionEvents.forEach(evt => {
    window.addEventListener(evt, handleUserInteraction, { passive: true });
    document.addEventListener(evt, handleUserInteraction, { passive: true });
});

const cardElem = document.getElementById('card-element');
if (cardElem) {
    cardElem.addEventListener('click', () => {
        if (bgAudio && bgAudio.paused) {
            playMusic();
        }
    });
}
