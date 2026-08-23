// --- Good Night Lock for Neha Script ---

// -------------------------------------------------------------
// 📲 YOUR WHATSAPP NUMBER CONFIGURATION
// Replace "91XXXXXXXXXX" below with your full phone number including country code (without + or spaces, e.g. "919876543210")
// Or pass it in URL like: https://yourpage.com/?phone=919876543210
// -------------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
let targetPhone = urlParams.get('phone') || "91XXXXXXXXXX"; 

let selectedPhotoDataUrl = null;
let webcamStream = null;
let kissCount = 0;
let isAudioPlaying = false;
let audioContext = null;
let lullabyTimer = null;

// DOM Elements
const lockedSection = document.getElementById('lockedSection');
const unlockedSection = document.getElementById('unlockedSection');
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const changePhotoBtn = document.getElementById('changePhotoBtn');

const openCameraBtn = document.getElementById('openCameraBtn');
const cameraModal = document.getElementById('cameraModal');
const closeCameraBtn = document.getElementById('closeCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const webcam = document.getElementById('webcam');
const photoCanvas = document.getElementById('photoCanvas');

const unlockBtn = document.getElementById('unlockBtn');
const warningPopup = document.getElementById('warningPopup');
const warningMessage = document.getElementById('warningMessage');

const scannerModal = document.getElementById('scannerModal');
const scannerImg = document.getElementById('scannerImg');
const scanProgressBar = document.getElementById('scanProgressBar');
const scanStatusText = document.getElementById('scanStatusText');
const scanResultBadge = document.getElementById('scanResultBadge');

const unlockedUserPhoto = document.getElementById('unlockedUserPhoto');
const kissCounter = document.getElementById('kissCounter');
const sendKissBtn = document.getElementById('sendKissBtn');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');
const whatsappShareBtn = document.getElementById('whatsappShareBtn');

// Playful warning messages list
const warningList = [
  "Hold on Neha! 🛑 No cute picture, no Good Night wish! Upload a selfie first! 📸",
  "Nice try sneaky! 😜 System requires 1 cute photo to proceed!",
  "Good Night wish from Priyansh is strictly locked! 🔒 Please attach a pic ❤️",
  "0% Cuteness detected in upload box! Send a pic to verify! 💕",
  "Come on Neha! Don't try to cheat the lock! 📸✨"
];

// --- 1. FILE UPLOAD & DRAG DROP ---
uploadBox.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    handlePhotoFile(e.target.files[0]);
  }
});

uploadBox.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadBox.classList.add('border-pink-400', 'bg-pink-950/40');
});

uploadBox.addEventListener('dragleave', () => {
  uploadBox.classList.remove('border-pink-400', 'bg-pink-950/40');
});

uploadBox.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadBox.classList.remove('border-pink-400', 'bg-pink-950/40');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handlePhotoFile(e.dataTransfer.files[0]);
  }
});

changePhotoBtn.addEventListener('click', () => {
  fileInput.click();
});

function handlePhotoFile(file) {
  const reader = new FileReader();
  reader.onload = function (event) {
    setPhotoData(event.target.result);
  };
  reader.readAsDataURL(file);
}

function setPhotoData(dataUrl) {
  selectedPhotoDataUrl = dataUrl;
  imagePreview.src = dataUrl;
  imagePreviewContainer.classList.remove('hidden');
  uploadBox.classList.add('hidden');
  warningPopup.classList.add('hidden');
}

// --- 2. WEBCAM SELFIE SNAPSHOT ---
openCameraBtn.addEventListener('click', async () => {
  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    });
    webcam.srcObject = webcamStream;
    cameraModal.classList.remove('hidden');
  } catch (err) {
    alert("Camera permission denied or camera not found. Please upload a photo from your gallery instead!");
  }
});

closeCameraBtn.addEventListener('click', stopWebcam);

function stopWebcam() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  cameraModal.classList.add('hidden');
}

