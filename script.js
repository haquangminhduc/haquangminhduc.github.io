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

// 4. Realtime Solar & Lunar Calendar Converter (Âm Dương Lịch Việt Nam)
function updateCalendarDisplay() {
    const now = new Date();
    const dd = now.getDate();
    const mm = now.getMonth() + 1;
    const yyyy = now.getFullYear();

    // Dương Lịch Display
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayStr = daysOfWeek[now.getDay()];
    const pad = (n) => (n < 10 ? '0' + n : n);
    const solarDateStr = `${pad(dd)}/${pad(mm)}/${yyyy}`;

    const solarDateEl = document.getElementById('solar-date-display');
    const solarDayEl = document.getElementById('solar-day-display');
    if (solarDateEl) solarDateEl.innerText = solarDateStr;
    if (solarDayEl) solarDayEl.innerText = dayStr;

    // Âm Lịch Computation (Hồ Ngọc Đức Algorithm - GMT+7)
    function INT(d) { return Math.floor(d); }

    function jdFromDate(d, m, y) {
        const a = INT((14 - m) / 12);
        const y1 = y + 4800 - a;
        const m1 = m + 12 * a - 3;
        let jd = d + INT((153 * m1 + 2) / 5) + 365 * y1 + INT(y1 / 4) - INT(y1 / 100) + INT(y1 / 400) - 32045;
        if (jd < 2299161) {
            jd = d + INT((153 * m1 + 2) / 5) + 365 * y1 + INT(y1 / 4) - 32083;
        }
        return jd;
    }

    function getSunLongitude(dayNumber, timeZone) {
        const T = (dayNumber - 2451545.5 - timeZone / 24.0) / 36525.0;
        const dr = Math.PI / 180.0;
        const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T * T;
        const M = 357.52910 + 35999.05030 * T - 0.0001559 * T * T - 0.00000048 * T * T * T;
        const C = (1.914600 - 0.004817 * T - 0.000014 * T * T) * Math.sin(dr * M) + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000289 * Math.sin(dr * 3 * M);
        let L = L0 + C;
        L = L - 360.0 * Math.floor(L / 360.0);
        return INT(L / 30.0);
    }

    function getNewMoonDay(k, timeZone) {
        const T = k / 1236.85;
        const T2 = T * T;
        const T3 = T2 * T;
        const dr = Math.PI / 180.0;
        let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
        Jd1 += 0.00033 * Math.sin(dr * (166.56 + 132.87 * T - 0.009173 * T2));
        const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.000000347 * T3;
        const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
        const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
        let C1 = (0.1734 - 0.000393 * T) * Math.sin(dr * M) + 0.0021 * Math.sin(dr * 2 * M);
        C1 -= 0.4068 * Math.sin(dr * Mpr) - 0.0161 * Math.sin(dr * 2 * Mpr);
        C1 += 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
        C1 -= 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
        C1 -= 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
        C1 += 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (M + 2 * Mpr));
        const deltaT = (k < -11) ? 0.001 + 0.000839 * T : (k < 0) ? 0.0002 * T : 0;
        const JdNew = Jd1 + C1 - deltaT;
        return INT(JdNew + 0.5 + timeZone / 24.0);
    }

    function getLunarMonth11(yy, timeZone) {
        const off = jdFromDate(31, 12, yy) - 2415021;
        const k = INT(off / 29.530588853);
        let nm = getNewMoonDay(k, timeZone);
        const sunLong = getSunLongitude(nm, timeZone);
        if (sunLong >= 10) {
            nm = getNewMoonDay(k - 1, timeZone);
        }
        return nm;
    }

    function getLunarDate(d, m, y, timeZone = 7) {
        const dayNumber = jdFromDate(d, m, y);
        const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
        let monthStart = getNewMoonDay(k + 1, timeZone);
        if (monthStart > dayNumber) {
            monthStart = getNewMoonDay(k, timeZone);
        }
        let a11 = getLunarMonth11(y, timeZone);
        let ly = y;
        if (a11 > monthStart) {
            ly = y - 1;
            a11 = getLunarMonth11(y - 1, timeZone);
        } else {
            const a11Next = getLunarMonth11(y + 1, timeZone);
            if (monthStart >= a11Next) {
                ly = y + 1;
                a11 = a11Next;
            }
        }
        const lunarDay = dayNumber - monthStart + 1;
        const diff = INT((monthStart - a11) / 29.5);
        let lunarMonth = diff + 11;
        if (lunarMonth > 12) lunarMonth -= 12;

        const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
        const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
        const canYear = CAN[(ly + 6) % 10];
        const chiYear = CHI[(ly + 8) % 12];

        return { day: lunarDay, month: lunarMonth, year: ly, canChiYear: `${canYear} ${chiYear}` };
    }

    const lunar = getLunarDate(dd, mm, yyyy, 7);
    const lunarDateStr = `${pad(lunar.day)}/${pad(lunar.month)}/${lunar.year}`;
    const lunarCanChiStr = `Năm ${lunar.canChiYear}`;

    const lunarDateEl = document.getElementById('lunar-date-display');
    const lunarCanChiEl = document.getElementById('lunar-canchi-display');
    if (lunarDateEl) lunarDateEl.innerText = lunarDateStr;
    if (lunarCanChiEl) lunarCanChiEl.innerText = lunarCanChiStr;
}
updateCalendarDisplay();

