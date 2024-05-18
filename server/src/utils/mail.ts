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
    html: `
      <h1>Email Verification Confirmation</h1>
      <p>Thank you for signing up. To get started, please confirm your email address by clicking the link below:</p>
      <p><a href="${confirmLink}">Confirm Email Address</a></p>
      <p>If you did not sign up for a Resend account, you can safely ignore this email.</p>
      <p>This link will expire in 24 hours for security reasons.</p>
    `,
  });

  return { data, error };
};

// Function to send two-factor authentication token email
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'FullStack UserAuth<diwash@diwashb.com.np>',
    to: email,
    subject: '2FA Code',
    html: `
      <h1>Two-Factor Authentication Code</h1>
      <p>You've requested a verification code to enable two-factor authentication (2FA) for your account.</p>
      <p>Here is your verification code:</p>
      <h2 style="font-size: 24px; font-weight: bold; color: #333;">${token}</h2>
      <p>This code will expire in 10 minutes for security reasons.</p>
      <p>If you didn't request this code, it's possible someone else is trying to access your account. Please ensure the security of your account and consider changing your password immediately.</p>
   `,
  });
};

// Function to send password reset email
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: 'FullStack UserAuth<diwash@diwashb.com.np>',
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Password Reset</h1>
      <p>We received a request to reset your password.</p>
      <p>If you didn't request a password reset, you can ignore this email.</p>
      <p>To reset your password, please click the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If the button above doesn't work, you can copy and paste the following link into your browser:</p>
      <p>${resetLink}</p>
      <p>This link will expire in 24 hours for security reasons.</p>
  `,
  });
};
