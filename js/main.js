/**
 * SHIMLA-MANALI TOURISM (SMT) - INTERACTIVE CLIENT JAVASCRIPT
 * Handles mobile drawer, smooth navigation, category filtering,
 * modal dialogs, lead form validation, stats counters & toast alerts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. MOBILE DRAWER NAVIGATION
  // ------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener('click', closeDrawer);
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Close on backdrop click outside drawer content
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && 
          !mobileDrawer.contains(e.target) && 
          !hamburgerBtn.contains(e.target)) {
        closeDrawer();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 2. ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
  // ------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 3. PACKAGE CATEGORY FILTERING
  // ------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.filter-pill');
  const packageCards = document.querySelectorAll('.package-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedCategory = pill.getAttribute('data-category');

      packageCards.forEach(card => {
        const cardCategories = card.getAttribute('data-category') || '';
        if (selectedCategory === 'all' || cardCategories.includes(selectedCategory)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 4. ANIMATED NUMBER COUNTERS (STATS SECTION)
  // ------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function runCounterAnimation() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const isPercent = stat.innerText.includes('%');
      const hasPlus = stat.innerText.includes('+');
      let count = 0;
      const duration = 1800;
      const increment = Math.ceil(target / (duration / 30));

      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        stat.innerText = count + (isPercent ? '%' : (hasPlus ? '+' : ''));
      }, 30);
    });
  }

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          runCounterAnimation();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // ------------------------------------------------------------------------
  // 5. INTERACTIVE BOOKING MODAL
  // ------------------------------------------------------------------------
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalPackageTitle = document.getElementById('modalPackageTitle');
  const modalPackagePrice = document.getElementById('modalPackagePrice');
  const modalBookingForm = document.getElementById('modalBookingForm');

  window.openBookingModal = function(packageName, price) {
    if (modalPackageTitle) modalPackageTitle.innerText = packageName;
    if (modalPackagePrice) modalPackagePrice.innerText = price;
    if (bookingModal) {
      bookingModal.classList.add('open');
      bookingModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  function closeBookingModal() {
    if (bookingModal) {
      bookingModal.classList.remove('open');
      bookingModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeBookingModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
  }

  if (modalBookingForm) {
    modalBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value.trim();
      const phone = document.getElementById('modalPhone').value.trim();
      const pkg = modalPackageTitle.innerText;

      closeBookingModal();
      showToast(`Thank you ${name}! Your booking inquiry for "${pkg}" has been received. Our Shimla-Manali team will connect shortly.`);
      modalBookingForm.reset();
    });
  }

  // ------------------------------------------------------------------------
  // 6. LEAD GENERATION FORM VALIDATION & SUBMISSION
  // ------------------------------------------------------------------------
  const tripLeadForm = document.getElementById('tripLeadForm');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const dateError = document.getElementById('dateError');

  // Set default minimum date for travel to tomorrow
  const travelDateInput = document.getElementById('travelDate');
  if (travelDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    travelDateInput.min = tomorrow.toISOString().split('T')[0];
  }

  if (tripLeadForm) {
    tripLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const userName = document.getElementById('userName').value.trim();
      const userPhone = document.getElementById('userPhone').value.trim();
      const travelDate = document.getElementById('travelDate').value;
      const tripType = document.getElementById('tripType').value;

      // Reset errors
      if (nameError) nameError.innerText = '';
      if (phoneError) phoneError.innerText = '';
      if (dateError) dateError.innerText = '';

      // Validate Name
      if (userName.length < 2) {
        if (nameError) nameError.innerText = 'Please enter your full name';
        isValid = false;
      }

      // Validate Phone (at least 10 digits)
      const digitsOnly = userPhone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        if (phoneError) phoneError.innerText = 'Please enter a valid 10-digit phone number';
        isValid = false;
      }

      // Validate Date
      if (!travelDate) {
        if (dateError) dateError.innerText = 'Please select your preferred travel date';
        isValid = false;
      }

      if (isValid) {
        const submitBtn = document.getElementById('submitLeadBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = 'Submitting Request...';
        }

        setTimeout(() => {
          showToast(`Inquiry Confirmed! Local Himachal itinerary for "${tripType}" is being prepared for ${userName}.`);
          tripLeadForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Get My Free Quote';
          }
        }, 600);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 7. TOAST NOTIFICATION HELPER
  // ------------------------------------------------------------------------
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.innerText = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // ------------------------------------------------------------------------
  // 8. EXPLORE SHIMLA / MANALI DESTINATION QUICK-ACTION
  // ------------------------------------------------------------------------
  window.filterByDestination = function(dest) {
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Showing curated packages for ${dest.toUpperCase()}!`);
  };
});
