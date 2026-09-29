const backgroundVideo = document.getElementById('myVideo');
const videoSource = backgroundVideo.querySelector('source');
const motionToggle = document.getElementById('motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let wantsMotion = !reducedMotion.matches && !navigator.connection?.saveData;

function updateMotionLabel() {
    const label = wantsMotion ? 'Pausar fondo animado' : 'Reproducir fondo animado';
    motionToggle.setAttribute('aria-label', label);
    motionToggle.title = label;
    motionToggle.dataset.playing = String(wantsMotion);
}

function syncBackgroundVideo() {
    updateMotionLabel();

    if (!wantsMotion || document.hidden) {
        backgroundVideo.pause();
        return;
    }

    if (!videoSource.src) {
        videoSource.src = videoSource.dataset.src;
        backgroundVideo.load();
    }

    backgroundVideo.play().catch(() => {
        wantsMotion = false;
        updateMotionLabel();
    });
}

motionToggle.hidden = false;
motionToggle.addEventListener('click', () => {
    wantsMotion = !wantsMotion;
    syncBackgroundVideo();
});
document.addEventListener('visibilitychange', syncBackgroundVideo);
reducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
        wantsMotion = false;
        syncBackgroundVideo();
    }
});
syncBackgroundVideo();

if (window.AOS && !reducedMotion.matches) {
    AOS.init({ once: false });
}

const form = document.getElementById('contact_form');
const status = document.getElementById('alerta');
const statusText = document.getElementById('alerta-text');
let statusTimer;
let hideTimer;

function showStatus(message) {
    clearTimeout(statusTimer);
    clearTimeout(hideTimer);
    status.hidden = false;
    statusText.textContent = message;
    requestAnimationFrame(() => status.classList.add('is-visible'));

    statusTimer = setTimeout(() => {
        status.classList.remove('is-visible');
        hideTimer = setTimeout(() => { status.hidden = true; }, 400);
    }, 3200);
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = ['name_input', 'email_input', 'message_input']
        .map((id) => document.getElementById(id));

    if (fields.some((field) => !field.value.trim())) {
        showStatus('Por favor, completá todos los campos.');
        return;
    }

    showStatus('Demo: los datos son válidos. No se envió ningún mensaje.');
    form.reset();
});
