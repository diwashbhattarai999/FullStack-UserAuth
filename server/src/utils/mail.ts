import { Resend } from 'resend';

import env from '../utils/validateEnv';

const resend = new Resend(env.RESEND_API_KEY);

const domain = env.CLIENT_URL;

// Function to send email verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: 'FullStack UserAuth<diwash@diwashb.com.np>',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });

  return { data, error };
};
