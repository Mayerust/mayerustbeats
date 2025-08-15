//beats
const beats = [
  {
    id: 1,
    title: 'A SLEEP OF PARADISE',
    bpm: 98,
    key: 'Gbm',
    price: '₹5999',
    audio: 'assets/beats/asleepofparadise.mp3',
    artwork: 'assets/beats/asleepofparadise.jpg',
    duration: 195,
    genre: 'Hip-Hop'
  },
  {
    id: 2,
    title: 'ALLURE',
    bpm: 120,
    key: 'Ebm',
    price: '₹5999',
    audio: 'assets/beats/allure.mp3',
    artwork: 'assets/beats/allure.jpg',
    duration: 136,
    genre: 'Lo-Fi'
  },
  {
    id: 3,
    title: 'LUSTRE',
    bpm: 72,
    key: 'Abm',
    price: '₹5999',
    audio: 'assets/beats/lustre.mp3',
    artwork: 'assets/beats/lustre.jpg',
    duration: 136,
    genre: 'Lo-Fi'
  },
  {
    id: 4,
    title: 'EXQUISITE',
    bpm: 160,
    key: 'Ebm',
    price: '₹5999',
    audio: 'assets/beats/exquisite.mp3',
    artwork: 'assets/beats/exquisite.jpg',
    duration: 156,
    genre: 'Lo-Fi'
  },
  {
    id: 5,
    title: 'LONELY STARGAZING',
    bpm: 140,
    key: 'Bm',
    price: '₹5999',
    audio: 'assets/beats/lonelystargazing.mp3',
    artwork: 'assets/beats/lonelystargazing.jpg',
    duration: 109,
    genre: 'Commercial Pop'
  },
  {
    id: 6,
    title: 'STARLIGHT CASSETTE',
    bpm: 140,
    key: 'Am',
    price: 'NOT AVAILABLE',
    audio: 'assets/beats/starlightcassette.mp3',
    artwork: 'assets/beats/starlightcassette.jpg',
    duration: 82,
    genre: 'Commercial Hip-Hop'
  },
  {
    id: 7,
    title: 'BROKEN MIRRORS',
    bpm: 145,
    key: 'C#m',
    price: '₹5999',
    audio: 'assets/beats/brokenmirrors.mp3',
    artwork: 'assets/beats/brokenmirrors.jpg',
    duration: 53,
    genre: 'Lo-Fi'
  },
  {
    id: 8,
    title: 'HELPLESS',
    bpm: 150,
    key: 'AM',
    price: '₹5999',
    audio: 'assets/beats/helpless.mp3',
    artwork: 'assets/beats/helpless.jpg',
    duration: 166,
    genre: 'Drill'
  },
  {
    id: 9,
    title: 'LOST IN WOODS',
    bpm: 104,
    key: 'F#m',
    price: '₹5999',
    audio: 'assets/beats/lostinwoods.mp3',
    artwork: 'assets/beats/lostinwoods.jpg',
    duration: 195,
    genre: 'Synth-Pop'
  },
  {
    id: 10,
    title: 'IT WAS ALL A DREAM',
    bpm: 130,
    key: 'FM',
    price: '₹5999',
    audio: 'assets/beats/itwasalladream.mp3',
    artwork: 'assets/beats/itwasalladream.png',
    duration: 198,
    genre: 'Lo-Fi'
  },
  

];

let currentBeat = 0;
let audioPlayer = null;
let isPlaying = false;
let isLoading = false;
let progressInterval = null;


const elements = {
  playcard: document.getElementById('playcard'),
  beatArtwork: document.getElementById('beatArtwork'),
  beatTitle: document.getElementById('beatTitle'),
  beatInfo: document.getElementById('beatInfo'),
  beatPrice: document.getElementById('beatPrice'),
  beatDuration: document.getElementById('beatDuration'),
  beatCounter: document.getElementById('beatCounter'),
  durationSlider: document.getElementById('durationSlider'),
  playPauseBtn: document.getElementById('playPauseBtn'),
  purchaseBtn: document.getElementById('purchaseBtn'),
  prevBeatBtn: document.getElementById('prevBeat'),
  nextBeatBtn: document.getElementById('nextBeat'),
  hearMoreBtn: document.getElementById('hearMoreBtn'),
  audioPlayer: document.getElementById('audioPlayer')
};

