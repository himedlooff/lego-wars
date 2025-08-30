// Simple 3D image rotator for Lego build
const img = document.getElementById('legoImg');
const totalFrames = 5; // Number of images you have (e.g. 24 photos around build)
let currentFrame = 1;
let dragging = false;
let lastX = 0;

function updateImage(frame) {
  // Pad frame number with zeros, e.g., 01, 02, ..., 24
  const padded = String(frame).padStart(2, '0');
  img.src = `assets/build1_${padded}.jpg`;
}

img.parentElement.addEventListener('mousedown', (e) => {
  dragging = true;
  lastX = e.clientX;
});
window.addEventListener('mouseup', () => {
  dragging = false;
});
window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  if (Math.abs(dx) > 8) { // Adjust sensitivity
    if (dx > 0) {
      currentFrame = currentFrame - 1;
      if (currentFrame < 1) currentFrame = totalFrames;
    } else {
      currentFrame = currentFrame + 1;
      if (currentFrame > totalFrames) currentFrame = 1;
    }
    updateImage(currentFrame);
    lastX = e.clientX;
  }
});

// Touch events for mobile
img.parentElement.addEventListener('touchstart', (e) => {
  dragging = true;
  lastX = e.touches[0].clientX;
});
window.addEventListener('touchend', () => {
  dragging = false;
});
window.addEventListener('touchmove', (e) => {
  if (!dragging) return;
  const dx = e.touches[0].clientX - lastX;
  if (Math.abs(dx) > 8) {
    if (dx > 0) {
      currentFrame = currentFrame - 1;
      if (currentFrame < 1) currentFrame = totalFrames;
    } else {
      currentFrame = currentFrame + 1;
      if (currentFrame > totalFrames) currentFrame = 1;
    }
    updateImage(currentFrame);
    lastX = e.touches[0].clientX;
  }
});
