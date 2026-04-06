import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';

interface StatsData {
  totalPlayers: number;
  totalBets: number;
  biggestWin: number;
  averageMultiplier: number;
}

interface StatsPanelProps {
  stats: StatsData;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-950 to-blue-900 border border-blue-500/50 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-blue-300 font-semibold">PLAYERS</span>
        </div>
        <div className="text-2xl font-black text-white">
          {stats.totalPlayers}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-purple-950 to-purple-900 border border-purple-500/50 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-purple-300 font-semibold">TOTAL BETS</span>
        </div>
        <div className="text-2xl font-black text-white">
          {stats.totalBets.toFixed(0)} ብር
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-green-950 to-emerald-900 border border-green-500/50 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-xs text-green-300 font-semibold">BIG WIN</span>
        </div>
        <div className="text-2xl font-black text-white">
          {stats.biggestWin.toFixed(0)} ብር
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-orange-950 to-orange-900 border border-orange-500/50 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-orange-300 font-semibold">AVG. MULTI</span>
        </div>
        <div className="text-2xl font-black text-white">
          {stats.averageMultiplier.toFixed(2)}x
        </div>
      </motion.div>
    </div>
  );
}