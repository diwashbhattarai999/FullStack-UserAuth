import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

import catchAsync from '../errors/catchAsync';
import CustomError from '../errors/customError';

import env from '../utils/validateEnv';
import { generatePasswordResetToken, generateTwoFactorToken, generateVerificationToken } from '../utils/token';
import { sendPasswordResetEmail, sendTwoFactorTokenEmail, sendVerificationEmail } from '../utils/mail';

import { getUserByEmail } from '../data/user';
import { getTwoFactorTokenByEmail } from '../data/two-factor-token';
import { getPasswordResetTokenByToken } from '../data/password-token';
import { getVerificationTokenByToken } from '../data/verification-token';
import { getTwoFactorConfirmationByUserId } from '../data/two-factor-confirmation';

import { db } from '../models/db';

const authController = {
  /*  **********Signup********** */
  signup: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;

    // check for missing fields
    if (!email || !password || !name) {
      throw new CustomError('Missing required fields', 400);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user with given email already exists and return error if email is already in use
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return next(res.status(400).json({ success: false, message: 'Email already in use!' }));
    }

    const admin = env.ADMIN_EMAIL;
    const role = email === admin ? UserRole.ADMIN : UserRole.USER;

    // Create new user in the database
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Generate and send verification email
    const verificationToken = await generateVerificationToken(email);
    const { error } = await sendVerificationEmail(verificationToken.email, verificationToken.token);

    if (error) {
      return next(new CustomError('Error sending verification email', 500));
    }

    res.status(201).json({ success: true, message: 'Confirmation email sent!' });
  }),

  /*  **********New Verification********** */
  newVerification: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    if (!token) return next(new CustomError('email and otp required', 400));

    // Retrieve verification token and return error if token does not exist
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
      return next(res.status(400).json({ success: false, message: 'Token does not exist!' }));
    }

    // Check if token has expired and return error if token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return next(new CustomError('Token has expired!', 400));
    }

    // Retrieve user by email from the token and return error if email does not exist
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return next(new CustomError('Email does not exist!', 400));
    }

    // Update user's email verification status and email in the database
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    // Delete the used verification token
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    res.status(200).json({ success: true, message: 'Email verified!' });
  }),

  /*  **********Signin********** */
  signin: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, code } = req.body;

    // check for missing fields
    if (!email || !password) {
      throw new CustomError('Missing required fields', 400);
    }

    // Check if user with given email exists and return error if email does not exist
    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
      return next(res.status(401).json({ success: false, message: 'Invalid credentials!' }));
    }

    // Send verification email if user's email is not verified
    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(existingUser.email);

      const { error } = await sendVerificationEmail(verificationToken.email, verificationToken.token);

      if (error) {
        return next(new CustomError('Error sending verification email', 500));
      }

      return next(res.status(201).json({ success: true, message: 'Confirmation email sent!', verified: false }));
    }

    // Check if password matches and return error if password does not match
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return next(res.status(401).json({ success: false, message: 'Invalid Credentials!', verified: true }));
    }

    // Handle two-factor authentication
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        // Validate two-factor authentication code
        const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
        if (!twoFactorToken || twoFactorToken.token !== code) {
          return next(res.status(401).json({ success: false, message: 'Invalid code!', verified: true }));
        }

        // Check if two-factor authentication code has expired
        const hasExpired = new Date(twoFactorToken.expires) < new Date();
        if (hasExpired) {
          return next(new CustomError('Code expired!', 401));
        }

        // Delete used two-factor authentication token
        await db.twoFactorToken.delete({
          where: { id: twoFactorToken.id },
        });

        const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        // Delete existing two-factor confirmation
        if (existingConfirmation) {
          await db.twoFactorConfirmation.delete({
            where: { id: existingConfirmation.id },
          });
        }

        // Create new two-factor confirmation
        await db.twoFactorConfirmation.create({
          data: {
            userId: existingUser.id,
          },
        });
      } else {
        // Generate and send two-factor authentication token
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

        return next(
          res
            .status(200)
            .json({ success: true, message: 'Token sent to email successfully', twoFactor: true, verified: true })
        );
      }
    }

    // Sign in the user with credentials
    const token = jwt.sign({ id: existingUser.id, email: existingUser.email, role: existingUser.role }, env.JWT_SECRET);

    //sanitize the required value only
    const sanitizedUser = {
      ...existingUser,
      id: undefined,
      password: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };

    res
      .status(200)
      .cookie(env.COOKIES_NAME, JSON.stringify({ token }), {
        path: '/',
        secure: true,
        httpOnly: true,
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 day
        sameSite: 'lax',
      })
      .json({
        success: true,
        token,
        data: {
          user: sanitizedUser,
        },
        verified: true,
      });
  }),

  /*  **********Password Reset********** */
  reset: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // Check if user with given email exists
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return next(new CustomError('Email does not exist!', 400));
    }

    // Generate and send password reset email
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    res.status(200).json({ success: true, message: 'Reset email sent!' });
  }),

  /*  **********Change New Password********** */
  newPassword: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token, password } = req.body;

    if (!token) {
      return next(new CustomError('Missing token!', 400));
    }

    // Retrieve password reset token and return error if token is invalid
    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return next(new CustomError('Invalid token!', 400));
    }

    // Check if token has expired and return error if token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) return next(new CustomError('Token has expired!', 400));

    // Retrieve user by email from the token and return error if email does not exist
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) return next(new CustomError('Email does not exist!', 400));

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password in the database
    await db.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    // Delete the used password reset token
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    res.status(201).json({ success: true, message: 'Password updated successfully!' });
  }),
};

export default authController;