// Fallback to placeholder if artwork fails to load
elements.beatArtwork.onerror = () => {
  elements.beatArtwork.src = 'assets/beats/placeholder.jpg';
};


function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 transform translate-x-full ${
    type==='success'? 'bg-beatGreen text-nintendoBg' :
    type==='error'? 'bg-red-500 text-white' :
    'bg-beatCyan text-nintendoBg'
  }`;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.classList.remove('translate-x-full'), 100);
  setTimeout(() => {
    notif.classList.add('translate-x-full');
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

function triggerGlitchEffect(el) {
  el.classList.add('animate-glitch');
  setTimeout(() => el.classList.remove('animate-glitch'), 300);
}


function initializeAudio(beat) {
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.src = '';
  }
  audioPlayer = elements.audioPlayer;
  audioPlayer.src = beat.audio;
  audioPlayer.preload = 'metadata';
  audioPlayer.addEventListener('loadedmetadata', () => {
    elements.durationSlider.max = Math.floor(audioPlayer.duration);
    updateDurationDisplay();
  });
  audioPlayer.addEventListener('timeupdate', updateProgress);
  audioPlayer.addEventListener('ended', handleAudioEnd);
  audioPlayer.addEventListener('loadstart', () => {
    isLoading = true;
    elements.playPauseBtn.textContent = '⏳';
  });
  audioPlayer.addEventListener('canplay', () => {
    isLoading = false;
    elements.playPauseBtn.textContent = isPlaying ? '⏸️' : '▶️';
  });
}

function togglePlayPause() {
  if (isLoading) return;
  if (!audioPlayer || !audioPlayer.src) {
    showNotification('Audio not loaded', 'error');
    return;
  }
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    elements.playPauseBtn.textContent = '▶️';
    clearInterval(progressInterval);
  } else {
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        elements.playPauseBtn.textContent = '⏸️';
        startProgressTracking();
        showNotification('Playing: ' + beats[currentBeat].title, 'success');
      }).catch(error => {
        console.error('Audio play failed:', error);
        showNotification('Playback failed', 'error');
      });
    }
  }
}

function updateProgress() {
  if (audioPlayer && !isNaN(audioPlayer.currentTime)) {
    elements.durationSlider.value = Math.floor(audioPlayer.currentTime);
    updateDurationDisplay();
  }
}

function updateDurationDisplay() {
  if (audioPlayer) {
    const current = formatTime(audioPlayer.currentTime);
    const total = formatTime(audioPlayer.duration);
    elements.beatDuration.textContent = `${current} / ${total}`;
  }
}

function handleAudioEnd() {
  isPlaying = false;
  elements.playPauseBtn.textContent = '▶️';
  elements.durationSlider.value = 0;
  clearInterval(progressInterval);
  showNotification('Track ended', 'info');
}

function startProgressTracking() {
  progressInterval = setInterval(updateProgress, 100);
}


function loadBeat(index, direction = 0) {
  if (index < 0 || index >= beats.length) return;
  if (audioPlayer) {
    audioPlayer.pause();
    isPlaying = false;
    clearInterval(progressInterval);
  }
  const beat = beats[index];
  elements.beatArtwork.src = beat.artwork;
  elements.beatTitle.textContent = beat.title;
  elements.beatInfo.textContent = `BPM: ${beat.bpm} | KEY: ${beat.key} | ${beat.genre}`;
  elements.beatPrice.textContent = beat.price;
  elements.beatCounter.textContent = `${index + 1}/${beats.length}`;
  elements.beatDuration.textContent = `00:00 / ${formatTime(beat.duration)}`;
  elements.durationSlider.value = 0;
  elements.playPauseBtn.textContent = '▶️';
  initializeAudio(beat);
  animateCard(direction);
  updateNavigationButtons();
  updateHearMoreButton();
}

function animateCard(direction) {
  const pc = elements.playcard;
  pc.classList.remove('animate-cardIn', 'animate-slideInRight', 'animate-slideInLeft');
  void pc.offsetWidth;
  if (direction > 0) pc.classList.add('animate-slideInRight');
  else if (direction < 0) pc.classList.add('animate-slideInLeft');
  else pc.classList.add('animate-cardIn');
}

function updateNavigationButtons() {
  elements.prevBeatBtn.disabled = currentBeat === 0;
  elements.prevBeatBtn.classList.toggle('opacity-50', currentBeat === 0);
  const isLastBeat = currentBeat === beats.length - 1;
  elements.nextBeatBtn.disabled = isLastBeat;
  elements.nextBeatBtn.style.display = isLastBeat ? 'none' : 'block';
}

function updateHearMoreButton() {
  const isLastBeat = currentBeat === beats.length - 1;
  elements.hearMoreBtn.classList.toggle('hidden', !isLastBeat);
}

function navigateToBeat(direction) {
  const newIndex = currentBeat + direction;
  if (newIndex >= 0 && newIndex < beats.length) {
    currentBeat = newIndex;
    loadBeat(currentBeat, direction);
    triggerGlitchEffect(direction > 0 ? elements.nextBeatBtn : elements.prevBeatBtn);
  }
}


function initializeEventListeners() {
  elements.playPauseBtn.addEventListener('click', togglePlayPause);
  elements.prevBeatBtn.addEventListener('click', () => navigateToBeat(-1));
  elements.nextBeatBtn.addEventListener('click', () => navigateToBeat(1));
  elements.durationSlider.addEventListener('input', (e) => {
    if (audioPlayer && !isNaN(audioPlayer.duration)) {
      audioPlayer.currentTime = parseInt(e.target.value);
      updateDurationDisplay();
    }
  });


  elements.purchaseBtn.addEventListener('click', () => {
    const beat = beats[currentBeat];
    const instagramUrl = "https://www.instagram.com/mayerustt?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
    const proceed = confirm(
      `To purchase “${beat.title}” for ${beat.price}, please contact me on Instagram.\n\n` +
      `Would you like to open my Instagram profile now?`
    );
    if (proceed) {
      window.open(instagramUrl, "_blank");
    } else {
      showNotification("Purchase canceled. Feel free to reach out on Instagram anytime.", "info");
    }
  });

  document.addEventListener('keydown', handleKeyboardControls);

  // Touch swipe support
  let touchStartX = 0;
  elements.playcard.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  elements.playcard.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      navigateToBeat(diff > 0 ? 1 : -1);
    }
  });
}

function handleKeyboardControls(e) {
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      navigateToBeat(-1);
      break;
    case 'ArrowRight':
      e.preventDefault();
      navigateToBeat(1);
      break;
    case ' ':
      e.preventDefault();
      togglePlayPause();
      break;
    case 'Escape':
      if (isPlaying) togglePlayPause();
      break;
  }
}


function initializeApp() {
  console.log('🎵 Mayerust Beats Portfolio Initialized');
  console.log(`📀 Loaded ${beats.length} beats`);
  if (beats.length === 0) {
    showNotification('No beats available', 'error');
    return;
  }
  initializeEventListeners();
  loadBeat(0);
  setTimeout(() => showNotification('Welcome to Mayerust Beats! 🎵', 'success'), 2000);
}

document.addEventListener('DOMContentLoaded', initializeApp);

// Expose for console access
window.MayerustBeats = {
  addBeat,
  removeBeat,
  updateBeat,
  getBeatById,
  beats: () => [...beats],
  currentBeat: () => currentBeat,
  isPlaying: () => isPlaying
};

// Global error handling
window.addEventListener('error', e => {
  console.error('Application error:', e.error);
  showNotification('An error occurred', 'error');
});
window.addEventListener('unhandledrejection', e => {
  console.error('Unhandled promise rejection:', e.reason);
  showNotification('Something went wrong', 'error');
});
