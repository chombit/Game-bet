import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History } from 'lucide-react';

interface HistoryBarProps {
  history: number[];
}

export function HistoryBar({ history }: HistoryBarProps) {
  const getColor = (val: number) => {
    if (val < 2) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (val < 10) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  };

  return (
    <div className="flex items-center gap-3 w-full p-3 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-2 pr-4 border-r border-white/10 shrink-0">
        <History className="w-4 h-4 text-white/40" />
        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">History</span>
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <AnimatePresence initial={false}>
          {history.map((val, idx) => (
            <motion.div
              key={`${idx}-${val}`}
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              className={`px-3 py-1 rounded-lg border text-xs font-black min-w-[50px] text-center ${getColor(val)}`}
            >
              {val.toFixed(2)}x
            </motion.div>
          )).reverse()}
        </AnimatePresence>
      </div>
    </div>
  );
}
