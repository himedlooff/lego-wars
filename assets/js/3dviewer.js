// Pixels of horizontal drag that advance one frame.
const DRAG_STEP_PX = 30;

class BuildViewer {
  constructor(build, template) {
    this.build = build;
    this.currentFrame = 1;
    this.element = template.cloneNode(true);

    // Remove template ID and show the element
    this.element.removeAttribute('id');
    this.element.style.display = '';

    // Store DOM elements as instance properties
    this.viewer = this.element.querySelector('.lego-3d-viewer');
    this.img = this.element.querySelector('.lego-img');
    this.prevBtn = this.element.querySelector('.prev-btn');
    this.nextBtn = this.element.querySelector('.next-btn');
    this.counter = this.element.querySelector('.frame-counter');

    // Set initial content
    this.element.querySelector('.build-title').textContent = this.build.name;
    this.updateImage();

    this.setupEventListeners();
  }

  getImagePath(frame) {
    const padded = String(frame).padStart(2, '0');
    return `assets/${this.build.id}_${padded}.jpg`;
  }

  setupEventListeners() {
    this.prevBtn.addEventListener('click', () => this.goToPrevious());
    this.nextBtn.addEventListener('click', () => this.goToNext());
    this.setupDrag();
  }

  setupDrag() {
    let startX = null;
    let startFrame = 1;

    this.viewer.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.carousel-btn')) return;
      startX = e.clientX;
      startFrame = this.currentFrame;
      this.viewer.classList.add('dragging');
      this.viewer.setPointerCapture(e.pointerId);
    });
    this.viewer.addEventListener('pointermove', (e) => {
      if (startX === null) return;
      const steps = Math.round((e.clientX - startX) / DRAG_STEP_PX);
      this.setFrame(startFrame + steps);
    });
    const end = () => {
      startX = null;
      this.viewer.classList.remove('dragging');
    };
    this.viewer.addEventListener('pointerup', end);
    this.viewer.addEventListener('pointercancel', end);
  }

  setFrame(frame) {
    const n = this.build.totalFrames;
    const wrapped = ((frame - 1) % n + n) % n + 1;
    if (wrapped === this.currentFrame) return;
    this.currentFrame = wrapped;
    this.updateImage();
  }

  updateImage() {
    this.img.src = this.getImagePath(this.currentFrame);
    this.counter.textContent = `${this.currentFrame} / ${this.build.totalFrames}`;
    new Image().src = this.getImagePath(this.currentFrame % this.build.totalFrames + 1);
  }

  goToPrevious() { this.setFrame(this.currentFrame - 1); }
  goToNext() { this.setFrame(this.currentFrame + 1); }
}

// Initialize viewers when page loads
document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  const template = document.getElementById('buildTemplate');

  BUILDS.forEach(build => {
    const viewer = new BuildViewer(build, template);
    main.appendChild(viewer.element);
  });
});

// Global keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    // Find the build card that's most visible in the viewport
    const cards = document.querySelectorAll('.build-container:not(#buildTemplate)');
    let mostVisible = null;
    let maxVisibleArea = 0;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      if (visibleHeight > maxVisibleArea) {
        maxVisibleArea = visibleHeight;
        mostVisible = card;
      }
    });

    if (mostVisible) {
      const btn = mostVisible.querySelector(e.key === 'ArrowLeft' ? '.prev-btn' : '.next-btn');
      btn.click();
    }
  }
});