// 5. Floating & Twinkling Dense Star Dust Engine
let currentBassEnergy = 0;

(function initStarDust() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Denser star dust (increased count by 3.5x for magical cosmic atmosphere)
    const starCount = Math.min(Math.floor((width * height) / 4200), 160);
    const stars = [];
    const colors = ['#ffffff', '#e0e7ff', '#bae6fd', '#fef08a', '#fbcfe8', '#ddd6fe', '#c7d2fe'];

    class Star {
        constructor() {
            this.reset(true);
        }
        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + Math.random() * 20;
            this.size = Math.random() * 1.8 + 0.3;
            this.baseAlpha = Math.random() * 0.65 + 0.2;
            this.alpha = this.baseAlpha;
            this.twinkleSpeed = Math.random() * 0.03 + 0.01;
            this.twinkleAngle = Math.random() * Math.PI * 2;
            this.speedY = Math.random() * 0.38 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.isCross = Math.random() > 0.82; // Sparkling 4-point star
        }
        update() {
            const beatBoost = currentBassEnergy * 0.5;
            this.y -= (this.speedY + beatBoost * 0.3);
            this.x += this.speedX;
            this.twinkleAngle += (this.twinkleSpeed + beatBoost * 0.05);
            this.alpha = this.baseAlpha + Math.sin(this.twinkleAngle) * 0.3 + beatBoost * 0.35;
            if (this.alpha < 0.05) this.alpha = 0.05;
            if (this.alpha > 0.98) this.alpha = 0.98;

            if (this.y < -12 || this.x < -12 || this.x > width + 12) {
                this.reset(false);
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.size * (4 + currentBassEnergy * 3);
            ctx.shadowColor = this.color;

            if (this.isCross && this.size > 1.1) {
                const len = this.size * (2.2 + currentBassEnergy * 0.8);
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - len);
                ctx.lineTo(this.x, this.y + len);
                ctx.moveTo(this.x - len, this.y);
                ctx.lineTo(this.x + len, this.y);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 0.75;
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size + currentBassEnergy * 0.4, 0, Math.PI * 2);
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

// 7. Web Audio API Realtime Frequency Spectrum LED Engine
const bgAudio = document.getElementById('bg-audio');
let isMusicPlaying = false;
let animFrameId = null;

let audioCtx = null;
let analyserNode = null;
let frequencyData = null;
let audioSourceNode = null;

function initAudioAnalyser() {
    if (audioCtx) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 128; // 64 frequency bins
        analyserNode.smoothingTimeConstant = 0.82;

        if (!audioSourceNode && bgAudio) {
            audioSourceNode = audioCtx.createMediaElementSource(bgAudio);
            audioSourceNode.connect(analyserNode);
            analyserNode.connect(audioCtx.destination);
        }
        frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
    } catch (e) {
        console.log("Web Audio API initialization:", e);
    }
}

function startBeatPulse() {
    if (animFrameId) cancelAnimationFrame(animFrameId);

    const card = document.getElementById('card-element');
    let startTime = performance.now();

    function render(now) {
        animFrameId = requestAnimationFrame(render);

        let bassIntensity = 0;

        if (analyserNode && frequencyData && !bgAudio.paused && !bgAudio.muted) {
            analyserNode.getByteFrequencyData(frequencyData);
            // Sum bass frequencies (first 6 bins)
            let bassSum = 0;
            const bins = 6;
            for (let i = 0; i < bins; i++) {
                bassSum += frequencyData[i];
            }
            bassIntensity = Math.min(1.0, (bassSum / (bins * 255)) * 1.4);
            currentBassEnergy = bassIntensity;
        }

        // Fallback harmonic wave if audio context is warming up
        if (bassIntensity === 0 && !bgAudio.paused && !bgAudio.muted) {
            const elapsed = (now - startTime) / 1000;
            const beat1 = Math.pow(Math.sin(elapsed * 4.2), 4);
            const beat2 = Math.pow(Math.sin(elapsed * 2.1 + 0.5), 2);
            bassIntensity = beat1 * 0.7 + beat2 * 0.3;
            currentBassEnergy = bassIntensity;
        }

        if (!bgAudio.paused && !bgAudio.muted) {
            const elapsed = (now - startTime) / 1000;
            const hue = (elapsed * 50) % 360;

            if (card) {
                const glowSpread = 22 + bassIntensity * 45;
                const borderAlpha = 0.2 + bassIntensity * 0.5;
                const borderColor = `hsla(${hue}, 85%, 65%, ${borderAlpha})`;
                const glowColor = `hsla(${hue}, 85%, 60%, ${0.28 + bassIntensity * 0.45})`;

                card.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 0 ${1 + bassIntensity * 1.5}px ${borderColor}, 0 0 ${glowSpread}px ${glowColor}`;
                card.style.borderColor = borderColor;
            }

            updateAudioProgressBorder();
        } else {
            currentBassEnergy = 0;
            if (card) {
                card.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06), 0 0 35px rgba(99, 102, 241, 0.2)`;
                card.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }
            updateAudioProgressBorder();
        }
    }
    render(performance.now());
}

// 7b. Dynamic Audio Progress Border Engine (Tự động chạy quanh viền khung Profile theo % thời lượng nhạc)
function updateAudioProgressBorder() {
    const card = document.getElementById('card-element');
    const path = document.getElementById('card-audio-progress-bar');
    if (!card || !path) return;

    const rect = card.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w === 0 || h === 0) return;

    const r = window.innerWidth < 640 ? 32 : 36;
    const inset = 1.75;

    // Path starting from Top Center (w/2, inset) going clockwise around card
    const d = `
        M ${w / 2} ${inset}
        L ${w - r} ${inset}
        A ${r - inset} ${r - inset} 0 0 1 ${w - inset} ${r}
        L ${w - inset} ${h - r}
        A ${r - inset} ${r - inset} 0 0 1 ${w - r} ${h - inset}
        L ${r} ${h - inset}
        A ${r - inset} ${r - inset} 0 0 1 ${inset} ${h - r}
        L ${inset} ${r}
        A ${r - inset} ${r - inset} 0 0 1 ${r} ${inset}
        Z
    `.replace(/\s+/g, ' ').trim();

    path.setAttribute('d', d);
    const totalLength = path.getTotalLength();
    path.style.strokeDasharray = totalLength;

    if (bgAudio && bgAudio.duration && !bgAudio.paused) {
        const progress = bgAudio.currentTime / bgAudio.duration;
        path.style.strokeDashoffset = totalLength * (1 - progress);
        path.style.opacity = '1';
        path.style.strokeWidth = `${3 + currentBassEnergy * 2.5}px`;
    } else {
        path.style.opacity = '0';
    }
}

