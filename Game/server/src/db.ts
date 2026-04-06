require('dotenv').config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Keep Prisma for migrations and complex queries
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
