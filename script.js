// ============================================
// 1. FORM HANDLING
// ============================================
const form = document.getElementById('contactForm');
const statusEl = document.querySelector('.form-status');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    statusEl.textContent = `Merci ${name || ''}! Nous revenons vers vous sous 24h.`;
    statusEl.style.color = 'var(--primary)';
    form.reset();

    // Hide message after 5 seconds
    setTimeout(() => {
      statusEl.textContent = '';
    }, 5000);
  });
}

// ============================================
// 2. NAVIGATION SCROLLSPY
// ============================================
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const sections = Array.from(navLinks).map((link) => document.querySelector(link.getAttribute('href')));

const highlightNav = () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach((section, idx) => {
    const link = navLinks[idx];
    if (!section) return;
    const inView = scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight;
    link.classList.toggle('active', inView);
  });
};

document.addEventListener('scroll', highlightNav);
document.addEventListener('DOMContentLoaded', highlightNav);

// ============================================
// 3. ROI CALCULATOR
// ============================================
const employeesInput = document.getElementById('employees');
const hourlyRateInput = document.getElementById('hourly-rate');
const manualHoursInput = document.getElementById('manual-hours');
const automationPercentInput = document.getElementById('automation-percent');
const rangeValueSpan = document.querySelector('.range-value');

