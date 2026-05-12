// spotify.js — notifications + friends panes, draggable, with Listen Now playback
// Requires GSAP + Draggable loaded on the page.
gsap.registerPlugin(Draggable);

/* ---------- Hardcoded track ---------- */
const HARDSTONE_PINK = {
  src: 'audio/hardstone-pink.mp3', // <-- put your mp3 here (relative to index.html)
  title: 'HARDSTONE PINK',
  artist: 'Don Toliver',
  cover: 'covers/hardstone.jpg'
};

/* ---------- Audio element (created once) ---------- */
let audio = document.getElementById('app-audio');
if (!audio) {
  audio = document.createElement('audio');
  audio.id = 'app-audio';
  audio.preload = 'metadata';
  document.body.appendChild(audio);
}

function playHardstonePink() {
  if (audio.src.indexOf(HARDSTONE_PINK.src) === -1) {
    audio.src = HARDSTONE_PINK.src;
  }
  audio.play().catch(err => console.warn('Playback blocked:', err));

  // Optional: update the bottom player meta if those nodes exist
  const titleEl = document.querySelector('.player .now-title, .nowplaying-title');
  const artistEl = document.querySelector('.player .now-artist, .nowplaying-artist');
  const coverEl = document.querySelector('.player .now-cover, .nowplaying-cover');
  if (titleEl)  titleEl.textContent = HARDSTONE_PINK.title;
  if (artistEl) artistEl.textContent = HARDSTONE_PINK.artist;
  if (coverEl)  coverEl.setAttribute('src', HARDSTONE_PINK.cover);
}

/* ---------- Pane helpers ---------- */
function openPane(pane) {
  pane.classList.add('is-open');
  gsap.fromTo(pane,
    { autoAlpha: 0, y: 20, scale: 0.98 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
  );
}

function closePane(pane) {
  gsap.to(pane, {
    autoAlpha: 0, y: 20, scale: 0.98, duration: 0.25, ease: 'power2.in',
    onComplete: () => pane.classList.remove('is-open')
  });
}

function togglePane(pane) {
  if (pane.classList.contains('is-open')) closePane(pane);
  else openPane(pane);
}

/* ---------- Wire up panes ---------- */
const notifPane   = document.getElementById('notif-pane');
const friendsPane = document.getElementById('friends-pane');

const notifBtn   = document.getElementById('notif-btn');   // bell icon in topbar
const friendsBtn = document.getElementById('friends-btn'); // friends icon in topbar

if (notifBtn && notifPane)   notifBtn.addEventListener('click', () => togglePane(notifPane));
if (friendsBtn && friendsPane) friendsBtn.addEventListener('click', () => togglePane(friendsPane));

// Close buttons (minimize / cross) inside each pane
document.querySelectorAll('[data-pane-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    const pane = btn.closest('.pane');
    if (pane) closePane(pane);
  });
});

// Listen Now button(s) inside notifications pane
document.querySelectorAll('[data-action="listen-now"]').forEach(btn => {
  btn.addEventListener('click', playHardstonePink);
});

/* ---------- Make panes draggable by their header ---------- */
[notifPane, friendsPane].forEach(pane => {
  if (!pane) return;
  Draggable.create(pane, {
    type: 'x,y',
    trigger: pane.querySelector('.pane-header'),
    bounds: window,
    inertia: false,
    edgeResistance: 0.7
  });
});
