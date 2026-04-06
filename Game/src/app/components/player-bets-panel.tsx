import { motion } from 'motion/react';
import { Users, TrendingUp, Crown, Activity } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface PlayerBet {
  id: string;
  username: string;
  betAmount: number;
  cashoutMultiplier?: number;
  profit?: number;
  isActive: boolean;
}

interface PlayerBetsPanelProps {
  bets: PlayerBet[];
}

export function PlayerBetsPanel({ bets }: PlayerBetsPanelProps) {
  const activeBets = bets.filter((bet) => bet.isActive || bet.cashoutMultiplier);
  const topWins = [...bets]
    .filter((bet) => bet.profit && bet.profit > 0)
    .sort((a, b) => (b.profit || 0) - (a.profit || 0))
    .slice(0, 10);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      <Tabs defaultValue="live" className="flex flex-col h-full">
        {/* Header with tabs */}
        <div className="p-4 border-b border-gray-700 bg-gray-950/50 backdrop-blur-sm">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
            <TabsTrigger value="live" className="data-[state=active]:bg-green-600">
              <Activity className="w-4 h-4 mr-2" />
              Live Bets
            </TabsTrigger>
            <TabsTrigger value="top" className="data-[state=active]:bg-purple-600">
              <Crown className="w-4 h-4 mr-2" />
              Top Wins
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Live Bets Tab */}
        <TabsContent value="live" className="flex-1 m-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-4 h-4" />
              <span className="text-sm font-semibold">Active Players</span>
            </div>
            <span className="text-sm font-bold text-green-400">
              {activeBets.length}
            </span>
          </div>

          <ScrollArea className="h-[calc(100%-3rem)]">
            <div className="p-3 space-y-2">
              {activeBets.map((bet, index) => (
                <motion.div
                  key={bet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`relative p-3 rounded-lg border transition-all overflow-hidden ${
                    bet.cashoutMultiplier
                      ? bet.profit && bet.profit > bet.betAmount * 3
                        ? 'bg-gradient-to-r from-purple-950/90 to-pink-900/90 border-purple-400 shadow-lg shadow-purple-500/20'
                        : bet.profit && bet.profit > bet.betAmount * 2
                        ? 'bg-gradient-to-r from-blue-950/90 to-cyan-900/90 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-gradient-to-r from-green-950/90 to-emerald-900/90 border-green-400 shadow-lg shadow-green-500/20'
                      : bet.isActive
                      ? 'bg-gray-800/90 border-yellow-500/50 animate-pulse'
                      : 'bg-gray-800/90 border-gray-600'
                  }`}
                >
                  {/* Animated gradient overlay for big wins */}
                  {bet.profit && bet.profit > bet.betAmount * 3 && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  )}

                  <div className="relative flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                        style={{
                          boxShadow: bet.cashoutMultiplier
                            ? '0 0 15px rgba(168, 85, 247, 0.6)'
                            : 'none',
                        }}
                      >
                        {bet.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {bet.username}
                        </div>
                        {bet.profit && bet.profit > bet.betAmount * 2 && (
                          <div className="flex items-center gap-1">
                            <Crown className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-yellow-400 font-bold">
                              Big Win!
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {bet.cashoutMultiplier && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 10 }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md font-bold text-xs ${
                          bet.profit && bet.profit > bet.betAmount * 3
                            ? 'bg-purple-500/30 border border-purple-400 text-purple-300'
                            : bet.profit && bet.profit > bet.betAmount * 2
                            ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-300'
                            : 'bg-green-500/30 border border-green-400 text-green-300'
                        }`}
                      >
                        <TrendingUp className="w-3 h-3" />
                        {bet.cashoutMultiplier.toFixed(2)}x
                      </motion.div>
                    )}
                  </div>

                  <div className="relative flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-400 text-xs">Bet: </span>
                      <span className="text-white font-bold">
                        {bet.betAmount.toFixed(2)} ብር
                      </span>
                    </div>

                    {bet.profit !== undefined ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`font-black text-sm ${
                          bet.profit > 0
                            ? bet.profit > bet.betAmount * 3
                              ? 'text-purple-400'
                              : bet.profit > bet.betAmount * 2
                              ? 'text-cyan-400'
                              : 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {bet.profit > 0 ? '+' : ''}{Math.abs(bet.profit).toFixed(2)} ብር
                      </motion.div>
                    ) : bet.isActive ? (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-xs text-yellow-400 font-bold"
                      >
                        ✈ Flying...
                      </motion.span>
                    ) : null}
                  </div>
                </motion.div>
              ))}

              {activeBets.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <Users className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm font-semibold">No active bets</p>
                  <p className="text-xs text-gray-600">
                    Waiting for players...
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Top Wins Tab */}
        <TabsContent value="top" className="flex-1 m-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50">
            <div className="flex items-center gap-2 text-gray-300">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold">Top Multipliers</span>
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-3rem)]">
            <div className="p-3 space-y-2">
              {topWins.map((bet, index) => (
                <motion.div
                  key={bet.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative p-3 rounded-lg bg-gradient-to-r from-yellow-950/50 to-orange-900/50 border border-yellow-600/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-black text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {bet.username}
                        </div>
                        <div className="text-xs text-gray-400">
                          {bet.betAmount.toFixed(2)} ብር bet
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-yellow-400">
                        {bet.cashoutMultiplier?.toFixed(2)}x
                      </div>
                      <div className="text-xs text-green-400 font-bold">
                        +{bet.profit?.toFixed(2)} ብር
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {topWins.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <Crown className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm font-semibold">No wins yet</p>
                  <p className="text-xs text-gray-600">
                    Be the first to win big!
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}