const img = document.getElementById('legoImg');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const totalFrames = 13; // Update to your number of images
let currentFrame = 1;

function updateImage(frame) {
  const padded = String(frame).padStart(2, '0');
  img.src = `assets/build1_${padded}.jpg`;
}

function goToPrevious() {
  currentFrame = currentFrame === 1 ? totalFrames : currentFrame - 1;
  updateImage(currentFrame);
}

function goToNext() {
  currentFrame = currentFrame === totalFrames ? 1 : currentFrame + 1;
  updateImage(currentFrame);
}

// Button event listeners
prevBtn.addEventListener('click', goToPrevious);
nextBtn.addEventListener('click', goToNext);

// Keyboard navigation (optional)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    goToPrevious();
  } else if (e.key === 'ArrowRight') {
    goToNext();
  }
});

// Prevent any dragging on the image
img.addEventListener('dragstart', (e) => {
  e.preventDefault();
});