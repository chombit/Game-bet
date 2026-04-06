import React, { useState, useEffect } from 'react';
import { Minus, Plus, Zap, Play, Square, Settings2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface BettingControlsProps {
  gameState: 'WAITING' | 'COUNTDOWN' | 'FLYING' | 'CRASHED';
  onPlaceBet: (amount: number, autoCashout: number | null) => void;
  onCashout: () => void;
  hasBet: boolean;
  hasCashedOut: boolean;
  balance: number;
  currentMultiplier: number;
  potentialWin: number;
  betNumber: 1 | 2;
}

export function BettingControls({
  gameState,
  onPlaceBet,
  onCashout,
  hasBet,
  hasCashedOut,
  balance,
  currentMultiplier,
  potentialWin,
  betNumber,
}: BettingControlsProps) {
  const [amount, setAmount] = useState(100);
  const [autoCashout, setAutoCashout] = useState<string>('2.00');
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);
  const [betMode, setBetMode] = useState<'manual' | 'auto'>('manual');
  const [rounds, setRounds] = useState(10);
  const [remainingRounds, setRemainingRounds] = useState(0);

  // Auto-bet logic
  useEffect(() => {
    if (betMode === 'auto' && isAutoEnabled && gameState === 'COUNTDOWN' && !hasBet && remainingRounds > 0) {
      onPlaceBet(amount, parseFloat(autoCashout) || null);
      setRemainingRounds(prev => prev - 1);
    }
  }, [gameState, isAutoEnabled, betMode, hasBet]);

  useEffect(() => {
    if (remainingRounds === 0) setIsAutoEnabled(false);
  }, [remainingRounds]);

  const toggleAuto = () => {
    if (isAutoEnabled) {
      setIsAutoEnabled(false);
      setRemainingRounds(0);
    } else {
      setIsAutoEnabled(true);
      setRemainingRounds(rounds);
    }
  };

  const adjustAmount = (val: number) => {
    setAmount(prev => Math.max(10, prev + val));
  };

  const isButtonDisabled = (gameState === 'FLYING' && !hasBet) || (gameState === 'WAITING');

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-900/40 border border-white/5 rounded-2xl backdrop-blur-xl">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-black/40 rounded-xl border border-white/5 mb-1">
        <button
          onClick={() => setBetMode('manual')}
          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
            betMode === 'manual' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Manual
        </button>
        <button
          onClick={() => setBetMode('auto')}
          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
            betMode === 'auto' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Auto
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Amount (Birr)</label>
          <div className="flex items-center gap-2 bg-black/40 rounded-xl border border-white/10 p-1">
            <Button size="icon" variant="ghost" onClick={() => adjustAmount(-10)} className="h-8 w-8 hover:bg-white/5"><Minus className="w-3 h-3" /></Button>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-transparent text-center font-bold text-sm focus:outline-none"
            />
            <Button size="icon" variant="ghost" onClick={() => adjustAmount(10)} className="h-8 w-8 hover:bg-white/5"><Plus className="w-3 h-3" /></Button>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[10, 50, 100, 500].map(v => (
              <button key={v} onClick={() => setAmount(v)} className="py-1 rounded bg-white/5 text-[9px] font-bold hover:bg-white/10 transition-colors border border-white/5">{v}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {betMode === 'manual' ? (
            <>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Auto Cashout</label>
              <div className="flex items-center gap-2 bg-black/40 rounded-xl border border-white/10 p-1">
                <Button size="icon" variant="ghost" onClick={() => setAutoCashout((parseFloat(autoCashout) - 0.1).toFixed(2))} className="h-8 w-8 hover:bg-white/5"><Minus className="w-3 h-3" /></Button>
                <input 
                  type="text" 
                  value={autoCashout}
                  onChange={(e) => setAutoCashout(e.target.value)}
                  className="w-full bg-transparent text-center font-bold text-sm focus:outline-none"
                />
                <Button size="icon" variant="ghost" onClick={() => setAutoCashout((parseFloat(autoCashout) + 0.1).toFixed(2))} className="h-8 w-8 hover:bg-white/5"><Plus className="w-3 h-3" /></Button>
              </div>
            </>
          ) : (
             <>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Number of Rounds</label>
              <div className="flex items-center gap-2 bg-black/40 rounded-xl border border-white/10 p-1">
                <Button size="icon" variant="ghost" onClick={() => setRounds(prev => Math.max(1, prev - 1))} className="h-8 w-8 hover:bg-white/5"><Minus className="w-3 h-3" /></Button>
                <span className="w-full text-center font-bold text-sm">{rounds}</span>
                <Button size="icon" variant="ghost" onClick={() => setRounds(prev => prev + 1)} className="h-8 w-8 hover:bg-white/5"><Plus className="w-3 h-3" /></Button>
              </div>
             </>
          )}
        </div>
      </div>

      {hasBet && !hasCashedOut ? (
        <Button 
          className="w-full h-16 bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-black rounded-2xl flex flex-col items-center justify-center gap-0 group"
          onClick={onCashout}
          disabled={gameState !== 'FLYING'}
        >
          <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">CASHOUT NOW</span>
          <span className="text-2xl font-black">{potentialWin.toFixed(2)} Birr</span>
          <span className="text-[11px] font-bold opacity-80 group-hover:scale-110 transition-transform">@{currentMultiplier.toFixed(2)}x</span>
        </Button>
      ) : hasBet && hasCashedOut ? (
        <Button 
          disabled 
          className="w-full h-16 bg-green-500/20 text-green-400 border border-green-500/30 rounded-2xl flex flex-col items-center justify-center opacity-100"
        >
          <span className="text-[10px] font-black uppercase">CASHED OUT</span>
          <span className="text-xl font-black">+{potentialWin.toFixed(2)}</span>
        </Button>
      ) : (
        <div className="flex gap-2">
            {betMode === 'auto' && (
              <Button
                variant="outline"
                className={`h-16 w-16 border-white/10 rounded-2xl flex flex-col items-center justify-center gap-1 ${isAutoEnabled ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-white/5'}`}
                onClick={toggleAuto}
              >
                {isAutoEnabled ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span className="text-[8px] font-black uppercase">{isAutoEnabled ? 'STOP' : 'RUN'}</span>
              </Button>
            )}
            <Button 
              className={`flex-1 h-16 ${betNumber === 1 ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-black font-black text-xl rounded-2xl active:scale-95 transition-all flex flex-col items-center justify-center gap-0`}
              disabled={isButtonDisabled || (betMode === 'auto' && isAutoEnabled)}
              onClick={() => onPlaceBet(amount, parseFloat(autoCashout) || null)}
            >
              <Zap className={`w-4 h-4 absolute top-2 right-2 opacity-50 ${gameState === 'COUNTDOWN' ? 'animate-pulse text-yellow-300' : ''}`} />
              <span className="text-[10px] uppercase tracking-tighter opacity-70">PLACE BET</span>
              <span>{amount} BIRR</span>
            </Button>
        </div>
      )}
    </div>
  );
}