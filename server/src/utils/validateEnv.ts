import { cleanEnv, port, str } from 'envalid';

export default cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  DATABASE_URL: str(),
  PORT: port(),
  CLIENT_URL: str(),
  RESEND_API_KEY: str(),
});
