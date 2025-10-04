import express, { Request, Response } from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { shouldBeUser } from './middleware/authMiddleware.js';

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3002', 'http://localhost:3003'],
    credentials: true,
  })
);

app.use(clerkMiddleware());

app.get('/test/', shouldBeUser, (req: Request, res: Response) => {
  return res.json({ message: 'Product service authenticated', userId: req.userId });
});

app.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timstamp: Date.now(),
  });
});

app.listen(8000, () => console.log('Product service is running on port 8000'));
