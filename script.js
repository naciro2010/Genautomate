const form = document.getElementById('contactForm');
const statusEl = document.querySelector('.form-status');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    statusEl.textContent = `Merci ${name || ''}! Nous revenons vers vous sous 24h.`;
    form.reset();
  });
}

// Simple scrollspy to highlight the active section link
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
