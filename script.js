/**
 * Chang Architectures — Studio Scripts & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initProjectFilters();
  initModals();
  initLightbox();
  initStatsCounter();
  initInquiryForm();
});

/* 1. Header Scroll State & Scrollspy */
function initNavbarScroll() {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('nav[data-nav-links] a, #mobile-menu a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header styling on scroll
    if (window.scrollY > 40) {
      header.classList.add('bg-surface-container-lowest/95', 'shadow-2xl', 'border-b', 'border-surface-container-high/60');
      header.classList.remove('bg-surface-container-lowest/80');
    } else {
      header.classList.remove('bg-surface-container-lowest/95', 'shadow-2xl', 'border-b', 'border-surface-container-high/60');
      header.classList.add('bg-surface-container-lowest/80');
    }

    // Scrollspy for active link
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const underline = link.querySelector('.nav-indicator');

      if (href === `#${current}` || (current === '' && href === '#')) {
        link.classList.add('text-primary');
        link.classList.remove('text-on-surface-variant');
        if (underline) underline.style.width = '100%';
      } else if (href.startsWith('#')) {
        link.classList.remove('text-primary');
        link.classList.add('text-on-surface-variant');
        if (underline) underline.style.width = '0%';
      }
    });
  }, { passive: true });
}

/* 2. Mobile Menu Drawer */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-mobile-menu');
  const menuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileLinks = document.querySelectorAll('#mobile-menu-drawer a');

  if (!menuBtn || !menuDrawer) return;

  function openMenu() {
    menuDrawer.classList.remove('translate-x-full');
    menuDrawer.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuDrawer.classList.remove('translate-x-0');
    menuDrawer.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* 3. Project Filter System */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update button styles
      filterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary', 'shadow-md');
        b.classList.add('bg-surface-container-high/50', 'text-on-surface-variant');
      });
      btn.classList.remove('bg-surface-container-high/50', 'text-on-surface-variant');
      btn.classList.add('bg-primary', 'text-on-primary', 'shadow-md');

      // Filter animation
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const matches = filter === 'all' || category.includes(filter);

        if (matches) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* 4. Modals (Blueprints & Inquiry Sheet) */
function initModals() {
  // Generic modal openers/closers
  const openModalTriggers = document.querySelectorAll('[data-open-modal]');
  const closeModalTriggers = document.querySelectorAll('[data-close-modal]');

  openModalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeModalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = trigger.closest('.modal-container');
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modals on clicking background overlay
  document.querySelectorAll('.modal-container').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-container').forEach(modal => {
        modal.classList.add('hidden');
      });
      const lightbox = document.getElementById('image-lightbox');
      if (lightbox) lightbox.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
}

/* 5. Image Lightbox Viewer */
function initLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (!lightbox || !lightboxImg) return;

  const galleryItems = Array.from(document.querySelectorAll('[data-lightbox-src]'));
  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const item = galleryItems[currentIndex];
    const src = item.getAttribute('data-lightbox-src');
    const title = item.getAttribute('data-lightbox-title') || '';
    const desc = item.getAttribute('data-lightbox-desc') || '';

    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.innerHTML = `<h4 class="font-headline text-lg text-on-surface">${title}</h4><p class="text-sm text-on-surface-variant">${desc}</p>`;
    }

    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      showImage(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
}

/* 6. Metric Counter Animation */
function initStatsCounter() {
  const statElements = document.querySelectorAll('[data-target-count]');
  if (!statElements.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target-count'), 10);
          const suffix = el.getAttribute('data-count-suffix') || '';
          const duration = 1800;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / totalSteps;
            const currentVal = Math.round(target * Math.sin(progress * (Math.PI / 2)));
            el.textContent = `${currentVal}${suffix}`;

            if (currentStep >= totalSteps) {
              clearInterval(timer);
              el.textContent = `${target}${suffix}`;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.25 });

  const statsContainer = document.querySelector('.metric-stats-bar');
  if (statsContainer) observer.observe(statsContainer);
}

/* 7. Commission Inquiry Form Handling */
function initInquiryForm() {
  const form = document.getElementById('commission-inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const modal = document.getElementById('inquiry-sheet');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Simulate luxury submission animation
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="inline-block animate-spin mr-2">◌</span>
      Transmitting Confidential Inquiry...
    `;

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Submit Private Inquiry`;

      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }

      showToast('Inquiry Transmitted', 'A Principal Partner will review your commission request and respond within 24 hours.');
    }, 1200);
  });
}

/* 8. Toast Notification System */
function showToast(title, message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none max-w-md w-full px-4';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-enter pointer-events-auto bg-surface-container-low border border-primary/40 p-5 rounded-DEFAULT shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-start gap-4';
  toast.innerHTML = `
    <div class="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
      <span class="material-symbols-outlined text-[18px]">verified</span>
    </div>
    <div class="space-y-1 flex-1">
      <h5 class="font-headline text-sm text-on-surface font-semibold">${title}</h5>
      <p class="font-sans text-xs text-on-surface-variant leading-relaxed">${message}</p>
    </div>
    <button class="text-outline hover:text-on-surface text-sm p-1" onclick="this.parentElement.remove()">
      <span class="material-symbols-outlined text-[16px]">close</span>
    </button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('toast-enter');
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 400);
  }, 6000);
}
