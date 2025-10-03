import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3002', 'http://localhost:3003'],
    credentials: true,
  })
);

app.get("/health",(req: Request, res: Response) => {
  return res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timstamp: Date.now(),
  });
})

app.listen(8000, () => console.log('Product service is running on port 8000'));
