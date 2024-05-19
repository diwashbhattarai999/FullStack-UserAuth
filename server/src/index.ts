import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import env from './utils/validateEnv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const PORT = env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['Set-Cookie'],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/profile', userRoutes);

app.listen(PORT, () => {
  console.log(`\nctrl + click http://localhost:${PORT}\nctrl + c to stop server`);
});