function calculateROI() {
  const employees = parseInt(employeesInput?.value || 10);
  const hourlyRate = parseInt(hourlyRateInput?.value || 35);
  const manualHours = parseInt(manualHoursInput?.value || 20);
  const automationPercent = parseInt(automationPercentInput?.value || 60);

  // Update range display
  if (rangeValueSpan) {
    rangeValueSpan.textContent = automationPercent + '%';
  }

  // Update range background
  if (automationPercentInput) {
    const percentage = automationPercent;
    automationPercentInput.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`;
  }

  // Calculate savings
  const hoursSaved = employees * manualHours * (automationPercent / 100);
  const monthlySavings = hoursSaved * hourlyRate;
  const yearlySavings = monthlySavings * 12;

  // Assuming average project cost of 25,000€
  const projectCost = 25000;
  const roi = ((yearlySavings - projectCost) / projectCost) * 100;

  // Update display
  const monthlySavingsEl = document.getElementById('monthly-savings');
  const yearlySavingsEl = document.getElementById('yearly-savings');
  const hoursSavedEl = document.getElementById('hours-saved');
  const roiPercentEl = document.getElementById('roi-percent');

  if (monthlySavingsEl) monthlySavingsEl.textContent = Math.round(monthlySavings).toLocaleString('fr-FR') + ' €';
  if (yearlySavingsEl) yearlySavingsEl.textContent = Math.round(yearlySavings).toLocaleString('fr-FR') + ' €';
  if (hoursSavedEl) hoursSavedEl.textContent = Math.round(hoursSaved) + ' h';
  if (roiPercentEl) roiPercentEl.textContent = Math.round(roi) + '%';

  // Draw chart
  drawROIChart(monthlySavings, projectCost);
}

function drawROIChart(monthlySavings, projectCost) {
  const canvas = document.getElementById('roi-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Calculate data for 12 months
  const months = 12;
  const data = [];
  let cumulative = -projectCost;

  for (let i = 0; i <= months; i++) {
    data.push(cumulative);
    cumulative += monthlySavings;
  }

  // Find min and max for scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;

  // Draw axes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, height - 30);
  ctx.lineTo(width - 20, height - 30);
  ctx.stroke();

  // Draw zero line
  const zeroY = height - 30 - ((0 - minValue) / range) * (height - 60);
  ctx.strokeStyle = 'rgba(109, 211, 255, 0.3)';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(40, zeroY);
  ctx.lineTo(width - 20, zeroY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw line
  ctx.strokeStyle = '#6dd3ff';
  ctx.lineWidth = 3;
  ctx.beginPath();

  const stepX = (width - 60) / months;
  data.forEach((value, i) => {
    const x = 40 + i * stepX;
    const y = height - 30 - ((value - minValue) / range) * (height - 60);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // Draw points
  data.forEach((value, i) => {
    const x = 40 + i * stepX;
    const y = height - 30 - ((value - minValue) / range) * (height - 60);

    ctx.fillStyle = value >= 0 ? '#6dd3ff' : '#9b8cff';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Labels
  ctx.fillStyle = '#b8c4e6';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('0', 40, height - 10);
  ctx.fillText('12 mois', width - 20, height - 10);

  ctx.textAlign = 'right';
  ctx.fillText('ROI', 35, 20);
}

// Attach event listeners for ROI calculator
if (employeesInput) employeesInput.addEventListener('input', calculateROI);
if (hourlyRateInput) hourlyRateInput.addEventListener('input', calculateROI);
if (manualHoursInput) manualHoursInput.addEventListener('input', calculateROI);
if (automationPercentInput) automationPercentInput.addEventListener('input', calculateROI);

// Initial calculation
document.addEventListener('DOMContentLoaded', calculateROI);

// ============================================
// 4. ANIMATED STATS COUNTER
// ============================================
function animateStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.textContent === '0') {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, 0, target, 2000);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);

    element.textContent = current.toLocaleString('fr-FR');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = end.toLocaleString('fr-FR');
    }
  }

  requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', animateStatCounters);

// ============================================
// 5. CHATBOT FUNCTIONALITY
// ============================================
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotMessages = document.getElementById('chatbot-messages');

const botResponses = {
  'roi': 'Je vous invite à utiliser notre calculateur ROI ci-dessus pour estimer vos économies potentielles !',
  'services': 'Nous offrons 3 services principaux : Automatisations métier, Assistants IA, et Sites & Portails. Que souhaitez-vous automatiser ?',
  'prix': 'Nos offres commencent à 3 500€ pour un Sprint Impact. Consultez la section Offres pour plus de détails !',
  'contact': 'Vous pouvez nous contacter à hello@ayautomate.com ou remplir le formulaire de contact en bas de page.',
  'appel': 'Pour réserver un appel découverte, cliquez sur "Parlons-en" en haut de page ou contactez-nous directement !',
  'default': 'Je suis là pour vous aider ! Posez-moi des questions sur nos services, tarifs, ou demandez à calculer votre ROI.'
};

function addChatMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = text;

  messageDiv.appendChild(contentDiv);
  chatbotMessages.appendChild(messageDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getBotResponse(userMessage) {
  const message = userMessage.toLowerCase();

  if (message.includes('roi') || message.includes('économ') || message.includes('gagn')) {
    return botResponses.roi;
  } else if (message.includes('service') || message.includes('offre') || message.includes('proposez')) {
    return botResponses.services;
  } else if (message.includes('prix') || message.includes('coût') || message.includes('tarif')) {
    return botResponses.prix;
  } else if (message.includes('contact') || message.includes('email') || message.includes('joindre')) {
    return botResponses.contact;
  } else if (message.includes('appel') || message.includes('rendez-vous') || message.includes('réserver')) {
    return botResponses.appel;
  } else {
    return botResponses.default;
  }
}

function sendChatMessage() {
  const message = chatbotInput.value.trim();
  if (!message) return;

  addChatMessage(message, true);
  chatbotInput.value = '';

  // Simulate bot thinking
  setTimeout(() => {
    const response = getBotResponse(message);
    addChatMessage(response, false);
  }, 500);
}

if (chatbotToggle) {
  chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('hidden');
  });
}

if (chatbotClose) {
  chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.add('hidden');
  });
}

if (chatbotSend) {
  chatbotSend.addEventListener('click', sendChatMessage);
}

if (chatbotInput) {
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });
}

// Quick replies
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('quick-reply')) {
    const message = e.target.textContent;
    chatbotInput.value = message;
    sendChatMessage();
    e.target.parentElement.remove();
  }
});

// ============================================
// 6. SCROLL TO TOP BUTTON
// ============================================
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn?.classList.remove('hidden');
  } else {
    scrollTopBtn?.classList.add('hidden');
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// 7. INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    animateOnScroll.observe(section);
  });
});

// ============================================
// 8. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// 9. PERFORMANCE MONITORING
// ============================================
if ('PerformanceObserver' in window) {
  try {
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.renderTime || entry.loadTime);
        }
      }
    });
    perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // Performance observer not supported
  }
}

// ============================================
// 10. EASTER EGG - KONAMI CODE
// ============================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(',') === konamiSequence.join(',')) {
    document.body.style.animation = 'pulse 0.5s ease-in-out 3';
    addChatMessage('🎉 Konami code activé ! Vous êtes un vrai geek de l\'automatisation !', false);
    if (chatbotWindow) chatbotWindow.classList.remove('hidden');
  }
});

console.log('🚀 AY Automate - Site ultra-optimisé chargé avec succès !');
console.log('💡 Essayez le code Konami pour un easter egg...');
