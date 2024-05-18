import 'dotenv/config';
import cors from 'cors';
import app from './app';
import env from './utils/validateEnv';

const PORT = env.PORT || 8000;

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log(`\nctrl + click http://localhost:${PORT}\nctrl + c to stop server`);
});
