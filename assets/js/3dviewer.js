const img = document.getElementById('legoImg');
const totalFrames = 5; // Update to your number of images
let currentFrame = 1;
let dragging = false;
let startX = 0;
let lastFrame = 1;
const sensitivity = 6; // Lower is more sensitive

function updateImage(frame) {
  const padded = String(frame).padStart(2, '0');
  img.src = `assets/build1_${padded}.jpg`;
}

// --- Desktop Mouse Events ---
img.parentElement.addEventListener('mousedown', (e) => {
  dragging = true;
  startX = e.clientX;
  lastFrame = currentFrame;
  e.preventDefault();
});
window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - startX;
  const frameShift = Math.round(dx / sensitivity);
  let nextFrame = lastFrame - frameShift;
  while (nextFrame < 1) nextFrame += totalFrames;
  while (nextFrame > totalFrames) nextFrame -= totalFrames;
  if (nextFrame !== currentFrame) {
    currentFrame = nextFrame;
    updateImage(currentFrame);
  }
});
window.addEventListener('mouseup', () => {
  dragging = false;
});

// --- Touch Events for Mobile ---
img.parentElement.addEventListener('touchstart', (e) => {
  dragging = true;
  startX = e.touches[0].clientX;
  lastFrame = currentFrame;
  e.preventDefault();
}, { passive: false });
window.addEventListener('touchmove', (e) => {
  if (!dragging) return;
  const dx = e.touches[0].clientX - startX;
  const frameShift = Math.round(dx / sensitivity);
  let nextFrame = lastFrame - frameShift;
  while (nextFrame < 1) nextFrame += totalFrames;
  while (nextFrame > totalFrames) nextFrame -= totalFrames;
  if (nextFrame !== currentFrame) {
    currentFrame = nextFrame;
    updateImage(currentFrame);
  }
  e.preventDefault();
}, { passive: false });
window.addEventListener('touchend', () => {
  dragging = false;
});