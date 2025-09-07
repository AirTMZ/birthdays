
// Generate colors based on name hex
function generateColorsFromName(name) {
  if (!name) {
    // Default colors if no name
    return {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#ff6b9d'
    };
  }
  
  // Create a simple hash from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Generate three related colors from the hash
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 60) % 360;
  const hue3 = (hue1 + 120) % 360;
  
  const saturation = 70 + (Math.abs(hash) % 20); // 70-90%
  const lightness = 55 + (Math.abs(hash) % 15);  // 55-70%
  
  return {
    primary: `hsl(${hue1}, ${saturation}%, ${lightness}%)`,
    secondary: `hsl(${hue2}, ${saturation}%, ${lightness + 5}%)`,
    accent: `hsl(${hue3}, ${saturation + 10}%, ${lightness - 5}%)`
  };
}

// Envelope Animation Functions
function initEnvelopeAnimation() {
  const envelopeContainer = document.getElementById('envelope-container');
  const envelope = document.querySelector('.envelope');
  const skipBtn = document.getElementById('skip-btn');
  const mainContent = document.querySelector('.main-content');
  const hintText = document.getElementById('hint-text');
  
  // Apply colors to envelope elements
  const name = getNameFromQuery();
  const colors = generateColorsFromName(name);
  applyDynamicColors(colors);
  
  // Update envelope address with personalized name
  const envelopeName = document.getElementById('envelope-name');
  if (name && envelopeName) {
    envelopeName.textContent = `To ${capitalize(name)}`;
  }

  // Initialize mobile menu immediately (don't wait for envelope)
  initMobileMenu();  // Show hint text after 8 seconds
  let hintTimeout = setTimeout(() => {
    if (hintText && !envelope.classList.contains('opening')) {
      hintText.classList.add('visible');
    }
  }, 8000);
  
  // Envelope click handler
  envelope.addEventListener('click', () => {
    envelope.classList.add('opening');
    clearTimeout(hintTimeout);
    if (hintText) hintText.classList.remove('visible');
    
    setTimeout(() => {
      hideEnvelopeAndShowContent();
    }, 1500);
  });
  
  // Skip button handler
  skipBtn.addEventListener('click', () => {
    clearTimeout(hintTimeout);
    hideEnvelopeAndShowContent();
  });
  
  // Remove auto-open functionality - now only shows hint
}

function hideEnvelopeAndShowContent() {
  const envelopeContainer = document.getElementById('envelope-container');
  const mainContent = document.querySelector('.main-content');
  
  // Re-enable scrolling
  document.body.classList.remove('envelope-active');
  
  // Show greeting immediately
  showGreeting();
  
  envelopeContainer.classList.add('hidden');
  
  setTimeout(() => {
    envelopeContainer.style.display = 'none';
    mainContent.classList.add('visible');
    
    // Initialize all other functions after envelope is hidden
    initSmoothScrolling();
    initNavScrollEffect();
    initScrollAnimations();
    initParallaxEffect();
    initMouseEffects();
    initUniversalMapLink();
    initMobileAnimations();
    createFloatingParticles();
    
    // Show balloons when envelope animation completes
    setTimeout(() => {
      // CSS balloons are now handling all balloon animations
      // JavaScript balloon creation disabled to prevent conflicts
    }, 300);
  }, 1000);
}

// Apply dynamic colors to CSS variables
function applyDynamicColors(colors) {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', colors.primary);
  root.style.setProperty('--secondary-color', colors.secondary);
  root.style.setProperty('--accent-color', colors.accent);
}

// Get the name from the query string (e.g., ?name=timothy)
function getNameFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  return name ? decodeURIComponent(name) : null;
}

// Get time of day
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showGreeting() {
  const name = getNameFromQuery();
  const timeOfDay = getTimeOfDay();
  const greetingEl = document.getElementById('greeting');
  
  // Generate and apply dynamic colors based on name
  const colors = generateColorsFromName(name);
  applyDynamicColors(colors);
  
  if (name) {
    greetingEl.textContent = `Good ${timeOfDay}, ${capitalize(name)}!`;
  } else {
    greetingEl.textContent = `Good ${timeOfDay}!`;
  }
  
  // Personalize other sections
  personalizeContent(name);
}

function personalizeContent(name) {
  if (!name) return;
  
  const capitalizedName = capitalize(name);
  
  // Remove invitation message
  const invitationEl = document.getElementById('personal-invitation');
  if (invitationEl) {
    invitationEl.style.display = 'none';
  }
  
  // Personalize location message
  const locationEl = document.getElementById('location-invitation');
  if (locationEl) {
    locationEl.textContent = `See you there!`;
  }
  
  // Remove menu message
  const menuEl = document.getElementById('menu-invitation');
  if (menuEl) {
    menuEl.style.display = 'none';
  }
}

