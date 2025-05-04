// Threat Map Visualization

// Configuration
const MAP_CONFIG = {
  width: 100,
  height: 50,
  updateInterval: 800,
  maxThreats: 25,
};

// Threat data for visualization
let threatPoints = [];
let attackCounter = 0;
let threatLevel = "Low";

// Initialize the threat map
export function initThreatMap() {
  const mapContainer = document.getElementById("threatMap");
  const attacksBlockedElement = document.getElementById("attacksBlocked");
  const threatLevelElement = document.getElementById("threatLevel");

  // Create the map grid
  createMapGrid(mapContainer);

  // Generate initial threats
  generateThreats(5);

  // Render the initial state
  renderMap();

  // Setup regular updates
  setInterval(() => {
    updateThreats();
    renderMap();
    updateStats(attacksBlockedElement, threatLevelElement);
  }, MAP_CONFIG.updateInterval);
}

// Create the map grid
function createMapGrid(container) {
  // Clear any existing content
  container.innerHTML = "";

  // Create a canvas element
  const canvas = document.createElement("canvas");
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  canvas.id = "threatCanvas";
  container.appendChild(canvas);

  // Add the scanline effect
  const scanline = document.createElement("div");
  scanline.className = "scanline";
  container.appendChild(scanline);
}

// Generate initial threat points
function generateThreats(count) {
  for (let i = 0; i < count; i++) {
    addThreatPoint();
  }
}

// Add a new threat point
function addThreatPoint() {
  const canvas = document.getElementById("threatCanvas");

  if (!canvas) return;

  const point = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    intensity: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
    growthRate: Math.random() * 0.02 - 0.01, // -0.01 to 0.01
    type: Math.random() > 0.7 ? "critical" : "normal",
    isActive: true,
  };

  threatPoints.push(point);

  // Limit max number of threats
  if (threatPoints.length > MAP_CONFIG.maxThreats) {
    threatPoints.shift();
  }
}

// Update threats for next frame
function updateThreats() {
  // Update existing threats
  threatPoints.forEach((point) => {
    // Randomly change intensity
    point.intensity += point.growthRate;

    // Keep intensity in bounds
    if (point.intensity > 1) {
      point.intensity = 1;
      point.growthRate *= -1;
    } else if (point.intensity < 0.1) {
      point.intensity = 0.1;
      point.growthRate *= -1;
    }

    // Randomly deactivate some threats (simulating blocked attacks)
    if (Math.random() < 0.1 && point.isActive) {
      point.isActive = false;
      attackCounter++;
    }
  });

  // Add new threats occasionally
  if (Math.random() < 0.3) {
    addThreatPoint();
  }

  // Update threat level based on active threats
  const activeThreats = threatPoints.filter((point) => point.isActive);
  const criticalThreats = activeThreats.filter(
    (point) => point.type === "critical"
  );

  if (criticalThreats.length >= 3) {
    threatLevel = "Critical";
  } else if (activeThreats.length > 10) {
    threatLevel = "High";
  } else if (activeThreats.length > 5) {
    threatLevel = "Medium";
  } else {
    threatLevel = "Low";
  }
}

// Render the threat map
function renderMap() {
  const canvas = document.getElementById("threatCanvas");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw background grid
  drawGrid(ctx, width, height);

  // Draw connection lines between active threats
  drawConnections(ctx);

  // Draw threat points
  drawThreats(ctx);
}

// Draw background grid
function drawGrid(ctx, width, height) {
  const gridSize = 20;

  ctx.beginPath();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x < width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  // Horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();
}

// Draw connections between threat points
function drawConnections(ctx) {
  const activeThreats = threatPoints.filter((point) => point.isActive);

  ctx.lineWidth = 1;

  // Draw lines between nearby threats
  for (let i = 0; i < activeThreats.length; i++) {
    for (let j = i + 1; j < activeThreats.length; j++) {
      const a = activeThreats[i];
      const b = activeThreats[j];

      // Calculate distance
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Draw line if points are close enough
      if (distance < 100) {
        // Opacity based on distance and intensity
        const opacity =
          (1 - distance / 100) * Math.min(a.intensity, b.intensity);

        // Color based on threat type
        let color;
        if (a.type === "critical" && b.type === "critical") {
          color = `rgba(255, 0, 60, ${opacity * 0.7})`;
        } else if (a.type === "critical" || b.type === "critical") {
          color = `rgba(255, 153, 0, ${opacity * 0.7})`;
        } else {
          color = `rgba(0, 132, 255, ${opacity * 0.7})`;
        }

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}

// Draw threat points
function drawThreats(ctx) {
  threatPoints.forEach((point) => {
    // Size based on intensity
    const radius = point.intensity * 8 + 2;

    // Gradient for each point
    const gradient = ctx.createRadialGradient(
      point.x,
      point.y,
      0,
      point.x,
      point.y,
      radius * 2
    );

    let innerColor, outerColor;

    if (!point.isActive) {
      // Blocked threat
      innerColor = "rgba(0, 255, 179, 0.8)";
      outerColor = "rgba(0, 255, 179, 0)";
    } else if (point.type === "critical") {
      // Critical threat
      innerColor = "rgba(255, 0, 60, 0.8)";
      outerColor = "rgba(255, 0, 60, 0)";
    } else {
      // Normal threat
      innerColor = "rgba(0, 132, 255, 0.8)";
      outerColor = "rgba(0, 132, 255, 0)";
    }

    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(1, outerColor);

    // Draw the point
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(point.x, point.y, radius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw inner circle
    ctx.beginPath();
    ctx.fillStyle = point.isActive
      ? point.type === "critical"
        ? "#ff003c"
        : "#0084ff"
      : "#00ffb3";
    ctx.arc(point.x, point.y, radius / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Update the stats display
function updateStats(attacksElement, levelElement) {
  if (attacksElement) {
    attacksElement.textContent = attackCounter;
  }

  if (levelElement) {
    levelElement.textContent = threatLevel;

    // Update color based on threat level
    switch (threatLevel) {
      case "Critical":
        levelElement.style.color = "var(--accent-danger)";
        break;
      case "High":
        levelElement.style.color = "var(--accent-warning)";
        break;
      case "Medium":
        levelElement.style.color = "var(--accent-secondary)";
        break;
      default:
        levelElement.style.color = "var(--accent-primary)";
    }
  }
}

// Simulate an attack (for external use)
export function simulateAttack(count = 1) {
  for (let i = 0; i < count; i++) {
    addThreatPoint();
  }

  renderMap();
}

// Clear all threats (for external use)
export function clearThreats() {
  threatPoints = [];
  renderMap();
}

// Export utility functions
export { threatPoints, attackCounter, threatLevel };
