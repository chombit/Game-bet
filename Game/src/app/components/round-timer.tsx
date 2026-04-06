import { motion } from 'motion/react';
import { Clock, Rocket } from 'lucide-react';

interface RoundTimerProps {
  countdown: number;
  gameState: 'WAITING' | 'COUNTDOWN' | 'FLYING' | 'CRASHED';
}

export function RoundTimer({ countdown, gameState }: RoundTimerProps) {
  if (gameState !== 'COUNTDOWN') return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        {/* Pulsing rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-400"
            style={{
              width: '200px',
              height: '200px',
            }}
            animate={{
              scale: [1, 2.5, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}

        <div className="relative flex flex-col items-center gap-6 bg-gradient-to-br from-gray-900 to-black border-4 border-yellow-400 rounded-3xl p-12 shadow-2xl">
          {/* Rotating rocket */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            <Rocket className="w-20 h-20 text-yellow-400" />
          </motion.div>

          {/* Countdown number */}
          <motion.div
            key={countdown}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ type: 'spring', damping: 8 }}
            className="relative"
          >
            <div className="absolute inset-0 blur-3xl bg-yellow-400 opacity-60" />
            <div
              className="relative text-[10rem] font-black text-yellow-400"
              style={{
                WebkitTextStroke: '4px rgba(0,0,0,0.5)',
                fontFamily: 'system-ui',
              }}
            >
              {countdown}
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="text-2xl font-bold text-yellow-400 tracking-[0.3em] uppercase"
          >
            Get Ready
          </motion.div>

          {/* Progress bar */}
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 1, ease: 'linear' }}
              key={countdown}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