// Advanced smooth scrolling with easing
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        
        // Custom smooth scroll with easing
        const startPos = window.pageYOffset;
        const distance = offsetTop - startPos;
        const duration = 1000;
        let startTime = null;
        
        function scrollAnimation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          
          // Easing function (ease-in-out cubic)
          const easeProgress = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          
          window.scrollTo(0, startPos + distance * easeProgress);
          
          if (timeElapsed < duration) {
            requestAnimationFrame(scrollAnimation);
          }
        }
        
        requestAnimationFrame(scrollAnimation);
      }
    });
  });
}

// Enhanced navigation scroll effect with parallax
function initNavScrollEffect() {
  const nav = document.querySelector('.nav');
  let ticking = false;
  
  function updateNav() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      nav.style.background = 'rgba(255, 255, 255, 0.98)';
      nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
      nav.style.backdropFilter = 'blur(20px) saturate(180%)';
    } else {
      nav.style.background = 'rgba(255, 255, 255, 0.8)';
      nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
      nav.style.backdropFilter = 'blur(20px) saturate(180%)';
    }
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
}

// Advanced intersection observer with stagger effects
function initScrollAnimations() {
  // Completely disabled to prevent any flashing issues
  return;
}

// Parallax effect for hero section
function initParallaxEffect() {
  const hero = document.querySelector('.hero');
  let ticking = false;
  
  function updateParallax() {
    const scrollY = window.pageYOffset;
    const rate = scrollY * -0.5;
    
    if (hero) {
      hero.style.transform = `translateY(${rate}px)`;
    }
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
}

// Advanced mouse tracking effects
function initMouseEffects() {
  const cards = document.querySelectorAll('.detail-card, .menu-category');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}

// Floating particles effect
function createFloatingParticles() {
  const particleCount = 20;
  const hero = document.querySelector('.hero');
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      pointer-events: none;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: floatParticle ${5 + Math.random() * 10}s linear infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    
    hero.appendChild(particle);
  }
  
  // Add CSS for particle animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatParticle {
      0% {
        transform: translateY(100vh) translateX(0) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
        transform: scale(1);
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px) scale(0);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Universal map link handler
function initUniversalMapLink() {
  const mapLink = document.querySelector('.map-link');
  if (mapLink) {
    mapLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      const location = 'Whitley Bay, Tyne and Wear, England';
      const encodedLocation = encodeURIComponent(location);
      
      // Detect device and open appropriate map app
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      let mapUrl;
      
      if (isIOS) {
        // iOS - try Apple Maps first, fallback to Google Maps
        mapUrl = `maps://maps.apple.com/?q=${encodedLocation}`;
        
        // Fallback to Google Maps if Apple Maps not available
        const fallbackUrl = `https://maps.google.com/?q=${encodedLocation}`;
        
        // Try to open Apple Maps
        window.location.href = mapUrl;
        
        // If Apple Maps doesn't open, fallback to Google Maps
        setTimeout(() => {
          window.open(fallbackUrl, '_blank');
        }, 500);
        
      } else if (isAndroid) {
        // Android - try Google Maps app, fallback to web
        mapUrl = `geo:0,0?q=${encodedLocation}`;
        
        try {
          window.location.href = mapUrl;
        } catch (error) {
          window.open(`https://maps.google.com/?q=${encodedLocation}`, '_blank');
        }
        
      } else {
        // Desktop/Other - open Google Maps in browser
        window.open(`https://maps.google.com/?q=${encodedLocation}`, '_blank');
      }
    });
  }
}

// Enhanced mobile animations with performance optimization
function initMobileAnimations() {
  // Completely disabled to prevent flashing issues on mobile
  return;
}

