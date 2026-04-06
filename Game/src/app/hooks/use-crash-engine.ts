import { useState, useEffect, useCallback, useRef } from 'react';
import { soundManager } from '../utils/sound-manager';
import { toast } from 'sonner';
import { socket } from '../utils/socket';
import { 
  GameState, 
  PlayerBet, 
  BetSlot, 
  GameStats, 
} from '../types/game';

const ETHIOPIAN_NAMES = [
  'አበበ (Abebe)', 'ገመቹ (Gemechu)', 'አበላ (Abela)', 'መስፍን (Mesfin)', 'ታደሰ (Tadesse)',
  'ሃይሉ (Hailu)', 'ብርሃኑ (Birhanu)', 'ሙሉጌታ (Mulugeta)', 'ተስፋዬ (Tesfaye)', 'ደመቀ (Demeke)',
  'ግርማ (Girma)', 'በቀለ (Bekele)', 'አለማየሁ (Alemayehu)', 'ከበደ (Kebede)', 'ወርቁ (Worku)',
  'ዮሐንስ (Yohannes)', 'ዳንኤል (Daniel)', 'ሰለሞን (Solomon)', 'እስክንድር (Eskindir)', 'ፀጋዬ (Tsegaye)',
  'ዘውዱ (Zewdu)', 'ሙሉ (Mulu)', 'ትዕግስት (Tigist)', 'ሩት (Ruth)', 'ኮከብ (Kokeb)',
  'አስተር (Aster)', 'ሳራ (Sara)', 'ቢኒያም (Biniyam)', 'ሳሙኤል (Samuel)', 'እሸቱ (Eshetu)'
];

