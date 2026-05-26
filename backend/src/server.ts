import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router as apiRouter } from './routes/index';
import { errorHandler } from './middleware/error.middleware';
import { prisma } from './services/prisma.service';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/debug', async (_req, res) => {
  const dbUrl = process.env.DATABASE_URL ?? '(not set)';
  const masked = dbUrl.replace(/:([^:@]+)@/, ':***@');
  try {
    const userCount = await prisma.user.count();
    const firstUser = await prisma.user.findFirst({ select: { email: true, role: true } });
    res.json({ db: 'connected', masked_url: masked, userCount, firstUser });
  } catch (err) {
    res.status(500).json({ db: 'error', masked_url: masked, error: String(err) });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[server] InventoryOS API running on http://localhost:${PORT}`);
  });
}

export default app;
