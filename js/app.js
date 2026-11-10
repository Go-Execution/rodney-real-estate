/* ==========================================================================
   RODNEY PEETE LUXURY REAL ESTATE - JAVASCRIPT ENGINE
   Lenis Smooth Scroll • GSAP ScrollTrigger • Kinetic Line-Mask Reveals •
   Dynamic Navbar Inversion • Interactive Portfolio & Testimonials
   ========================================================================== */

(function () {
  'use strict';

  // State
  let lenisInstance = null;
  let isMobile = window.innerWidth <= 767;

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', initApp);

  function initApp() {
    initLenis();
    initCustomCursor();
    initLiveClock();
    initKineticSplitLines();
    initPreloader();
    initHeroParallax();
    initNavbarThemeSwitch();
    initMobileMenu();
    initHorizontalScroll();
    initFeaturedPortfolio();
    initTestimonialsSlider();
    initFooterReveal();
    initPropertyModals();
    initConsultationForm();
    initAnchorLinks();
    initBackToTop();

    if (document.fonts && document.fonts.ready && typeof ScrollTrigger !== 'undefined') {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }
  }

  // =========================================================================
  // 1. LENIS SMOOTH SCROLL (Synchronized with GSAP)
  // =========================================================================
  function initLenis() {
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis not loaded');
      return;
    }

    lenisInstance = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.75,
      gestureOrientation: 'vertical',
      normalizeWheel: false,
      smoothTouch: false
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      lenisInstance.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    window.lenis = lenisInstance;
  }

  // =========================================================================
  // 2. CUSTOM CURSOR
  // =========================================================================
  function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor || isMobile) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover interactive elements
    const interactiveEls = document.querySelectorAll('a, button, [data-interactive], .featured-items, .words-nav-btn');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // =========================================================================
  // 3. LIVE CLOCK & LOCATION TICKER (Los Angeles Time Zone)
  // =========================================================================
  function initLiveClock() {
    const clockEl = document.querySelector('[data-live-clock]');
    if (!clockEl) return;

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    function updateTime() {
      const now = new Date();
      clockEl.textContent = formatter.format(now) + ' PDT';
    }

    updateTime();
    setInterval(updateTime, 1000);
  }

  // =========================================================================
  // 4. KINETIC LINE-MASK SPLITTER (Matches BCG SplitText Line Reveal)
  // =========================================================================
  function initKineticSplitLines() {
    // Splits text into visual lines with overflow:hidden masks
    const splitElements = document.querySelectorAll('[data-split]');

    splitElements.forEach((el) => {
      splitIntoLines(el);

      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const lines = el.querySelectorAll('.split-line-inner');
        gsap.from(lines, {
          yPercent: 110,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        });
      }
    });
  }

  function splitIntoLines(element) {
    const text = element.innerText.trim();
    const words = text.split(/\s+/);
    element.innerHTML = '';

    // Create word spans to measure offsetTop
    const wordSpans = words.map(word => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.display = 'inline-block';
      element.appendChild(span);
      return span;
    });

    // Group into visual lines
    const lines = [];
    let currentLine = [];
    let currentTop = -1;

    wordSpans.forEach(span => {
      const top = span.offsetTop;
      if (top !== currentTop) {
        if (currentLine.length > 0) lines.push(currentLine);
        currentLine = [span.textContent];
        currentTop = top;
      } else {
        currentLine.push(span.textContent);
      }
    });
    if (currentLine.length > 0) lines.push(currentLine);

    // Reconstruct with line masks
    element.innerHTML = '';
    lines.forEach(lineWords => {
      const maskDiv = document.createElement('span');
      maskDiv.className = 'split-line-mask';
      const innerDiv = document.createElement('span');
      innerDiv.className = 'split-line-inner';
      innerDiv.textContent = lineWords.join('').trim();
      maskDiv.appendChild(innerDiv);
      element.appendChild(maskDiv);
    });
  }

  // =========================================================================
  // 5. PRELOADER SEQUENCE (Exact BCG Style)
  // =========================================================================
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const heroHeading = document.querySelector('[data-hero-split]');
    const navLogo = document.querySelector('.nav-logo-el');
    const progressBar = document.querySelector('.preloader-progress-bar');

    if (!preloader) {
      if (heroHeading) animateHeroSplit(heroHeading);
      return;
    }

    // Wrap preloader letters in kinetic spans
    const brandName = 'RODNEY PEETE';
    const logoContainer = preloader.querySelector('.preloader-logo');
    if (logoContainer) {
      logoContainer.innerHTML = '';
      brandName.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'kinetic-letter';
        span.textContent = char === ' ' ? '\u00A0' : char;
        logoContainer.appendChild(span);
      });
    }

    const letters = preloader.querySelectorAll('.kinetic-letter');

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();

      // Initial state
      gsap.set(letters, { yPercent: 120, opacity: 0 });
      if (navLogo) gsap.set(navLogo, { yPercent: -100, opacity: 0 });

      // Progress bar fill
      if (progressBar) {
        tl.to(progressBar, { width: '100%', duration: 1.2, ease: 'power2.inOut' }, 0);
      }

      // Letter reveal
      tl.to(letters, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out'
      }, 0.2);

      // Brief hold, then slide up exit
      tl.to(preloader, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        delay: 0.2,
        onComplete: () => {
          preloader.style.display = 'none';
        }
      });

      // Nav Logo drops down
      if (navLogo) {
        tl.to(navLogo, {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out'
        }, '-=0.4');
      }

      // Hero line reveal
      tl.call(() => {
        if (heroHeading) animateHeroSplit(heroHeading);
      }, null, '-=0.2');

    } else {
      // Fallback
      setTimeout(() => {
        preloader.style.display = 'none';
        if (heroHeading) animateHeroSplit(heroHeading);
      }, 1500);
    }
  }

  function animateHeroSplit(element) {
    splitIntoLines(element);
    const lines = element.querySelectorAll('.split-line-inner');

    if (typeof gsap !== 'undefined') {
      gsap.from(lines, {
        yPercent: 110,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.08,
        delay: 0.1
      });

      // Also reveal hero spotlight, description and metrics
      gsap.from('.hero-spotlight-card, .hero-desc-text, .hero-metric-item', {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.4
      });
    }
  }

  // =========================================================================
  // 5b. HERO VISUAL PARALLAX
  // =========================================================================
  function initHeroParallax() {
    const heroImg = document.querySelector('.hero-home-bg img');
    const heroSec = document.querySelector('#hero');
    if (!heroImg || !heroSec || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.to(heroImg, {
      yPercent: 18,
      scale: 1.12,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSec,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // =========================================================================
  // 6. DYNAMIC NAVBAR THEME INVERSION (Over [data-navbar-dark="true"] sections)
  // =========================================================================
  function initNavbarThemeSwitch() {
    const navbar = document.querySelector('.navbar-wrap');
    const darkSections = document.querySelectorAll('[data-navbar-dark="true"]');
    if (!navbar || !darkSections.length) return;

    function checkTheme() {
      const navRect = navbar.getBoundingClientRect();
      const checkY = navRect.bottom + 2;
      const checkX = window.innerWidth / 2;

      let isOverDark = false;
      darkSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (checkY >= rect.top && checkY <= rect.bottom) {
          isOverDark = true;
        }
      });

      if (isOverDark) {
        navbar.classList.add('is-theme-dark');
      } else {
        navbar.classList.remove('is-theme-dark');
      }

      // Scroll background blur
      if (window.scrollY > 40) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', checkTheme, { passive: true });
    window.addEventListener('resize', checkTheme, { passive: true });
    checkTheme();
  }

  // =========================================================================
  // 7. MOBILE MENU BURGER (Split Text Chars & Clip-Path Reveal)
  // =========================================================================
  function initMobileMenu() {
    const menuBtn = document.querySelector('.navber_menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuText = document.querySelector('.relative-menu-text');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuBtn || !mobileMenu) return;

    let isOpen = false;

    menuBtn.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isOpen) toggleMenu();
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleMenu();
      }
    });

    function toggleMenu() {
      isOpen = !isOpen;
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      if (typeof gsap !== 'undefined') {
        if (isOpen) {
          if (lenisInstance) lenisInstance.stop();
          mobileMenu.classList.add('is-open');

          gsap.to(mobileMenu, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.7,
            ease: 'power3.inOut'
          });

          gsap.fromTo(navLinks, {
            yPercent: 100,
            opacity: 0
          }, {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power3.out',
            delay: 0.2
          });

          if (menuText) menuText.textContent = 'CLOSE';
        } else {
          gsap.to(mobileMenu, {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.6,
            ease: 'power3.inOut',
            onComplete: () => {
              mobileMenu.classList.remove('is-open');
              if (lenisInstance) lenisInstance.start();
            }
          });

          if (menuText) menuText.textContent = 'MENU';
        }
      } else {
        mobileMenu.classList.toggle('is-open', isOpen);
        if (menuText) menuText.textContent = isOpen ? 'CLOSE' : 'MENU';
      }
    }
  }

  // =========================================================================
  // 8. HORIZONTAL PINNED SCROLL TRACK (Exact BCG Pinned Track)
  // =========================================================================
  function initHorizontalScroll() {
    const track = document.querySelector('.horiz_sticky-track');
    const sticky = document.querySelector('.horiz_sticky');
    const row = document.querySelector('.horiz_row');
    const cards = document.querySelectorAll('.horiz_row-card');
    const progressFill = document.querySelector('.horiz_progress_fill');

    if (!track || !row || !cards.length) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Split text inside cards
    cards.forEach(card => {
      const splitTarget = card.querySelector('[data-horiz-split]');
      if (splitTarget) splitIntoLines(splitTarget);
    });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      // Calculate scroll distance dynamically
      const getDist = () => Math.max(0, row.scrollWidth - window.innerWidth + (window.innerWidth * 0.08));
      const distance = getDist();
      const totalScrollHeight = Math.max(window.innerHeight * 2.5, distance + window.innerHeight * 0.9);
      track.style.height = `${totalScrollHeight}px`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressFill) {
              progressFill.style.width = `${Math.max(15, self.progress * 100)}%`;
            }
          }
        }
      });

      tl.to(row, {
        x: () => -getDist(),
        ease: 'none'
      });

      // Card reveals as they scroll into view
      cards.forEach((card, index) => {
        const inners = card.querySelectorAll('.split-line-inner');
        if (inners.length) {
          gsap.from(inners, {
            yPercent: 100,
            duration: 0.6,
            stagger: 0.04,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: 'left 85%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      });
    });

    mm.add('(max-width: 767px)', () => {
      // On mobile, CSS handles native horizontal scroll-snap on .horiz_track_viewport
      track.style.height = 'auto';
      gsap.set(row, { clearProps: 'transform' });
    });
  }

  // =========================================================================
  // 9. FEATURED PROPERTIES PORTFOLIO (Exact BCG Hover/Scroll Image Swap)
  // =========================================================================
  function initFeaturedPortfolio() {
    const items = Array.from(document.querySelectorAll('.featured-items'));
    const slides = Array.from(document.querySelectorAll('.featured-image-slide'));
    const badgeName = document.querySelector('[data-preview-badge-name]');
    const badgePrice = document.querySelector('[data-preview-badge-price]');
    const badgeLoc = document.querySelector('[data-preview-badge-loc]');
    const previewBtn = document.querySelector('.featured-preview-btn');

    if (!items.length || !slides.length) return;

    let activeIndex = -1;

    function activateIndex(index) {
      if (index === activeIndex || index < 0 || index >= items.length) return;

      // Update list items active state
      items.forEach((item, i) => {
        item.classList.toggle('is-active', i === index);
      });

      // Update sticky image slides
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-visible', i === index);
      });

      // Update badge metadata
      const currentItem = items[index];
      if (currentItem && badgeName) {
        badgeName.textContent = currentItem.dataset.name || '';
        if (badgePrice) badgePrice.textContent = currentItem.dataset.price || '';
        if (badgeLoc) badgeLoc.textContent = currentItem.dataset.location || '';
        if (previewBtn && currentItem.dataset.propertyKey) {
          previewBtn.dataset.propertyKey = currentItem.dataset.propertyKey;
        }
      }

      activeIndex = index;
    }

    // Hover & Click interaction
    items.forEach((item, i) => {
      item.addEventListener('mouseenter', () => activateIndex(i));
      item.addEventListener('focusin', () => activateIndex(i));
      item.addEventListener('click', () => {
        activateIndex(i);
        const key = item.dataset.propertyKey;
        if (key && window.__openPropertyModal) {
          window.__openPropertyModal(key);
        }
      });
    });

    // Default first item active
    activateIndex(0);

    // Tablet/Desktop ScrollTrigger toggle
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px) and (max-width: 1024px)', () => {
        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 60%',
            end: 'bottom 60%',
            onToggle: (self) => {
              if (self.isActive) activateIndex(i);
            }
          });
        });
      });
    }
  }

  // =========================================================================
  // 10. CLIENT WORDS / TESTIMONIALS (Exact BCG Dual Image Split Carousel)
  // =========================================================================
  function initTestimonialsSlider() {
    const items = Array.from(document.querySelectorAll('.words-items'));
    const prevBtn = document.querySelector('[words-prev]');
    const nextBtn = document.querySelector('[words-next]');
    const counterEl = document.querySelector('[data-words-counter]');

    if (!items.length) return;

    let current = 0;
    const total = items.length;

    // Split quotes into lines for animation
    items.forEach(item => {
      const quoteEl = item.querySelector('.words-testi-content p');
      if (quoteEl) splitIntoLines(quoteEl);
    });

    function showSlide(index) {
      index = (index + total) % total;
      if (index === current && items[current].classList.contains('is-active')) return;

      const outgoing = items[current];
      const incoming = items[index];

      // Hide outgoing
      outgoing.classList.remove('is-active');

      // Show incoming
      incoming.classList.add('is-active');

      if (typeof gsap !== 'undefined') {
        const quoteLines = incoming.querySelectorAll('.split-line-inner');
        const images = incoming.querySelectorAll('.words-thumbnail img, .words-big-img img');
        const author = incoming.querySelector('.words-source');

        gsap.fromTo(images, {
          opacity: 0,
          scale: 1.05
        }, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out'
        });

        gsap.fromTo(quoteLines, {
          yPercent: 110
        }, {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power3.out',
          delay: 0.1
        });

        gsap.fromTo(author, {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.25
        });
      }

      // Update counter
      if (counterEl) {
        const padCurrent = ('0' + (index + 1)).slice(-2);
        const padTotal = ('0' + total).slice(-2);
        counterEl.textContent = `${padCurrent} / ${padTotal}`;
      }

      current = index;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      const section = document.querySelector('.section_words');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowLeft') showSlide(current - 1);
        if (e.key === 'ArrowRight') showSlide(current + 1);
      }
    });

    // Start with slide 0
    showSlide(0);
  }

  // =========================================================================
  // 11. FOOTER REVEAL ANIMATION (Exact BCG Kinetic Letter Stagger & Line Grow)
  // =========================================================================
  function initFooterReveal() {
    const footer = document.querySelector('.section_footer');
    const giantBrand = document.querySelector('.footer-giant-brand');
    const footerLine = document.querySelector('.footer-line');

    if (!footer || !giantBrand) return;

    // Split brand name into letters
    const brandText = 'RODNEY PEETE';
    giantBrand.innerHTML = '';
    brandText.split('').forEach(char => {
      const span = document.createElement('span');
      span.className = 'footer-letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      giantBrand.appendChild(span);
    });

    const letters = giantBrand.querySelectorAll('.footer-letter');

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.set(letters, { opacity: 0, yPercent: 110 });
      if (footerLine) gsap.set(footerLine, { scaleX: 0, transformOrigin: 'left center' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top 80%',
          once: true
        }
      });

      tl.to(letters, {
        opacity: 1,
        yPercent: 0,
        duration: 0.7,
        stagger: 0.035,
        ease: 'power3.out'
      }, 0);

      if (footerLine) {
        tl.to(footerLine, {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.out'
        }, 0);
      }
    }
  }

  // =========================================================================
  // 12. INTERACTIVE PROPERTY DETAIL MODAL
  // =========================================================================
  function initPropertyModals() {
    const modal = document.querySelector('.property-modal');
    const modalClose = document.querySelector('.modal-close-btn');
    const modalBackdrop = document.querySelector('.property-modal-backdrop');
    const triggers = document.querySelectorAll('[data-open-property]');

    if (!modal) return;

    // Property Database
    const propertyData = {
      'ruthelen': {
        title: 'The Ruthelen Modern Estate',
        location: '11513 Ruthelen St, Los Angeles, CA 90047',
        price: '$3,450,000',
        beds: '5 Beds',
        baths: '5.5 Baths',
        sqft: '4,850 Sq Ft',
        lot: '9,200 Sq Ft Lot',
        architectural: 'California Organic Modernist',
        year: '2024 Reimagined',
        desc: 'An architectural triumph in Greater Los Angeles, featuring double-height ceiling voids, floor-to-ceiling fleetwood glazing, polished limestone floors, and a private zero-edge courtyard pool framed by architectural olive trees.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85'
      },
      'carson': {
        title: 'Carson Heritage Residence',
        location: '361 E 224th St, Carson, CA 90745',
        price: '$1,850,000',
        beds: '4 Beds',
        baths: '3 Baths',
        sqft: '2,920 Sq Ft',
        lot: '7,400 Sq Ft Lot',
        architectural: 'Mid-Century Reinterpreted',
        year: '2023 Remodel',
        desc: 'Located in Rodney Peete’s center-of-gravity micro-market of Carson. Seamless indoor-outdoor flow, curated white-oak millwork, custom terrazzo island, and entertainer’s landscaped grounds.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85'
      },
      'inglewood': {
        title: 'The Inglewood District Compound',
        location: '100 Long St, Inglewood, CA 90301',
        price: '$4,200,000',
        beds: '6 Beds',
        baths: '6.5 Baths',
        sqft: '5,600 Sq Ft',
        lot: '11,000 Sq Ft Lot',
        architectural: 'Urban Luxury Compound',
        year: '2025 Construction',
        desc: 'Situated minutes from SoFi Stadium, Intuit Dome, and the upcoming LA Sparks high-performance campus in El Segundo. Represents an exceptional investment or prime private residence in Southern California’s premier sports & entertainment nexus.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85'
      },
      'rancho': {
        title: 'Rancho Belago Hillside Vista',
        location: 'Rancho Belago Foothills, Moreno Valley, CA',
        price: '$2,950,000',
        beds: '5 Beds',
        baths: '6 Baths',
        sqft: '6,100 Sq Ft',
        lot: '0.85 Acres',
        architectural: 'Hillside Modern Panoramas',
        year: '2024 Built',
        desc: 'Panoramic foothill views stretching across the valley. Features private cantilevered viewing decks, temperature-controlled 800-bottle wine gallery, guest villa, and motor court.',
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1800&q=85'
      },
      'viadelsol': {
        title: 'Via Del Sol Sanctuary',
        location: '13020 Via Del Sol Ave, Whittier, CA 90601',
        price: '$2,400,000',
        beds: '4 Beds',
        baths: '4 Baths',
        sqft: '3,800 Sq Ft',
        lot: '14,500 Sq Ft Lot',
        architectural: 'Warm Travertine Minimalist',
        year: '2023 Renovated',
        desc: 'A serene sanctuary perched above Whittier with sweeping city-lights views. Handcrafted plaster wall finishes, custom bronze fixtures, and resort-style grounds with outdoor fireplace pavilion.',
        image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1800&q=85'
      },
      'leahy': {
        title: 'Leahy Avenue Luxury Residence',
        location: '15116 Leahy Ave, Bellflower, CA 90706',
        price: '$1,650,000',
        beds: '4 Beds',
        baths: '3.5 Baths',
        sqft: '3,100 Sq Ft',
        lot: '6,800 Sq Ft Lot',
        architectural: 'Contemporary Craftsman',
        year: '2024 Masterwork',
        desc: 'Flawlessly executed custom home offering generous living spaces, chef’s kitchen with Thermador suite, primary retreat with spa bath and direct terrace access.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85'
      }
    };

    function openModal(propKey) {
      const data = propertyData[propKey] || propertyData['ruthelen'];

      modal.querySelector('[data-modal-title]').textContent = data.title;
      modal.querySelector('[data-modal-loc]').textContent = data.location;
      modal.querySelector('[data-modal-price]').textContent = data.price;
      modal.querySelector('[data-modal-desc]').textContent = data.desc;
      modal.querySelector('[data-modal-img]').src = data.image;

      modal.querySelector('[data-modal-beds]').textContent = data.beds;
      modal.querySelector('[data-modal-baths]').textContent = data.baths;
      modal.querySelector('[data-modal-sqft]').textContent = data.sqft;
      modal.querySelector('[data-modal-lot]').textContent = data.lot;
      modal.querySelector('[data-modal-arch]').textContent = data.architectural;
      modal.querySelector('[data-modal-year]').textContent = data.year;

      modal.classList.add('is-open');
      if (lenisInstance) lenisInstance.stop();
    }

    function closeModal() {
      modal.classList.remove('is-open');
      if (lenisInstance) lenisInstance.start();
    }

    window.__openPropertyModal = openModal;

    const modalCta = modal.querySelector('a[href="#contact"]');
    if (modalCta) {
      modalCta.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
        const target = document.querySelector('#contact');
        if (target && lenisInstance) {
          lenisInstance.scrollTo(target, { duration: 1.4 });
        } else if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    triggers.forEach(trig => {
      trig.addEventListener('click', (e) => {
        e.preventDefault();
        const key = trig.dataset.propertyKey || 'ruthelen';
        openModal(key);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  // =========================================================================
  // 13. CONSULTATION / INQUIRY FORM
  // =========================================================================
  function initConsultationForm() {
    const form = document.querySelector('#consultation-form');
    const feedback = document.querySelector('.form-feedback-message');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('.form-submit-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Submitting Request...';
      btn.style.opacity = '0.7';

      setTimeout(() => {
        btn.innerHTML = 'Inquiry Received';
        btn.style.backgroundColor = '#2ecc71';
        btn.style.color = '#fff';

        if (feedback) {
          feedback.style.display = 'block';
          feedback.innerHTML = '<strong>Thank you.</strong> Rodney Peete’s private office has received your request and will contact you directly within 24 hours.';
        }

        form.reset();

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
          btn.style.opacity = '1';
        }, 6000);
      }, 1000);
    });
  }

  // =========================================================================
  // 13b. SMOOTH ANCHOR LINK SCROLLING (Lenis Powered)
  // =========================================================================
  function initAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();
        if (lenisInstance) {
          lenisInstance.scrollTo(targetEl, {
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // =========================================================================
  // 14. BACK TO TOP BUTTON
  // =========================================================================
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

})();