function generateMockBets(count: number): PlayerBet[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${Date.now()}-${i}`,
    username: ETHIOPIAN_NAMES[Math.floor(Math.random() * ETHIOPIAN_NAMES.length)],
    betAmount: Math.floor(Math.random() * 500) + 10,
    isActive: false,
  }));
}

export function useCrashEngine() {
  const [gameState, setGameState] = useState<GameState>('WAITING');
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(2.0);
  const [countdown, setCountdown] = useState(5);
  const [progress, setProgress] = useState(0);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<number[]>([1.45, 3.21, 1.08, 5.67, 2.34, 8.92, 1.76, 4.23]);

  const [bet1, setBet1] = useState<BetSlot | null>(null);
  const [bet2, setBet2] = useState<BetSlot | null>(null);
  const [playerBets, setPlayerBets] = useState<PlayerBet[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [stats, setStats] = useState<GameStats>({
    totalPlayers: 42,
    totalBets: 12450,
    biggestWin: 0,
    averageMultiplier: 0,
  });

  const stateRef = useRef({ bet1, bet2, gameState, multiplier, crashPoint });
  useEffect(() => {
    stateRef.current = { bet1, bet2, gameState, multiplier, crashPoint };
  }, [bet1, bet2, gameState, multiplier, crashPoint]);

  // Handle server ticks & chat & balance
  useEffect(() => {
    const handleTick = (data: any) => {
      if (data.gameState) {
        if (data.gameState !== stateRef.current.gameState) {
          if (data.gameState === 'FLYING') {
            soundManager.playBeep(880, 0.3);
            soundManager.startEngine();
            setPlayerBets(prev => prev.map(b => ({ ...b, isActive: true })));
          } else if (data.gameState === 'CRASHED') {
             soundManager.stopEngine();
             soundManager.playExplosion();
             setPlayerBets(prev => prev.map(b => 
               b.isActive && !b.cashoutMultiplier ? { ...b, profit: -b.betAmount, isActive: false } : b
             ));
             setTimeout(() => {
                setBet1(null);
                setBet2(null);
             }, 4000);
          } else if (data.gameState === 'COUNTDOWN') {
            setPlayerBets(generateMockBets(Math.floor(Math.random() * 10) + 5));
          }
          setGameState(data.gameState);
        }
      }

      if (data.multiplier !== undefined) {
        setMultiplier(data.multiplier);
        if (stateRef.current.gameState === 'FLYING') {
            soundManager.updateEngine(data.multiplier);
            
            if (data.crashPoint) setCrashPoint(data.crashPoint);
            const p = Math.min((data.multiplier - 1) / (stateRef.current.crashPoint - 1 || 1), 1);
            setProgress(p);

            // Mock player cashouts
            setPlayerBets(prev => prev.map(b => {
                if (b.isActive && !b.cashoutMultiplier) {
                  if (Math.random() < 0.05) {
                    const profit = b.betAmount * (data.multiplier - 1);
                    return { ...b, cashoutMultiplier: data.multiplier, profit, isActive: false };
                  }
                }
                return b;
            }));

            // Auto-cashout logic
            if (stateRef.current.bet1 && !stateRef.current.bet1.cashedOut && stateRef.current.bet1.autoCashout && data.multiplier >= stateRef.current.bet1.autoCashout) {
                cashout(1);
            }
            if (stateRef.current.bet2 && !stateRef.current.bet2.cashedOut && stateRef.current.bet2.autoCashout && data.multiplier >= stateRef.current.bet2.autoCashout) {
                cashout(2);
            }
        }
      }

      if (data.countdown !== undefined) {
        if (data.countdown !== countdown) {
          soundManager.playBeep(440 + (5 - data.countdown) * 100, 0.1);
          setCountdown(data.countdown);
        }
      }

      if (data.history) setHistory(data.history);
    };

    const handleChatHistory = (history: any[]) => setMessages(history);
    const handleChatMessage = (msg: any) => setMessages(prev => [...prev.slice(-49), msg]);
    const handleBalanceUpdate = (newBalance: number) => setBalance(newBalance);

    socket.on('game-tick', handleTick);
    socket.on('chat-history', handleChatHistory);
    socket.on('chat-message', handleChatMessage);
    socket.on('balance-update', handleBalanceUpdate);
    
    // Request initial data in case we missed the connection event
    socket.emit('request-balance');
    
    return () => {
      socket.off('game-tick', handleTick);
      socket.off('chat-history', handleChatHistory);
      socket.off('chat-message', handleChatMessage);
      socket.off('balance-update', handleBalanceUpdate);
    };
  }, [gameState, countdown, crashPoint]);

  const sendMessage = (text: string) => {
    socket.emit('send-chat', text);
  };

  const placeBet = (betNumber: 1 | 2, amount: number, autoCashout: number | null) => {
    if (amount > balance) {
      toast.error('በቂ ቀሪ ሂሳብ የለም / Insufficient balance!', { icon: '⚠️' });
      return;
    }
    const newBet = { amount, autoCashout, cashedOut: false };
    if (betNumber === 1) setBet1(newBet);
    else setBet2(newBet);
    setBalance(prev => prev - amount);
    
    socket.emit('place-bet', { betNumber, amount, autoCashout });
    toast.success(`Bet ${betNumber} placed: ${amount.toFixed(2)} Birr`, { duration: 2000, icon: '✅' });
  };

  const cashout = useCallback((betNumber: 1 | 2) => {
    const currentBet = betNumber === 1 ? stateRef.current.bet1 : stateRef.current.bet2;
    if (!currentBet || currentBet.cashedOut || stateRef.current.gameState !== 'FLYING') return;

    const winAmount = currentBet.amount * stateRef.current.multiplier;
    setBalance(prev => prev + winAmount);
    
    if (betNumber === 1) setBet1(prev => prev ? { ...prev, cashedOut: true } : null);
    else setBet2(prev => prev ? { ...prev, cashedOut: true } : null);

    soundManager.playCashout();
    toast.success(`Cashed out at ${stateRef.current.multiplier.toFixed(2)}x! Won ${winAmount.toFixed(2)} Birr`, { duration: 3000, icon: '🎉' });
    
    setStats(prev => ({ ...prev, biggestWin: Math.max(prev.biggestWin, winAmount - currentBet.amount) }));
  }, []);

  return {
    gameState, multiplier, crashPoint, countdown, progress, balance, history,
    bet1, bet2, playerBets, messages, stats,
    placeBet, cashout, sendMessage, startNewRound: () => {}
  };
}
