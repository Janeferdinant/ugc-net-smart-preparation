/**
 * Ambient Interactive Particle System with Connection Mesh & Reduced Motion Guard
 * Author: Jane Rose | Asst. Professor | CSE
 */

export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 55;
    this.maxDistance = 110;
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.isRunning = true;
    this.animId = null;

    this.resize();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    // Adjust density based on screen width
    const count = window.innerWidth < 768 ? 25 : this.maxParticles;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.2
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
    });
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--user-accent').trim() || '#38bdf8';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Mouse interactive repelling
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        p.x -= (dx / dist) * force * 2.5;
        p.y -= (dy / dist) * force * 2.5;
      }

      // Draw particle dot
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = accent;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();

      // Connect nearby particles with luminous lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist2 < this.maxDistance) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = accent;
          this.ctx.globalAlpha = (1 - dist2 / this.maxDistance) * 0.22;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    this.ctx.globalAlpha = 1.0;
    this.animId = requestAnimationFrame(() => this.animate());
  }

  setPaused(paused) {
    this.isRunning = !paused;
    if (this.isRunning && !this.animId) {
      this.animate();
    }
  }
}
