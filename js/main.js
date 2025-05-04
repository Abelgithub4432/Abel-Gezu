// Main JavaScript file for the portfolio

// Import modules
import { initTerminal } from "./terminal.js";
import { initParticles } from "./particles.js";
import { loadSkills } from "./skills.js";
import { loadExperience } from "./Experience.js";
import { initThreatMap } from "./threatMap.js";

// DOM Elements
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const header = document.getElementById("header");
const downloadResumeBtn = document.getElementById("downloadResume");
const contactForm = document.getElementById("contactForm");
const currentYearSpan = document.getElementById("currentYear");
const yearsExperience = document.getElementById("yearsExperience");
const vulnerabilitiesFound = document.getElementById("vulnerabilitiesFound");

// Set current year
currentYearSpan.textContent = new Date().getFullYear();

// Initialize all components when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize components
  initTerminal();
  initParticles();
  loadSkills();
  loadExperience();
  initThreatMap();

  // Start animations and counters
  startAnimations();
  animateCounters();

  // Initialize event listeners
  initEventListeners();

  // Simulate encryption for the contact form
  simulateFormEncryption();
});

// Initialize event listeners
function initEventListeners() {
  // Toggle mobile navigation
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile nav when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Highlight active nav link on scroll
  window.addEventListener("scroll", () => {
    updateActiveNavLink();
    updateHeaderOnScroll();
  });

  // Handle resume download (simulate)
  downloadResumeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    simulateResumeDownload();
  });

  // Handle contact form submission
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleFormSubmission();
  });
}

// Update header style on scroll
function updateHeaderOnScroll() {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const scrollPosition = window.scrollY + 100;

  document.querySelectorAll("section").forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// Animate stat counters
function animateCounters() {
  animateValue(vulnerabilitiesFound, 0, 3, 3000);
}

// Animate a number from start to end over a duration
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Start animations for elements as they enter the viewport
function startAnimations() {
  const animateOnScroll = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    },
    { threshold: 0.1 }
  );

  // Select elements to animate
  document
    .querySelectorAll(".skill-category, .project-card")
    .forEach((element) => {
      animateOnScroll.observe(element);
    });
}

// Simulate resume download
function simulateResumeDownload() {
  const downloadBtn = document.getElementById("downloadResume");

  // Change button text to show loading
  downloadBtn.innerHTML = 'Preparing... <span class="loading-spinner"></span>';

  // Simulate download delay
  setTimeout(() => {
    // Reset button text
    downloadBtn.innerHTML = 'Download Resume <span class="icon">📄</span>';

    // Alert user (in real site, this would trigger actual download)
    alert("Resume download would start now in a real application.");
  }, 1500);
}

// Simulate form encryption
function simulateFormEncryption() {
  const encryptionStatus = document.getElementById("encryptionStatus");
  const formInputs = document.querySelectorAll(
    ".contact-form input, .contact-form textarea"
  );

  formInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      encryptionStatus.textContent = "Encryption Active";
      encryptionStatus.classList.add("active");
    });

    input.addEventListener("blur", () => {
      encryptionStatus.textContent = "Secure Connection";
      encryptionStatus.classList.remove("active");
    });
  });
}

// Handle contact form submission
function handleFormSubmission() {
  const formBtn = contactForm.querySelector('button[type="submit"]');
  const originalBtnText = formBtn.innerHTML;

  // Show loading state
  formBtn.innerHTML = 'Encrypting... <span class="loading-spinner"></span>';
  formBtn.disabled = true;

  setTimeout(() => {
    formBtn.innerHTML = 'Sending... <span class="loading-spinner"></span>';

    setTimeout(() => {
      // Reset form and button
      contactForm.reset();
      formBtn.innerHTML = originalBtnText;
      formBtn.disabled = false;

      // Show success message
      showNotification("Message sent successfully!", "success");
    }, 1500);
  }, 1500);
}

// Show notification
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Add to document
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Remove after delay
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Export utility functions that might be needed by other modules
export { showNotification };
