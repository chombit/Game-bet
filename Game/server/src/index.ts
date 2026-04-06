require('dotenv').config();
console.log('🚀 [SERVER] Starting in CWD:', process.cwd());
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import crypto from 'crypto';
import { supabase } from './db';
import authRouter from './routes/auth';
import { verifyToken } from './auth';

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint for Vercel
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://your-game-domain.vercel.app' : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;
const SERVER_SALT = 'ENAT_BET_PREMIUM_SALT_2026';

type GameState = 'WAITING' | 'COUNTDOWN' | 'FLYING' | 'CRASHED';

let gameState: GameState = 'WAITING';
let multiplier = 1.0;
let crashPoint = 1.0;
let countdown = 5;
let currentRoundId = `round-${Date.now()}`;
let currentSeed = '';
let currentHash = '';
let history: number[] = [];

// In-memory active bets for the current round
// Format: userId -> { bet1: Bet, bet2: Bet }
const activeBets = new Map<number, any>();

function generateFairCrashPoint(seed: string): { crashPoint: number, hash: string } {
  const hash = crypto.createHmac('sha256', SERVER_SALT).update(seed).digest('hex');
  const hex = hash.substring(0, 8);
  const int = parseInt(hex, 16);
  const luckyNumber = int / 0xffffffff;
  const rawPoint = 99 / (100 * (1 - luckyNumber));
  const finalPoint = Math.max(1, Math.floor(rawPoint * 100) / 100);
  return { crashPoint: finalPoint, hash };
}

const tick = async () => {
  if (gameState === 'COUNTDOWN') {
    if (countdown > 0) {
      countdown -= 1;
      io.emit('game-tick', { gameState, countdown });
    } else {
      // Start Flying
      gameState = 'FLYING';
      multiplier = 1.0;
      currentRoundId = `round-${Date.now()}`;
      currentSeed = crypto.randomBytes(16).toString('hex');
      const result = generateFairCrashPoint(currentSeed);
      crashPoint = result.crashPoint;
      currentHash = result.hash;

      console.log(`\n🚀 ROUND STARTED: ${currentRoundId}`);
      console.log(`   🔸 Crash Point: ${crashPoint}x`);
      console.log(`   🔸 Hash: ${currentHash}`);
      
      io.emit('game-tick', { 
        gameState, 
        multiplier, 
        hash: currentHash 
      });
    }
  } else if (gameState === 'FLYING') {
    // Standard growth: 10% per second approx
    const increment = 0.01 * (1 + Math.log10(multiplier));
    multiplier += increment;

    if (multiplier >= crashPoint) {
      gameState = 'CRASHED';
      const roundMultiplier = parseFloat(crashPoint.toFixed(2));
      history.push(roundMultiplier);
      if (history.length > 20) history.shift();
      
      // Save Round to History
      await supabase
        .from('RoundHistory')
        .insert([{
          roundId: currentRoundId,
          seed: currentSeed,
          hash: currentHash,
          crashPoint: roundMultiplier
        }]);

      // Settle all remaining active bets as LOST
      for (const [userId, slots] of activeBets.entries()) {
        const slotsToUpdate = [];
        if (slots.bet1 && slots.bet1.status === 'ACTIVE') slotsToUpdate.push(slots.bet1.id);
        if (slots.bet2 && slots.bet2.status === 'ACTIVE') slotsToUpdate.push(slots.bet2.id);
        
        if (slotsToUpdate.length > 0) {
          await supabase
            .from('Bet')
            .update({ status: 'LOST', profit: 0 })
            .eq('id', { in: slotsToUpdate });
        }
      }
      activeBets.clear();

      io.emit('game-tick', { 
        gameState, 
        multiplier: roundMultiplier, 
        history, 
        crashPoint: roundMultiplier,
        seed: currentSeed 
      });
      
      setTimeout(() => {
        gameState = 'COUNTDOWN';
        countdown = 5;
        io.emit('game-tick', { gameState, countdown });
      }, 5000);
    } else {
      io.emit('game-tick', { gameState, multiplier });
    }
  } else if (gameState === 'WAITING') {
    gameState = 'COUNTDOWN';
    countdown = 5;
    io.emit('game-tick', { gameState, countdown });
  }
};

setInterval(tick, 100);

// Socket Authentication Middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(); // Allow guest for viewing
  
  try {
    const payload = verifyToken(token);
    const { data: user } = await supabase
      .from('User')
      .select('*')
      .eq('id', payload.userId)
      .single();
    if (user) {
      socket.data.user = user;
    }
    next();
  } catch (err) {
    next();
  }
});

