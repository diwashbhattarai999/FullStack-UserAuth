import { cleanEnv, num, port, str } from 'envalid';

export default cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  DATABASE_URL: str(),
  PORT: port(),
  CLIENT_URL: str(),
  RESEND_API_KEY: str(),
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: num(),
  COOKIES_NAME: str(),
  ADMIN_EMAIL: str(),
});