captureBtn.addEventListener('click', () => {
  const context = photoCanvas.getContext('2d');
  photoCanvas.width = webcam.videoWidth || 640;
  photoCanvas.height = webcam.videoHeight || 480;

  // Mirror camera capture
  context.translate(photoCanvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(webcam, 0, 0, photoCanvas.width, photoCanvas.height);

  const capturedDataUrl = photoCanvas.toDataURL('image/jpeg');
  setPhotoData(capturedDataUrl);
  stopWebcam();
});

// --- 3. UNLOCK & SCANNER LOGIC ---
unlockBtn.addEventListener('click', () => {
  if (!selectedPhotoDataUrl) {
    // Show playful warning and shake card
    const randomMsg = warningList[Math.floor(Math.random() * warningList.length)];
    warningMessage.innerText = randomMsg;
    warningPopup.classList.remove('hidden');
    
    lockedSection.classList.remove('animate-shake');
    void lockedSection.offsetWidth; // Trigger reflow
    lockedSection.classList.add('animate-shake');
    return;
  }

  // Photo exists! Trigger Scanner Sequence
  startCutenessScan();
});

function startCutenessScan() {
  scannerImg.src = selectedPhotoDataUrl;
  scanProgressBar.style.width = '0%';
  scanStatusText.innerText = "Initializing facial cuteness scan...";
  scanResultBadge.classList.add('hidden');
  scannerModal.classList.remove('hidden');

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    scanProgressBar.style.width = progress + '%';

    if (progress === 30) {
      scanStatusText.innerText = "Scanning cheeks & beautiful eyes...";
    } else if (progress === 60) {
      scanStatusText.innerText = "Measuring smile cuteness ratio...";
    } else if (progress === 90) {
      scanStatusText.innerText = "Calculating total adorable score...";
    } else if (progress >= 100) {
      clearInterval(interval);
      scanStatusText.innerText = "Access Granted! 💖";
      scanResultBadge.classList.remove('hidden');

      setTimeout(() => {
        scannerModal.classList.add('hidden');
        unlockGoodNightView();
      }, 1500);
    }
  }, 250);
}

function unlockGoodNightView() {
  lockedSection.classList.add('hidden');
  unlockedUserPhoto.src = selectedPhotoDataUrl;
  unlockedSection.classList.remove('hidden');

  // Trigger floating hearts particle animation
  initHeartCanvas();

  // Play subtle chime sound
  playChimeSound();
  
  // Strictly no automatic redirects!
}

