import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import env from './utils/validateEnv';
import authRoutes from './routes/auth.routes';

const PORT = env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`\nctrl + click http://localhost:${PORT}\nctrl + c to stop server`);
});
