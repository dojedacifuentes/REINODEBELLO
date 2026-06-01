"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  alpha: number;
};

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let frame = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(96, Math.max(42, Math.floor((width * height) / 26000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.08 - Math.random() * 0.22,
        size: 0.8 + Math.random() * 2.2,
        hue: Math.random() > 0.68 ? 43 : Math.random() > 0.4 ? 190 : 264,
        alpha: 0.15 + Math.random() * 0.48,
      }));
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.vx + Math.sin(frame * 0.006 + particle.y * 0.01) * 0.05;
        particle.y += particle.vy;

        if (particle.y < -12) {
          particle.y = height + 12;
          particle.x = Math.random() * width;
        }
        if (particle.x < -12) {
          particle.x = width + 12;
        }
        if (particle.x > width + 12) {
          particle.x = -12;
        }

        const glow = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 6,
        );
        glow.addColorStop(0, `hsla(${particle.hue}, 92%, 66%, ${particle.alpha})`);
        glow.addColorStop(1, `hsla(${particle.hue}, 92%, 66%, 0)`);
        context.fillStyle = glow;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
        context.fill();
      }

      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 mix-blend-screen opacity-70"
    />
  );
}
