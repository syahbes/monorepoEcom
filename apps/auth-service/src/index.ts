import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { shouldBeAdmin } from './middleware/authMiddleware.js';
import userRoute from './routes/user.route.js'
import { producer } from './utils/kafka.js';

const app = express();
app.use(
  cors({
    origin: ['http://localhost:3003'],
    credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware());

app.use('/users',shouldBeAdmin, userRoute );

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return res.status(err.status || 500).json({ message: err.message || 'Internal Server Error!' });
});

const start = async () => {
  try {
    await producer.connect();
    app.listen(8003, () => console.log('Auth service is running on port 8003'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
