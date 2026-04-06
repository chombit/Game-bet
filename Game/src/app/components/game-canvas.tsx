import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Stars } from 'lucide-react';
import { PremiumRocket } from './premium/premium-rocket';

interface GameCanvasProps {
  multiplier: number;
  gameState: 'WAITING' | 'COUNTDOWN' | 'FLYING' | 'CRASHED';
  progress: number;
  history: number[];
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

class Particle {
  x: number; y: number; vx: number; vy: number; life: number; color: string; size: number;
  constructor(x: number, y: number, color: string) {
    this.x = x; this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1.0;
    this.color = color;
    this.size = Math.random() * 4 + 2;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.1; // Gravity
    this.life -= 0.02;
  }
}

export function GameCanvas({ multiplier, gameState, progress, history }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showWarp, setShowWarp] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    setShowWarp(multiplier > 10);
  }, [multiplier]);

  // Procedural stars for parallax
  const stars = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.8 ? '#60a5fa' : '#ffffff',
    }));
  }, []);

  // Trigger explosion
  useEffect(() => {
    if (gameState === 'CRASHED' && canvasRef.current) {
      const width = canvasRef.current.offsetWidth;
      const height = canvasRef.current.offsetHeight;
      const x = progress * width;
      const curveMultiplier = 1 + progress * (multiplier - 1);
      const normalizedY = Math.log(curveMultiplier) / Math.log(multiplier || 2);
      const y = height - (normalizedY * height * 0.75) - height * 0.1;

      const colors = ['#ef4444', '#f97316', '#fbbf24', '#ffffff'];
      for (let i = 0; i < 60; i++) {
        particlesRef.current.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
      }
    }
  }, [gameState]);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Use proper pixel ratio for crispness
    if (canvas.width !== width * window.devicePixelRatio) {
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    ctx.clearRect(0, 0, width, height);

    // Draw sophisticated grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * width;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      const y = (i / 20) * height;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    if (gameState === 'FLYING' || gameState === 'CRASHED') {
      const isCrashed = gameState === 'CRASHED';
      
      // Draw path with glow
      ctx.strokeStyle = isCrashed ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.8)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 15;
      ctx.shadowColor = isCrashed ? '#ef4444' : '#22c55e';

      ctx.beginPath();
      const points = 100;
      const currentPoints = Math.floor(points * (isCrashed ? 1 : progress));
      
      for (let i = 0; i <= currentPoints; i++) {
        const t = i / points;
        const x = t * width;
        const curveMultiplier = 1 + t * (multiplier - 1);
        const normalizedY = Math.log(curveMultiplier) / Math.log(multiplier || 2);
        const y = height - (normalizedY * height * 0.75) - height * 0.1;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Fill area under path
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, isCrashed ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.15)');
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let i = 0; i <= currentPoints; i++) {
        const t = i / points;
        const x = t * width;
        const curveMultiplier = 1 + t * (multiplier - 1);
        const normalizedY = Math.log(curveMultiplier) / Math.log(multiplier || 2);
        const y = height - (normalizedY * height * 0.75) - height * 0.1;
        ctx.lineTo(x, y);
      }
      ctx.lineTo((currentPoints / points) * width, height);
      ctx.fill();
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    particlesRef.current.forEach(p => {
      p.update();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, progress, multiplier]);

  const isCrashed = gameState === 'CRASHED';
  const isFlying = gameState === 'FLYING';

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/5 bg-black shadow-2xl">
      {/* Background Layers */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{
          x: isFlying ? [0, -20, 0] : 0,
          scale: isFlying ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <img 
          src="/assets/images/nebula.png" 
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
          alt="Nebula"
        />
      </motion.div>

      {/* Parallax Stars */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        {stars.map((star: Star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              opacity: star.opacity,
            }}
            animate={{
              x: isFlying ? -(progress * 1000 * star.speed) : 0,
              opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
            }}
            transition={{
              x: { duration: 0.1, ease: 'linear' },
              opacity: { duration: 2 + Math.random() * 2, repeat: Infinity }
            }}
          />
        ))}
      </div>

      {/* Warp Speed Lines */}
      <AnimatePresence>
        {showWarp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-2 overflow-hidden pointer-events-none"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-[1px] bg-white rounded-full"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  left: '110%',
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ x: '-250vw' }}
                transition={{
                  duration: Math.random() * 0.5 + 0.2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'linear'
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trajectory & Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10"
      />

      {/* UI Overlay */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Network Stable</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold">
            SESSION ACTIVE
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Round ID</span>
            <span className="text-xs font-mono text-white/80">#294,851</span>
          </div>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </button>
        </div>
      </div>

      {/* Multiplier Display */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <motion.div
          animate={{
            scale: isFlying ? [1, 1.02, 1] : 1,
            y: isFlying ? [0, -5, 0] : 0,
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="relative text-center"
        >
          <motion.h2
            className={`text-9xl md:text-[14rem] font-black tracking-tighter transition-colors duration-300 ${
              isCrashed ? 'text-red-500' : isFlying ? 'text-white' : 'text-white/20'
            }`}
            style={{ textShadow: isFlying ? '0 0 80px rgba(255,255,255,0.3)' : 'none' }}
          >
            {multiplier.toFixed(2)}<span className="text-5xl md:text-7xl">x</span>
          </motion.h2>
          
          {isCrashed && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-[-2rem] px-6 py-2 rounded-2xl bg-red-500 text-white font-black text-2xl uppercase tracking-widest shadow-2xl shadow-red-500/50"
            >
              Flew Away!
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Rocket */}
      {isFlying && (
        <motion.div
          className="absolute z-30"
          style={{
            left: `${5 + progress * 85}%`,
            bottom: `${15 + (Math.log(multiplier) / Math.log(20)) * 70}%`,
          }}
        >
          <motion.div
            animate={{ 
              rotate: [15, 25, 15],
              y: [0, -4, 0]
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <PremiumRocket className="w-24 h-24" />
          </motion.div>
        </motion.div>
      )}

      {/* Explosion Glow */}
      <AnimatePresence>
        {isCrashed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none"
          >
            <div className="w-[500px] h-[500px] rounded-full bg-red-500/10 blur-[120px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
