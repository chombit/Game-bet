import { motion } from 'motion/react';

interface PremiumRocketProps {
  className?: string;
}

export function PremiumRocket({ className }: PremiumRocketProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Main Body Glow */}
      <div className="absolute inset-0 blur-2xl bg-emerald-500/30 rounded-full animate-pulse" />
      
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
      >
        {/* Rocket Body */}
        <motion.path
          d="M50 5C50 5 30 40 30 70C30 85 40 95 50 95C60 95 70 85 70 70C70 40 50 5"
          fill="url(#body_grad)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        />
        
        {/* Cockpit Window */}
        <circle cx="50" cy="45" r="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <circle cx="48" cy="43" r="3" fill="#94a3b8" opacity="0.5" />
        
        {/* Fins */}
        <path d="M30 70L15 90C15 90 25 95 30 90V70Z" fill="#065f46" />
        <path d="M70 70L85 90C85 90 75 95 70 90V70Z" fill="#065f46" />
        <path d="M50 95V105L40 100H60L50 105V95Z" fill="#065f46" />

        {/* Engine Thruster (Main) */}
        <motion.ellipse
          cx="50" cy="100" rx="10" ry="15"
          fill="url(#engine_glow)"
          animate={{
            ry: [15, 25, 15],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 0.1, repeat: Infinity }}
        />

        {/* Secondary Thrusters */}
        <motion.ellipse
          cx="30" cy="90" rx="4" ry="8"
          fill="url(#engine_glow)"
          animate={{ ry: [8, 12, 8] }}
          transition={{ duration: 0.15, repeat: Infinity }}
        />
        <motion.ellipse
          cx="70" cy="90" rx="4" ry="8"
          fill="url(#engine_glow)"
          animate={{ ry: [8, 12, 8] }}
          transition={{ duration: 0.15, repeat: Infinity }}
        />

        <defs>
          <linearGradient id="body_grad" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fafc" />
            <stop offset="0.5" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <radialGradient id="engine_glow">
            <stop stopColor="#34d399" />
            <stop offset="0.7" stopColor="#059669" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Particle Trail Container */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-1 -z-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-16 rounded-full bg-gradient-to-t from-transparent via-emerald-500/50 to-emerald-400"
            animate={{
              height: [20, 60, 20],
              opacity: [0, 0.8, 0],
              y: [0, 20],
              filter: ['blur(0px)', 'blur(4px)']
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>
    </div>
  );
}
