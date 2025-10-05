class BuildViewer {
  constructor(build, template) {
    this.build = build;
    this.currentFrame = 1;
    this.element = template.cloneNode(true);
    
    // Remove template ID and show the element
    this.element.removeAttribute('id');
    this.element.style.display = '';
    
    // Store DOM elements as instance properties
    this.img = this.element.querySelector('.lego-img');
    this.prevBtn = this.element.querySelector('.prev-btn');
    this.nextBtn = this.element.querySelector('.next-btn');
    
    // Set initial content
    this.element.querySelector('.build-title').textContent = this.build.name;
    this.img.src = this.getImagePath(1);
    
    this.setupEventListeners();
  }

  getImagePath(frame) {
    const padded = String(frame).padStart(2, '0');
    return `assets/${this.build.id}_${padded}.jpg`;
  }

  setupEventListeners() {
    this.prevBtn.addEventListener('click', () => this.goToPrevious());
    this.nextBtn.addEventListener('click', () => this.goToNext());
    
    // Prevent dragging on the image
    this.img.addEventListener('dragstart', (e) => e.preventDefault());
  }

  updateImage() {
    this.img.src = this.getImagePath(this.currentFrame);
  }

  goToPrevious() {
    this.currentFrame = this.currentFrame === 1 ? this.build.totalFrames : this.currentFrame - 1;
    this.updateImage();
  }

  goToNext() {
    this.currentFrame = this.currentFrame === this.build.totalFrames ? 1 : this.currentFrame + 1;
    this.updateImage();
  }
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