// CONFIGURATION
// To receive Neha's wishes directly in your email, get a free Access Key from https://web3forms.com/
// and paste it below. (It's free, instant, and requires no registration/account creation!).
const WEB3FORMS_ACCESS_KEY = "ac0eed25-47fa-466a-a1d0-f24b8da3a7c7";

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------
    // 1. STATE & VARIABLES
    // ----------------------------------------------------------------
    let audioCtx = null;
    let musicInterval = null;
    let isPlaying = false;
    let currentNoteIndex = 0;
    
    const thoughts = [
        "Every single day with you is my new favorite adventure. ❤️",
        "You are the sweetest part of my day, and the best part of my thoughts. ✨",
        "I love you more than all the twinkling stars in the night sky. 🌌",
        "I'm so incredibly lucky to have you in my life. You are my home. 🏠💕",
        "Just a reminder: you make my world so much brighter. 🌸",
        "Can't wait to see your beautiful smile tomorrow. Sleep tight! 😊"
    ];

    // Lullaby Melody (gentle music box arpeggio)
    const melody = [
        [329.63, 1], // E4
        [392.00, 1], // G4
        [523.25, 2], // C5
        [493.88, 1], // B4
        [392.00, 1], // G4
        [440.00, 2], // A4
        
        [329.63, 1], // E4
        [349.23, 1], // F4
        [392.00, 2], // G4
        [293.66, 1], // D4
        [329.63, 1], // E4
        [261.63, 2], // C4

        [440.00, 1], // A4
        [523.25, 1], // C5
        [659.25, 2], // E5
        [587.33, 1], // D5
        [493.88, 1], // B4
        [392.00, 2], // G4

        [349.23, 1], // F4
        [392.00, 1], // G4
        [440.00, 2], // A4
        [293.66, 2]  // D4
    ];

    // DOM Elements
    const starfield = document.getElementById('starfield');
    const starMessage = document.getElementById('star-message');
    const envelope = document.getElementById('envelope');
    const seal = document.getElementById('envelope-seal');
    const musicToggle = document.getElementById('music-toggle');
    const wishInput = document.getElementById('wish-input');
    const wishBtn = document.getElementById('wish-btn');
    const soundModal = document.getElementById('sound-modal');
    const modalYes = document.getElementById('modal-yes');
    const modalNo = document.getElementById('modal-no');

    // ----------------------------------------------------------------
    // 2. DYNAMIC STARFIELD
    // ----------------------------------------------------------------
    const numNormalStars = 80;
    const numInteractiveStars = thoughts.length;

    // Normal decorative stars
    for (let i = 0; i < numNormalStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 2 + 1; // 1px to 3px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 80}%`; // Keep them mostly in upper sky
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        starfield.appendChild(star);
    }

    // Interactive glowing stars
    thoughts.forEach((thought, idx) => {
        const star = document.createElement('div');
        star.classList.add('star', 'star-interactive');
        const size = 6; 
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${10 + Math.random() * 80}%`; // Avoid screen borders
        star.style.top = `${15 + Math.random() * 45}%`;  // Upper visual area
        star.style.animationDelay = `${idx * 0.5}s`;
        
        star.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid spawning click particles
            displayThought(thought);
            playMusicBoxChime(400 + Math.random() * 400); // Quick magical chime frequency
            spawnHeartBurst(e.clientX, e.clientY, 8);
        });

        starfield.appendChild(star);
    });

    function displayThought(text) {
        starMessage.style.opacity = 0;
        starMessage.style.transform = 'translateY(5px)';
        setTimeout(() => {
            starMessage.innerText = text;
            starMessage.style.opacity = 1;
            starMessage.style.transform = 'translateY(0)';
        }, 300);
    }

    // ----------------------------------------------------------------
    // 3. CANVAS HEARTS PARTICLES
    // ----------------------------------------------------------------
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class HeartParticle {
        constructor(x, y, size = null) {
            this.x = x;
            this.y = y;
            this.size = size || Math.random() * 12 + 6;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = -Math.random() * 2 - 1; // Always float up
            this.opacity = 1;
            this.fadeSpeed = Math.random() * 0.015 + 0.005;
            this.wobble = Math.random() * 100;
            this.wobbleSpeed = Math.random() * 0.05 + 0.02;
            
            // Random romantic hues
            const colors = [
                'rgba(244, 114, 182, ', // Pink
                'rgba(225, 29, 72, ',   // Rose
                'rgba(192, 132, 252, ', // Purple
                'rgba(251, 113, 133, '  // Soft red
            ];
            this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx + Math.sin(this.wobble) * 0.4;
            this.y += this.vy;
            this.wobble += this.wobbleSpeed;
            this.opacity -= this.fadeSpeed;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = `${this.colorPrefix}${this.opacity})`;
            ctx.beginPath();
            
            const x = this.x;
            const y = this.y;
            const size = this.size;

            ctx.moveTo(x, y - size / 4);
            ctx.bezierCurveTo(x + size / 2, y - size / 2, x + size, y - size / 6, x, y + size);
            ctx.bezierCurveTo(x - size, y - size / 6, x - size / 2, y - size / 2, x, y - size / 4);
            
            ctx.fill();
            ctx.restore();
        }
    }

    function spawnHeartBurst(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            particles.push(new HeartParticle(x, y));
        }
    }

    // Animate loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (particles[i].opacity <= 0) {
                particles.splice(i, 1);
            } else {
                particles[i].draw();
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Spawn hearts on general click
    document.addEventListener('click', (e) => {
        // Don't spawn if clicking interactive elements
        if (e.target.closest('#envelope-seal') || 
            e.target.closest('#music-toggle') || 
            e.target.closest('#wish-btn') || 
            e.target.closest('#wish-input') || 
            e.target.closest('.modal-content')
        ) {
            return;
        }
        spawnHeartBurst(e.clientX, e.clientY, 5);
        playMusicBoxChime(600 + Math.random() * 600, 0.05); // Tiny high chime
    });

    // ----------------------------------------------------------------
    // 4. MUSIC BOX SYNTHESIZER
    // ----------------------------------------------------------------
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Play a single Music Box metallic bell note
    function playMusicBoxChime(frequency, volume = 0.15, decay = 1.2) {
        if (!audioCtx) return;
        
        const now = audioCtx.currentTime;
        
        // Primary Warm Triangle Osc
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, now);

        // High frequency resonance chime
        const overtone = audioCtx.createOscillator();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(frequency * 2, now);

        // Gain Nodes
        const gainNode = audioCtx.createGain();
        const overtoneGain = audioCtx.createGain();

        // Music Box envelope: Instantly clicks, then fades out gently
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        // Overtone envelope: sharper decay
        overtoneGain.gain.setValueAtTime(0, now);
        overtoneGain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.005);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + decay * 0.4);

        // Filter out muddy sub-low frequencies
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(150, now);

        // Connect nodes
        osc.connect(gainNode);
        overtone.connect(overtoneGain);
        
        gainNode.connect(filter);
        overtoneGain.connect(filter);
        
        filter.connect(audioCtx.destination);

        // Start and stop playbacks
        osc.start(now);
        overtone.start(now);

        osc.stop(now + decay);
        overtone.stop(now + decay);
    }

    function playMelodyLoop() {
        const note = melody[currentNoteIndex];
        const freq = note[0];
        const duration = note[1] * 800; // base beat length is 800ms

        playMusicBoxChime(freq, 0.15, 1.8);

        // Move to next note
        currentNoteIndex = (currentNoteIndex + 1) % melody.length;

        // Schedule next note execution
        musicInterval = setTimeout(playMelodyLoop, duration);
    }

    function startLullaby() {
        initAudio();
        isPlaying = true;
        musicToggle.classList.add('active');
        musicToggle.querySelector('.music-text').innerText = "Lullaby On";
        currentNoteIndex = 0;
        playMelodyLoop();
    }

    function stopLullaby() {
        isPlaying = false;
        musicToggle.classList.remove('active');
        musicToggle.querySelector('.music-text').innerText = "Lullaby Off";
        if (musicInterval) {
            clearTimeout(musicInterval);
        }
    }

    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        initAudio();
        if (isPlaying) {
            stopLullaby();
        } else {
            startLullaby();
        }
    });

    // ----------------------------------------------------------------
    // 5. ENVELOPE SEAL INTERACTION
    // ----------------------------------------------------------------
    seal.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Show envelope open animation
        envelope.classList.add('open');
        
        // Trigger hearts burst above the envelope
        const rect = envelope.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 3;
        
        spawnHeartBurst(centerX, centerY, 25);
        
        // Play romantic chord chime
        initAudio();
        if (audioCtx) {
            setTimeout(() => playMusicBoxChime(261.63, 0.12), 0);   // C4
            setTimeout(() => playMusicBoxChime(329.63, 0.12), 100); // E4
            setTimeout(() => playMusicBoxChime(392.00, 0.12), 200); // G4
            setTimeout(() => playMusicBoxChime(523.25, 0.18), 300); // C5 (loudest)
        }
        
        // Suggest star-clicking for interaction
        setTimeout(() => {
            displayThought("The night sky is magical. Try clicking on a glowing star... ✨");
        }, 1500);
    });

    // ----------------------------------------------------------------
    // 6. MAKE A WISH
    // ----------------------------------------------------------------
    wishBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wishText = wishInput.value.trim();
        
        if (!wishText) return;

        // Reset input
        wishInput.value = '';
        wishInput.blur();

        // 1. Create a dynamic shooting star
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('shooting-star');
        shootingStar.style.top = `${10 + Math.random() * 20}%`;
        shootingStar.style.right = `${10 + Math.random() * 20}%`;
        document.body.appendChild(shootingStar);
        
        // Remove after animation finishes
        setTimeout(() => {
            shootingStar.remove();
        }, 1600);

        // 2. Play high-pitch chime
        initAudio();
        if (audioCtx) {
            playMusicBoxChime(880.00, 0.1, 1.5); // A5 chime
            setTimeout(() => playMusicBoxChime(1046.50, 0.15, 2.0), 150); // C6 chime
        }

        // 3. Spawn a burst of hearts
        spawnHeartBurst(window.innerWidth / 2, window.innerHeight * 0.4, 20);

        // 4. Update the star message bubble with romantic feedback
        setTimeout(() => {
            displayThought(`Your wish has been sent to the stars. May it come true! ✨`);
        }, 400);

        // 5. Silent Background API Submission
        if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== "YOUR_ACCESS_KEY_HERE") {
            sendWishToEmail(wishText);
        }
    });

    function sendWishToEmail(wish) {
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: 'New Wish from Neha! ✨',
                from_name: 'Good Night App',
                message: `Neha made a wish on the stars: \n\n"${wish}"`
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Wish captured successfully:', data);
        })
        .catch(error => {
            console.error('Error capturing wish:', error);
        });
    }

    // Support sending wish with Enter key
    wishInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            wishBtn.click();
        }
    });

    // ----------------------------------------------------------------
    // 7. INITIAL SOUND PROMPT MODAL
    // ----------------------------------------------------------------
    setTimeout(() => {
        soundModal.classList.add('show');
    }, 1000);

    modalYes.addEventListener('click', () => {
        soundModal.classList.remove('show');
        startLullaby();
    });

    modalNo.addEventListener('click', () => {
        soundModal.classList.remove('show');
    });
});