// --- 4. MANUAL WHATSAPP REDIRECTION (ONLY RUNS ON BUTTON TAP) ---
function openDirectWhatsAppLink() {
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
  const textMsg = encodeURIComponent("Hey Priyansh! Here is my cute selfie for my Good Night wish! 📸💕\nCuteness Rating: 10,000/10! 👑✨");
  
  let targetUrl = `https://api.whatsapp.com/send?text=${textMsg}`;
  if (cleanPhone && cleanPhone !== "91XXXXXXXXXX") {
    targetUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${textMsg}`;
  }
  
  window.open(targetUrl, '_blank');
}

whatsappShareBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (navigator.share && selectedPhotoDataUrl) {
    fetch(selectedPhotoDataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'neha_cute_selfie.jpg', { type: 'image/jpeg' });
        navigator.share({
          title: 'Neha\'s Cute Selfie for Priyansh 📸',
          text: 'Hey Priyansh! Here is my cute selfie for my Good Night wish! 📸💕\nCuteness Rating: 10,000/10! 👑✨',
          files: [file]
        }).catch(() => {
          openDirectWhatsAppLink();
        });
      })
      .catch(() => openDirectWhatsAppLink());
  } else {
    openDirectWhatsAppLink();
  }
});

// --- 5. INTERACTIVE LOVE CARDS ---
function toggleCard(cardElement) {
  const front = cardElement.querySelector('.card-front');
  const back = cardElement.querySelector('.card-back');

  if (front.classList.contains('hidden')) {
    front.classList.remove('hidden');
    back.classList.add('hidden');
    cardElement.classList.remove('bg-pink-900/40', 'border-pink-400');
  } else {
    front.classList.add('hidden');
    back.classList.remove('hidden');
    cardElement.classList.add('bg-pink-900/40', 'border-pink-400');
  }
}

// --- 6. VIRTUAL KISS COUNTER ---
sendKissBtn.addEventListener('click', (e) => {
  kissCount++;
  kissCounter.innerText = kissCount;

  // Create floating kiss emoji
  const kiss = document.createElement('div');
  kiss.className = 'floating-kiss';
  kiss.innerText = '💋';

  const rect = sendKissBtn.getBoundingClientRect();
  const randomOffsetX = (Math.random() - 0.5) * 100;
  kiss.style.left = `${rect.left + rect.width / 2 + randomOffsetX}px`;
  kiss.style.top = `${rect.top}px`;

  document.body.appendChild(kiss);

  setTimeout(() => {
    kiss.remove();
  }, 1500);
});

// --- 7. BACKGROUND STARRY CANVAS ---
const starCanvas = document.getElementById('starCanvas');
const starCtx = starCanvas.getContext('2d');
let stars = [];

function resizeStarCanvas() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  createStars();
}

function createStars() {
  stars = [];
  const starCount = Math.floor((starCanvas.width * starCanvas.height) / 3000);
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * starCanvas.width,
      y: Math.random() * starCanvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005
    });
  }
}

function drawStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach(star => {
    star.alpha += star.speed;
    if (star.alpha > 1 || star.alpha < 0) {
      star.speed = -star.speed;
    }
    starCtx.beginPath();
    starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starCtx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, star.alpha)})`;
    starCtx.fill();
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', resizeStarCanvas);
resizeStarCanvas();
drawStars();

// --- 8. FLOATING HEART CANVAS (UNLOCKED VIEW) ---
let hearts = [];
function initHeartCanvas() {
  const heartCanvas = document.getElementById('heartCanvas');
  if (!heartCanvas) return;
  const ctx = heartCanvas.getContext('2d');

  heartCanvas.width = unlockedSection.offsetWidth;
  heartCanvas.height = unlockedSection.offsetHeight;

  for (let i = 0; i < 25; i++) {
    hearts.push({
      x: Math.random() * heartCanvas.width,
      y: heartCanvas.height + Math.random() * 100,
      size: Math.random() * 15 + 10,
      speedY: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3
    });
  }

  function renderHearts() {
    ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
    hearts.forEach(h => {
      h.y -= h.speedY;
      if (h.y < -20) {
        h.y = heartCanvas.height + 20;
        h.x = Math.random() * heartCanvas.width;
      }
      ctx.fillStyle = `rgba(244, 63, 94, ${h.opacity})`;
      ctx.font = `${h.size}px serif`;
      ctx.fillText('❤️', h.x, h.y);
    });
    requestAnimationFrame(renderHearts);
  }
  renderHearts();
}

// --- 9. AUDIO LULLABY SYNTHESIZER ---
musicToggleBtn.addEventListener('click', () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (isAudioPlaying) {
    stopLullaby();
  } else {
    startLullaby();
  }
});

function startLullaby() {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  isAudioPlaying = true;
  musicIcon.className = "fa-solid fa-volume-high text-pink-400 animate-pulse";
  musicText.innerText = "Pause Ambient Lullaby";

  // Pentatonic scale notes (C4, D4, E4, G4, A4, C5)
  const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];

  lullabyTimer = setInterval(() => {
    if (!isAudioPlaying) return;
    const freq = notes[Math.floor(Math.random() * notes.length)];
    playSoftTone(freq, 2.5);
  }, 1200);
}

function stopLullaby() {
  isAudioPlaying = false;
  if (lullabyTimer) clearInterval(lullabyTimer);
  musicIcon.className = "fa-solid fa-music text-pink-400";
  musicText.innerText = "Play Ambient Lullaby";
}

function playSoftTone(freq, duration) {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioContext.currentTime);

  gain.gain.setValueAtTime(0.001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + duration);
}

function playChimeSound() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  [440, 554.37, 659.25, 880].forEach((freq, index) => {
    setTimeout(() => {
      playSoftTone(freq, 2.0);
    }, index * 200);
  });
}