if (bgAudio) {
    bgAudio.addEventListener('timeupdate', updateAudioProgressBorder);
    bgAudio.addEventListener('play', updateAudioProgressBorder);
    bgAudio.addEventListener('pause', updateAudioProgressBorder);
}

window.addEventListener('resize', updateAudioProgressBorder);

function updateMusicUI(isPlaying) {
    const musicIcon = document.getElementById('music-icon');
    const infinityIcon = document.getElementById('music-infinity-icon');
    const musicBtn = document.getElementById('music-toggle-btn');

    if (isPlaying) {
        if (musicIcon) musicIcon.className = 'fa-solid fa-compact-disc text-indigo-400 animate-spin text-[10px]';
        if (infinityIcon) infinityIcon.className = 'fa-solid fa-infinity text-indigo-400 text-[11px] animate-pulse';
        if (musicBtn) musicBtn.setAttribute('title', 'Tắt nhạc nền');
    } else {
        if (musicIcon) musicIcon.className = 'fa-solid fa-volume-xmark text-rose-400 text-[10px]';
        if (infinityIcon) infinityIcon.className = 'fa-solid fa-infinity text-slate-500 text-[11px]';
        if (musicBtn) musicBtn.setAttribute('title', 'Bật nhạc nền');
    }
}

function toggleMusic(e) {
    if (e) e.stopPropagation();
    if (!bgAudio) return;

    if (!bgAudio.paused && !bgAudio.muted) {
        bgAudio.pause();
        isMusicPlaying = false;
        updateMusicUI(false);
    } else {
        playMusic();
    }
}

