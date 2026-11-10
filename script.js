// Portfolio interactions: mobile menu, theme switcher, image viewer, and gentle animations.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) {
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    }
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Light/dark mode. The selected theme is remembered on this device.
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") document.documentElement.dataset.theme = "dark";

function updateThemeButton() {
  const isDark = document.documentElement.dataset.theme === "dark";
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
}
updateThemeButton();

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  if (nextTheme === "dark") document.documentElement.dataset.theme = "dark";
  else delete document.documentElement.dataset.theme;
  localStorage.setItem("portfolio-theme", nextTheme);
  updateThemeButton();
});

// View images in an on-page lightbox (no new tab or external page).
const imageItems = [...document.querySelectorAll(".viewable-image")];
const lightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeButton = document.getElementById("lightboxClose");
let activeImageIndex = 0;

function showImage(index) {
  activeImageIndex = (index + imageItems.length) % imageItems.length;
  const selected = imageItems[activeImageIndex];
  lightboxImage.src = selected.currentSrc || selected.src;
  lightboxImage.alt = selected.alt;
  lightboxCaption.textContent = selected.alt;
}
function openLightbox(index) {
  showImage(index);
  lightbox.classList.add("visible");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  closeButton.focus();
}
function closeLightbox() {
  lightbox.classList.remove("visible");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}
imageItems.forEach((img, index) => {
  img.addEventListener("click", () => openLightbox(index));
  img.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });
});
closeButton.addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => showImage(activeImageIndex - 1));
document.getElementById("lightboxNext").addEventListener("click", () => showImage(activeImageIndex + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("visible")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(activeImageIndex - 1);
  if (event.key === "ArrowRight") showImage(activeImageIndex + 1);
});

// Reveal sections/cards as they enter the viewport.
const animatedElements = document.querySelectorAll(
  ".hero-copy, .hero-photo, .section-heading, .about-photo, .about-content, .project-card, .contact-grid > *, .footer-content"
);
animatedElements.forEach((element, index) => {
  element.classList.add("reveal");
  if (element.classList.contains("project-card")) element.style.transitionDelay = `${(index % 3) * 100}ms`;
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  animatedElements.forEach((element) => observer.observe(element));
} else {
  animatedElements.forEach((element) => element.classList.add("revealed"));
}