// Enhanced mobile menu with better animations
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  // Toggle mobile menu with enhanced animations
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    
    // Add mobile-specific animation class
    if (mobileMenu.classList.contains('active')) {
      mobileMenu.classList.add('mobile-animating');
      
      // Stagger mobile nav link animations
      mobileNavLinks.forEach((link, index) => {
        setTimeout(() => {
          link.style.animation = `mobileNavSlide 0.6s cubic-bezier(0.4, 0, 0.2, 1) both`;
        }, index * 100);
      });
    }
  }
  
  // Close mobile menu with animation
  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    
    setTimeout(() => {
      mobileMenu.classList.remove('mobile-animating');
    }, 400);
  }
  
  // Event listeners
  hamburger.addEventListener('click', toggleMobileMenu);
  mobileMenuClose.addEventListener('click', closeMobileMenu);
  
  // Enhanced mobile navigation
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      // Add mobile touch feedback
      link.style.transform = 'scale(0.95)';
      setTimeout(() => {
        link.style.transform = '';
      }, 100);
      
      // Close menu first
      closeMobileMenu();
      
      // Enhanced mobile scroll with easing
      setTimeout(() => {
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          const startPos = window.pageYOffset;
          const distance = offsetTop - startPos;
          const duration = 800; // Faster for mobile
          let startTime = null;
          
          function mobileScrollAnimation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Mobile-optimized easing
            const easeProgress = progress < 0.5 
              ? 2 * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            window.scrollTo(0, startPos + distance * easeProgress);
            
            if (timeElapsed < duration) {
              requestAnimationFrame(mobileScrollAnimation);
            }
          }
          
          requestAnimationFrame(mobileScrollAnimation);
        }
      }, 300);
    });
  });
  
  // Mobile-specific event handlers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
  
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Prevent scrolling during envelope animation
  document.body.classList.add('envelope-active');
  
  // Start with envelope animation
  initEnvelopeAnimation();
  
  // Other initializations will be called after envelope animation
  // (moved to hideEnvelopeAndShowContent function)
  
  // Note: Balloon animation moved to hideEnvelopeAndShowContent to prevent skip issue
  
  // Add loading animation completion
  document.body.classList.add('loaded');
});

// Enhanced interactive effects
document.addEventListener('DOMContentLoaded', () => {
  // Enhanced button interactions
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${e.clientX - rect.left}px;
        top: ${e.clientY - rect.top}px;
        width: 20px;
        height: 20px;
        pointer-events: none;
      `;
      
      btn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add ripple animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    body.loaded .hero-content {
      animation: none;
    }
  `;
  document.head.appendChild(style);
  
  // Enhanced card click effects with sound simulation
  const cards = document.querySelectorAll('.detail-card, .menu-category');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.95)';
      
      // Create a subtle "pop" effect
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
      
      // Add a temporary glow effect
      card.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.4)';
      setTimeout(() => {
        card.style.boxShadow = '';
      }, 300);
    });
  });
});

// Konami code easter egg for extra animations
let konamiCode = [];
const konamiSequence = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.code);
  
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    // Activate party mode!
    document.body.style.animation = 'rainbow 2s infinite';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    // Add extra balloons with better distribution and varied animations
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        // Ensure even distribution across screen sections
        const section = i % 4; // Divide screen into 4 sections
        const sectionWidth = window.innerWidth / 4;
        const leftPos = (section * sectionWidth) + (Math.random() * (sectionWidth - 60));
        
        // Varied animation types
        const animationType = Math.random() < 0.5 ? 'float' : 'floatSlow';
        const duration = 2.5 + Math.random() * 2; // 2.5-4.5 seconds
        const delay = Math.random() * 0.5; // 0-0.5 second delay
        
        balloon.style.cssText = `
          position: fixed;
          width: ${50 + Math.random() * 20}px;
          height: ${70 + Math.random() * 20}px;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          background: linear-gradient(45deg, hsl(${Math.random() * 360}, 70%, 60%), hsl(${Math.random() * 360}, 70%, 60%));
          left: ${leftPos}px;
          bottom: -100px;
          animation: ${animationType} ${duration}s ease-out ${delay}s forwards;
          z-index: 1000;
          pointer-events: none;
          transform: rotate(${-10 + Math.random() * 20}deg);
        `;
        document.body.appendChild(balloon);
        
        setTimeout(() => balloon.remove(), 5000);
      }, i * 150);
    }
    
    konamiCode = [];
  }
});

// Continuous balloon system - DISABLED (CSS handles balloons now)
// let balloonInterval;
// let activeBalloons = 0;

function startContinuousBalloons() {
  // Disabled - CSS balloons are handling all balloon animations
  return;
}

function createBalloon() {
  // Disabled - CSS balloons are handling all balloon animations
  return;
}

// Stop balloons when page is hidden (optional cleanup)
document.addEventListener('visibilitychange', () => {
  if (document.hidden && balloonInterval) {
    clearInterval(balloonInterval);
  } else if (!document.hidden && balloonInterval === undefined) {
    // Restart if page becomes visible again
    startContinuousBalloons();
  }
});
