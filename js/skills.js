// Skills data and rendering logic

// Skills data
const skillsData = {
  offensive: [
    { name: "Penetration Testing", level: 95 },
    { name: "Vulnerability Assessment", level: 90 },
    { name: "Web Application Security", level: 88 },
    { name: "Social Engineering", level: 85 },
  ],
  tools: [
    { name: "Kali Linux", level: 95 },
    { name: "Metasploit", level: 90 },
    { name: "Burp Suite", level: 92 },
    { name: "Wireshark", level: 88 },
    { name: "Nmap", level: 95 },
    { name: "OWASP ZAP", level: 85 },
    { name: "Nessus", level: 82 },
  ],
};

// Initialize and load skills
export function loadSkills() {
  const offensiveSkillsContainer = document.getElementById("offensiveSkills");
  const securityToolsContainer = document.getElementById("securityTools");

  // Render each skill category
  renderSkills(skillsData.offensive, offensiveSkillsContainer);
  renderSkills(skillsData.tools, securityToolsContainer);

  // Setup animation on scroll
  setupAnimationOnScroll();
}

// Render skills for a category
function renderSkills(skills, container) {
  skills.forEach((skill) => {
    const skillItem = createSkillItem(skill);
    container.appendChild(skillItem);
  });
}

// Create a skill item element
function createSkillItem(skill) {
  const skillItem = document.createElement("div");
  skillItem.className = "skill-item";

  skillItem.innerHTML = `
    <span class="skill-name">${skill.name}</span>
    <div class="skill-level">
      <div class="skill-level-bar" style="--fill-percent: ${skill.level}%"></div>
    </div>
  `;

  return skillItem;
}

// Setup animation to trigger when scrolled into view
function setupAnimationOnScroll() {
  const skillBars = document.querySelectorAll(".skill-level-bar");
  const skillCategories = document.querySelectorAll(".skill-category");

  // IntersectionObserver for skill categories
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");

          // Animate skill bars within this category
          const bars = entry.target.querySelectorAll(".skill-level-bar");
          bars.forEach((bar, index) => {
            setTimeout(() => {
              bar.style.width = bar.style.getPropertyValue("--fill-percent");
            }, index * 100);
          });

          // Unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe all skill categories
  skillCategories.forEach((category) => {
    observer.observe(category);
  });
}

// Add a custom skill (for use from other modules)
export function addCustomSkill(category, name, level) {
  const newSkill = { name, level };

  switch (category) {
    case "offensive":
      skillsData.offensive.push(newSkill);
      break;
    case "defensive":
      skillsData.defensive.push(newSkill);
      break;
    case "tools":
      skillsData.tools.push(newSkill);
      break;
    default:
      return false;
  }

  // Re-render the appropriate container
  const containerMap = {
    offensive: "offensiveSkills",
    defensive: "defensiveSkills",
    tools: "securityTools",
  };

  const container = document.getElementById(containerMap[category]);
  if (container) {
    container.innerHTML = "";
    renderSkills(skillsData[category], container);
    setupAnimationOnScroll();
  }

  return true;
}

// Export skill data for use in other modules
export { skillsData };