function playMusic() {
    if (!bgAudio) return;
    initAudioAnalyser();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    bgAudio.muted = false;
    bgAudio.volume = 1.0;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            updateMusicUI(true);
            startBeatPulse();
        }).catch(err => {
            console.log("Audio waiting for user click/tap:", err);
            updateMusicUI(false);
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

// 8. Realtime Greeting Engine
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greetingEl = document.getElementById('greeting-text');
    const iconEl = document.getElementById('greeting-icon');
    if (!greetingEl || !iconEl) return;

    let text = '';
    let iconClass = 'fa-solid ';

    if (hour >= 5 && hour < 11) {
        text = 'Chào buổi sáng! 🌄 Thật nhiều năng lượng nhé!';
        iconClass += 'fa-sun text-amber-300';
    } else if (hour >= 11 && hour < 14) {
        text = 'Chào buổi trưa! ☀️ Nhớ ăn uống nghỉ ngơi!';
        iconClass += 'fa-cloud-sun text-amber-400';
    } else if (hour >= 14 && hour < 18) {
        text = 'Chào buổi chiều! 🌇 Chúc bạn một ngày an yên!';
        iconClass += 'fa-sun-plant-wilt text-orange-400';
    } else if (hour >= 18 && hour < 22) {
        text = 'Chào buổi tối! 🌃 Thư giãn sau ngày dài nhé!';
        iconClass += 'fa-moon text-indigo-300';
    } else {
        text = 'Đêm đã khuya! 🌙 Chúc bạn ngủ thật ngon giấc!';
        iconClass += 'fa-bed text-sky-300';
    }

    greetingEl.innerText = text;
    iconEl.className = iconClass + ' text-[10px] animate-pulse';
}
updateGreeting();
setInterval(updateGreeting, 60000);

// 9. Ambient Theme Switcher Engine
const themes = [
    { id: 'theme-cosmic', name: 'Midnight Cosmic 🌌' },
    { id: 'theme-cyberpunk', name: 'Neon Cyberpunk ⚡' },
    { id: 'theme-sunset', name: 'Sunset Rose 🌅' },
    { id: 'theme-emerald', name: 'Emerald Aurora 🌿' }
];

let currentThemeIndex = 0;

function applyTheme(index, isSilent = false) {
    currentThemeIndex = index % themes.length;
    const theme = themes[currentThemeIndex];
    document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();
    if (theme.id !== 'theme-cosmic') {
        document.body.classList.add(theme.id);
    }
    localStorage.setItem('user-theme', theme.id);

    if (!isSilent) {
        showThemeToast(`Chủ đề: ${theme.name}`);
    }
}

function cycleTheme() {
    applyTheme(currentThemeIndex + 1);
}

function showThemeToast(msg) {
    let toast = document.getElementById('theme-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'theme-toast';
        toast.className = 'fixed top-14 left-1/2 -translate-x-1/2 z-50 glass-pill py-1.5 px-4 rounded-full text-xs font-mono font-medium text-slate-100 shadow-2xl transition-all duration-300 opacity-0 pointer-events-none transform -translate-y-2 border border-white/20 backdrop-blur-md';
        document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.remove('opacity-0', '-translate-y-2', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', '-translate-y-2', 'pointer-events-none');
    }, 1800);
}

(function initTheme() {
    const saved = localStorage.getItem('user-theme');
    if (saved) {
        const idx = themes.findIndex(t => t.id === saved);
        if (idx !== -1) {
            applyTheme(idx, true);
        }
    }
})();
