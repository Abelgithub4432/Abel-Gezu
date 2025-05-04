// Experience data and rendering logic

// Experience data
const ExperienceData = [
  {
    name: "Adama Science and Technology University",
    issuer: "Computer Science and Engineering Student",
    date: "May 2021/2022 - Present",
    logo: "🔒",
  },
  {
    name: "Menas Cyber Solutions",
    issuer: "Cyber Security Intern",
    date: "June 2024 - September 2024",
    logo: "🔒",
  },
];

// Initialize and load Experience
export function loadExperience() {
  const ExperienceSlider = document.getElementById("ExperienceSlider");

  // Render each certification
  ExperienceData.forEach((certification) => {
    const certCard = createCertificationCard(certification);
    ExperienceSlider.appendChild(certCard);
  });

  // Setup slider functionality
  setupSlider();
}

// Create a certification card element
function createCertificationCard(certification) {
  const card = document.createElement("div");
  card.className = "certification-card";

  card.innerHTML = `
    <div class="certification-logo">${certification.logo}</div>
    <h3 class="certification-name">${certification.name}</h3>
    <div class="certification-issuer">${certification.issuer}</div>
    <div class="certification-date">${certification.date}</div>
  `;

  return card;
}

// Setup slider functionality
function setupSlider() {
  const slider = document.getElementById("ExperienceSlider");
  let isDown = false;
  let startX;
  let scrollLeft;

  // Mouse events for draggable slider
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    slider.scrollLeft = scrollLeft - walk;
  });

  // Add keyboard navigation for accessibility
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      slider.scrollLeft += 300;
    } else if (e.key === "ArrowLeft") {
      slider.scrollLeft -= 300;
    }
  });

  // Add scroll snap behavior for smoother experience
  slider.style.scrollBehavior = "smooth";
  slider.tabIndex = 0; // Make it focusable for keyboard navigation

  // Auto scroll animation
  let direction = 1;
  let autoScrollInterval;

  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      slider.scrollLeft += direction;

      // Change direction if we've reached the end
      if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
        direction = -1;
      } else if (slider.scrollLeft <= 0) {
        direction = 1;
      }
    }, 30);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  // Start auto-scroll when page loads
  startAutoScroll();

  // Stop auto-scroll when user interacts with slider
  slider.addEventListener("mouseenter", stopAutoScroll);
  slider.addEventListener("mouseleave", startAutoScroll);
  slider.addEventListener("touchstart", stopAutoScroll);
  slider.addEventListener("touchend", startAutoScroll);

  // Add animation to cards
  const cards = document.querySelectorAll(".certification-card");

  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add("fade-in");
  });
}

// Add a custom certification (for use from other modules)
export function addCustomCertification(certification) {
  ExperienceData.push(certification);

  // Re-render the slider
  const slider = document.getElementById("ExperienceSlider");
  slider.innerHTML = "";

  loadExperience();
}

// Export Experience data for use in other modules
export { ExperienceData };
