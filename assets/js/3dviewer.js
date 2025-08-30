const img = document.getElementById('legoImg');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const totalFrames = 5; // Update to your number of images
let currentFrame = 1;

// Debug: Check if elements are found
console.log('Elements found:', {
  img: !!img,
  prevBtn: !!prevBtn,
  nextBtn: !!nextBtn
});

function updateImage(frame) {
  const padded = String(frame).padStart(2, '0');
  img.src = `assets/build1_${padded}.jpg`;
}

function goToPrevious() {
  console.log('Previous clicked, current frame:', currentFrame);
  currentFrame = currentFrame === 1 ? totalFrames : currentFrame - 1;
  console.log('New frame:', currentFrame);
  updateImage(currentFrame);
}

function goToNext() {
  console.log('Next clicked, current frame:', currentFrame);
  currentFrame = currentFrame === totalFrames ? 1 : currentFrame + 1;
  console.log('New frame:', currentFrame);
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