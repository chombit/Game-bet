import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GameCanvas } from '../components/game-canvas';
import { PlayerBetsPanel } from '../components/player-bets-panel';
import { BettingControls } from '../components/betting-controls';
import { RoundTimer } from '../components/round-timer';
import { StatsPanel } from '../components/stats-panel';
import { ChatPanel } from '../components/chat-panel';
import { Toaster } from '../components/ui/sonner';
import { ArrowLeft, Wallet, Home, MessageSquare, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCrashEngine } from '../hooks/use-crash-engine';
import { motion, AnimatePresence } from 'motion/react';
import { HistoryBar } from '../components/history-bar';

interface CrashGameProps {
  gameType: 'aviator' | 'jetx' | 'rocket';
}

export function CrashGame({ gameType }: CrashGameProps) {
  const navigate = useNavigate();
  const [rightTab, setRightTab] = useState<'bets' | 'chat'>('bets');
  
  const {
    gameState, multiplier, countdown, progress, balance, history,
    bet1, bet2, playerBets, messages, stats,
    placeBet, cashout, sendMessage
  } = useCrashEngine();

  const potentialWin1 = bet1 ? bet1.amount * multiplier : 0;
  const potentialWin2 = bet2 ? bet2.amount * multiplier : 0;

  const gameNames = {
    aviator: { en: 'Aviator', am: 'አቪዬተር' },
    jetx: { en: 'JetX', am: 'ጀትኤክስ' },
    rocket: { en: 'Rocket', am: 'ሮኬት' },
  };

  return (
    <div className="size-full bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-auto">
      <Toaster position="top-center" theme="dark" />

      <div className="min-h-full max-w-[1920px] mx-auto p-3 md:p-6">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/lobby')}
                className="border-gray-700 hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ተመለስ
              </Button>

              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
                  {gameNames[gameType].am} - {gameNames[gameType].en}
                </h1>
                <p className="text-sm text-gray-500 mt-1">እናት ቤት | ENAT BET</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-950 to-emerald-900 border border-green-500/50 rounded-xl p-4 shadow-lg shadow-green-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-300 font-semibold uppercase tracking-tighter">
                    ቀሪ ሂሳብ / BALANCE
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-3xl font-black text-white">
                    {balance.toFixed(2)}
                  </span>
                  <span className="text-lg text-green-400 font-bold">ብር</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate('/lobby')}
                className="border-gray-700 hover:bg-gray-800 h-full"
              >
                <Home className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <StatsPanel stats={stats} />
        </div>

        {/* Main game layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-4 md:gap-6">
          <div className="flex flex-col gap-4">
            <HistoryBar history={history} />
            
            <div className="relative aspect-[16/10] md:aspect-[16/9]">
              <GameCanvas
                multiplier={multiplier}
                gameState={gameState}
                progress={progress}
                history={history}
              />
              <RoundTimer countdown={countdown} gameState={gameState} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BettingControls
                gameState={gameState}
                onPlaceBet={(amount, autoCashout) =>
                  placeBet(1, amount, autoCashout)
                }
                onCashout={() => cashout(1)}
                hasBet={!!bet1}
                hasCashedOut={bet1?.cashedOut || false}
                balance={balance}
                currentMultiplier={multiplier}
                potentialWin={potentialWin1}
                betNumber={1}
              />

              <BettingControls
                gameState={gameState}
                onPlaceBet={(amount, autoCashout) =>
                  placeBet(2, amount, autoCashout)
                }
                onCashout={() => cashout(2)}
                hasBet={!!bet2}
                hasCashedOut={bet2?.cashedOut || false}
                balance={balance}
                currentMultiplier={multiplier}
                potentialWin={potentialWin2}
                betNumber={2}
              />
            </div>
          </div>

          {/* Right Sidebar with Tabs */}
          <div className="flex flex-col gap-4 h-[600px] xl:h-auto">
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl">
              <button
                onClick={() => setRightTab('bets')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                  rightTab === 'bets' 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>ALL BETS</span>
              </button>
              <button
                onClick={() => setRightTab('chat')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                  rightTab === 'chat' 
                    ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' 
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>CHAT</span>
              </button>
            </div>

            <div className="flex-1 min-h-0 relative">
              <AnimatePresence mode="wait">
                {rightTab === 'bets' ? (
                  <motion.div
                    key="bets"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute inset-0"
                  >
                    <PlayerBetsPanel bets={playerBets} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute inset-0"
                  >
                    <ChatPanel messages={messages} onSendMessage={sendMessage} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
