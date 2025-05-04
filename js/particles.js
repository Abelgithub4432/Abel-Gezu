// Particle animation for the background

// Configuration for the particle system
const PARTICLE_CONFIG = {
  particles: 80,
  maxSpeed: 0.5,
  maxSize: 3,
  connectionDistance: 150,
  colors: [
    "rgba(0, 255, 179, 0.6)",
    "rgba(0, 132, 255, 0.6)",
    "rgba(255, 0, 60, 0.6)",
  ],
};

// Particle class to represent each dot
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.reset();
  }

  // Initialize particle with random properties
  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * PARTICLE_CONFIG.maxSize + 1;
    this.speedX = (Math.random() - 0.5) * PARTICLE_CONFIG.maxSpeed;
    this.speedY = (Math.random() - 0.5) * PARTICLE_CONFIG.maxSpeed;
    this.color =
      PARTICLE_CONFIG.colors[
        Math.floor(Math.random() * PARTICLE_CONFIG.colors.length)
      ];
    this.alpha = Math.random() * 0.5 + 0.5;
  }

  // Update particle position
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) {
      this.speedX = -this.speedX;
    }

    if (this.y < 0 || this.y > this.canvas.height) {
      this.speedY = -this.speedY;
    }

    // Reset if particle somehow escapes
    if (
      this.x < -50 ||
      this.x > this.canvas.width + 50 ||
      this.y < -50 ||
      this.y > this.canvas.height + 50
    ) {
      this.reset();
    }
  }

  // Draw the particle
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }
}

// ParticleSystem to manage all particles
class ParticleSystem {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement("canvas");
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.particles = [];
    this.paused = false;
    this.lastFrameTime = 0;

    // Initialize system
    this.init();

    // Resize listener
    window.addEventListener("resize", () => this.resize());
  }

  // Initialize the particle system
  init() {
    this.resize();

    // Create particles
    for (let i = 0; i < PARTICLE_CONFIG.particles; i++) {
      this.particles.push(new Particle(this.canvas));
    }

    // Start animation loop
    this.animate();

    // Add mouse interaction
    this.initMouseInteraction();
  }

  // Resize canvas when window changes
  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }

  // Animation loop
  animate(timestamp = 0) {
    if (this.paused) return;

    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.updateParticles();

    // Draw connections between particles
    this.drawConnections();

    // Request next frame
    requestAnimationFrame(this.animate.bind(this));
  }

  // Update all particles
  updateParticles() {
    for (const particle of this.particles) {
      particle.update();
      particle.draw();
    }
  }

  // Draw connections between nearby particles
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < PARTICLE_CONFIG.connectionDistance) {
          const opacity = 1 - distance / PARTICLE_CONFIG.connectionDistance;

          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(0, 255, 179, ${opacity * 0.2})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  // Mouse interaction to influence particles
  initMouseInteraction() {
    let mouseX = 0;
    let mouseY = 0;
    let isMouseActive = false;

    // Track mouse position
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseActive = true;

      // Affect nearby particles
      this.influenceParticles(mouseX, mouseY);
    });

    // Reset mouse state when leaving
    this.canvas.addEventListener("mouseleave", () => {
      isMouseActive = false;
    });
  }

  // Influence particles near mouse
  influenceParticles(mouseX, mouseY) {
    const influenceRadius = 100;

    for (const particle of this.particles) {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < influenceRadius) {
        // Subtle push away effect
        const forceX = (dx / distance) * 0.2;
        const forceY = (dy / distance) * 0.2;

        particle.speedX -= forceX;
        particle.speedY -= forceY;

        // Limit max speed
        const speed = Math.sqrt(
          particle.speedX * particle.speedX + particle.speedY * particle.speedY
        );
        if (speed > PARTICLE_CONFIG.maxSpeed * 2) {
          particle.speedX =
            (particle.speedX / speed) * PARTICLE_CONFIG.maxSpeed * 2;
          particle.speedY =
            (particle.speedY / speed) * PARTICLE_CONFIG.maxSpeed * 2;
        }
      }
    }
  }

  // Pause animation
  pause() {
    this.paused = true;
  }

  // Resume animation
  resume() {
    if (this.paused) {
      this.paused = false;
      this.lastFrameTime = performance.now();
      this.animate();
    }
  }
}

// Initialize the particle system
export function initParticles() {
  const container = document.getElementById("particle-container");

  if (container) {
    const particleSystem = new ParticleSystem(container);

    // Optimize by pausing when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          particleSystem.resume();
        } else {
          particleSystem.pause();
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);

    return particleSystem;
  }

  return null;
}