io.on('connection', (socket) => {
  const user = socket.data.user;
  console.log(`🔌 [SOCKET] New Connection | ID: ${socket.id} | User: ${user ? user.name : 'ANONYMOUS'}`);

  // Send initial state
  socket.emit('game-tick', { 
    gameState, 
    multiplier, 
    countdown, 
    history, 
    hash: currentHash 
  });

  if (user) {
    socket.emit('balance-update', user.balance);
    
    socket.on('request-balance', async () => {
      if (user) {
        const { data: u } = await supabase
          .from('User')
          .select('*')
          .eq('id', user.id)
          .single();
        if (u) {
          socket.emit('balance-update', u.balance);
        }
      }
    });

    socket.on('place-bet', async (data: { amount: number, autoCashout: number | null, betNumber: 1 | 2 }) => {
      console.log(`📩 [BET REQUEST] User: ${user.name} | Amount: ${data.amount} | Slot: ${data.betNumber}`);

      // Must be in COUNTDOWN to place bet
      if (gameState !== 'COUNTDOWN' && gameState !== 'WAITING') {
         console.warn(`⚠️ [BET REJECTED] Round is already ${gameState}`);
         return socket.emit('error', 'Bets only allowed during countdown!');
      }

      const amount = parseFloat(data.amount.toString());
      if (isNaN(amount) || amount <= 0) {
        console.warn(`⚠️ [BET REJECTED] Invalid amount: ${data.amount}`);
        return socket.emit('error', 'Invalid amount');
      }

      try {
        // Atomic balance check and update
        const { data: u, error: e } = await supabase
          .from('User')
          .select('*')
          .eq('id', user.id)
          .single();
        if (!u || u.balance < amount) throw new Error('Insufficient balance');

        // Create bet record
        const betData = {
          userId: user.id,
          roundId: currentRoundId,
          betNumber: data.betNumber,
          amount,
          autoCashout: data.autoCashout,
          status: 'ACTIVE'
        };

        const { data: bet, error: betError } = await supabase
          .from('Bet')
          .insert([betData])
          .select();

        if (betError || !bet || bet.length === 0) {
          throw new Error('Failed to create bet');
        }

        const createdBet = Array.isArray(bet) ? bet[0] : bet;

        // Update user balance
        const { data: updatedUser, error: updateError } = await supabase
          .from('User')
          .update({ balance: u.balance - amount })
          .eq('id', user.id)
          .select();

        if (updateError) {
          throw new Error('Failed to update balance');
        }

        console.log(`✅ [BET SUCCESS] Created Bet ID: ${createdBet.id} | New Balance: ${updatedUser?.[0]?.balance || u.balance - amount}`);

        // Track in memory
        const current = activeBets.get(user.id) || {};
        current[`bet${data.betNumber}`] = {
           ...createdBet,
           username: user.name
        };
        activeBets.set(user.id, current);

        socket.emit('balance-update', updatedUser?.[0]?.balance || u.balance - amount);
        
        // Broadcast to EVERYONE
        const flatBets: any[] = [];
        activeBets.forEach((slots) => {
          if (slots.bet1) flatBets.push({ ...slots.bet1, username: slots.bet1.username });
          if (slots.bet2) flatBets.push({ ...slots.bet2, username: slots.bet2.username });
        });
        
        io.emit('bet-list', flatBets);
      } catch (err: any) {
        console.error(`❌ [BET FAILED] ${err.message}`);
        socket.emit('error', err.message || 'Bet placement failed');
      }
    });

    socket.on('cashout', async (data: { betNumber: 1 | 2 }) => {
      if (gameState !== 'FLYING') return socket.emit('error', 'Cannot cashout now');

      const userBets = activeBets.get(user.id);
      const currentBet = userBets?.[`bet${data.betNumber}`];

      if (!currentBet || currentBet.status !== 'ACTIVE') {
        return socket.emit('error', 'No active bet to cashout');
      }

      const cashoutMultiplier = parseFloat(multiplier.toFixed(2));
      const profit = currentBet.amount * cashoutMultiplier;

      try {
        // Double check status in DB to prevent race conditions
        const { data: dbBet } = await supabase
          .from('Bet')
          .select('*')
          .eq('id', currentBet.id)
          .single();
        if (!dbBet || dbBet.status !== 'ACTIVE') throw new Error('Already cashed out');

        // Update bet
        await supabase
          .from('Bet')
          .update({ 
            status: 'CASHEDOUT', 
            cashoutMultiplier, 
            profit 
          })
          .eq('id', currentBet.id);

        // Update user balance
        await supabase
          .from('User')
          .update({ balance: (user?.balance || 0) + profit })
          .eq('id', user.id);

        // Remove from memory
        userBets[`bet${data.betNumber}`].status = 'CASHEDOUT';
        
        // Get updated user balance
        const { data: updatedUser } = await supabase
          .from('User')
          .select('balance')
          .eq('id', user.id)
          .single();
        
        socket.emit('balance-update', updatedUser?.balance || (user?.balance || 0) + profit);
        socket.emit('cashout-success', { 
          betNumber: data.betNumber, 
          multiplier: cashoutMultiplier, 
          profit 
        });
        
        console.log(`🎈 Cashout: ${user.name} | ${cashoutMultiplier}x | +${profit.toFixed(2)} Birr`);

      } catch (err: any) {
        socket.emit('error', err.message || 'Cashout failed');
      }
    });
  }
});

httpServer.listen(PORT, async () => {
  console.log(`Premium Crash Server (Provably Fair) running on port ${PORT}`);
  
  try {
    console.log('✅ [DB] Connected to Supabase');
  } catch (err) {
    console.error('❌ [DB] Connection Failed at startup:', err);
  }
});
