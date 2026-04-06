import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../db';
import { signToken } from '../auth';

const router = Router();

const RegisterSchema = z.object({
  phone: z.string().min(9).max(10),
  name: z.string().min(2).max(50),
  password: z.string().min(6),
});

const LoginSchema = z.object({
  phone: z.string().min(9),
  password: z.string().min(6),
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { phone, name, password } = RegisterSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return res.status(400).json({ error: 'Phone number already registered. Please login.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { phone, name, passwordHash, balance: 1000 },
    });

    const token = signToken(user.id, user.phone);

    console.log(`✅ New user registered: ${name} (+251${phone})`);

    return res.json({
      token,
      user: { id: user.id, phone: user.phone, name: user.name, balance: user.balance },
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input. Please check your details.' });
    }
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = LoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return res.status(401).json({ error: 'Account not found. Please register first.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = signToken(user.id, user.phone);

    console.log(`🔑 User logged in: ${user.name} (+251${user.phone})`);

    return res.json({
      token,
      user: { id: user.id, phone: user.phone, name: user.name, balance: user.balance },
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input.' });
    }
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// Get current user profile (requires Authorization header)
router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { verifyToken } = await import('../auth');
    const payload = verifyToken(authHeader.slice(7));
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, phone: true, name: true, balance: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
