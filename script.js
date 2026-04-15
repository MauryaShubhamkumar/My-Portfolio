/* ==========================================
   SKM Portfolio — Premium Script
   ========================================== */

/* ── Custom Cursor ── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});
(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();
document.querySelectorAll('a, button, .btn, .sci-link, .project-card, .nav-link').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

/* ── Particle Canvas ── */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x      = Math.random() * canvas.width;
    this.y      = Math.random() * canvas.height;
    this.size   = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color  = Math.random() > 0.5 ? '#00d4ff' : '#7b2ff7';
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color; ctx.fill(); ctx.globalAlpha = 1;
  }
}
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.globalAlpha = (1 - dist/120) * 0.15;
        ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 0.5; ctx.stroke(); ctx.globalAlpha = 1;
      }
    }
  }
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ── Typed Text ── */
const roles = ['Frontend Developer','C++ Programmer','Student at IIT Jammu','UI/UX Enthusiast','Problem Solver'];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function typeRole() {
  const current = roles[roleIndex];
  if (isDeleting) { typedEl.textContent = current.substring(0, charIndex - 1); charIndex--; }
  else            { typedEl.textContent = current.substring(0, charIndex + 1); charIndex++; }
  let delay = isDeleting ? 60 : 110;
  if (!isDeleting && charIndex === current.length) { delay = 1800; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 400; }
  setTimeout(typeRole, delay);
}
setTimeout(typeRole, 800);

/* ── Sticky Header ── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => { header.classList.toggle('sticky', window.scrollY > 80); });

/* ── Mobile Menu ── */
const menuIcon = document.getElementById('menu-icon');
const navbar   = document.getElementById('navbar');
menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
});

/* ── Scroll Reveal ── */
const reveals = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

/* ── Skill Bars ── */
const skillSection = document.querySelector('#skills');
let skillsAnimated = false;
const skillObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !skillsAnimated) {
    skillsAnimated = true;
    document.querySelectorAll('.skill-fill').forEach(fill => { fill.style.width = fill.getAttribute('data-width') + '%'; });
  }
}, { threshold: 0.2 });
if (skillSection) skillObserver.observe(skillSection);

/* ── Active Nav on Scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + 150;
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sec.id) link.classList.add('active');
      });
    }
  });
  menuIcon.classList.remove('bx-x');
  navbar.classList.remove('active');
});

/* ── Project Card 3D Tilt ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 15;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -15;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── Stats Counter ── */
const statNumbers = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const num = parseInt(text);
      if (!isNaN(num)) {
        let count = 0;
        const step = Math.ceil(num / 40);
        const timer = setInterval(() => {
          count += step;
          if (count >= num) { count = num; clearInterval(timer); }
          el.textContent = count + (text.includes('+') ? '+' : '');
        }, 40);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(n => counterObserver.observe(n));

/* ── Contact Form — Formspree AJAX ── */
const contactForm = document.getElementById('contact-form');
const toast       = document.getElementById('form-toast');
const submitBtn   = document.getElementById('submit-btn');

function showToast(message, type) {
  toast.textContent = message;
  toast.className   = 'form-toast show ' + type;
  setTimeout(() => { toast.className = 'form-toast'; }, 5000);
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span><i class="bx bx-loader-circle bx-spin"></i>';
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });
      if (response.ok) {
        showToast('✅ Message sent! I\'ll get back to you soon.', 'toast-success');
        contactForm.reset();
      } else {
        const data = await response.json();
        const errMsg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Something went wrong.';
        showToast('❌ ' + errMsg, 'toast-error');
      }
    } catch {
      showToast('❌ Network error. Check your connection.', 'toast-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Send Message</span><i class="bx bxs-send"></i>';
    }
  });
}
