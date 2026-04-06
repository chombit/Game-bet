-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL PRIMARY KEY,
    "phone" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "balance" DECIMAL DEFAULT 1000.0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bet table
CREATE TABLE IF NOT EXISTS "Bet" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "roundId" TEXT NOT NULL,
    "betNumber" INTEGER NOT NULL,
    "amount" DECIMAL NOT NULL,
    "autoCashout" DECIMAL,
    "cashoutMultiplier" DECIMAL,
    "profit" DECIMAL,
    "status" TEXT DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id")
);

-- Create RoundHistory table
CREATE TABLE IF NOT EXISTS "RoundHistory" (
    "id" SERIAL PRIMARY KEY,
    "roundId" TEXT UNIQUE NOT NULL,
    "seed" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "crashPoint" DECIMAL NOT NULL,
    "playedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Bet_userId_idx" ON "Bet"("userId");
CREATE INDEX IF NOT EXISTS "Bet_roundId_idx" ON "Bet"("roundId");
CREATE INDEX IF NOT EXISTS "RoundHistory_roundId_idx" ON "RoundHistory"("roundId");