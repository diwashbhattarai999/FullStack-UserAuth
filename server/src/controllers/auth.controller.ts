import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import catchAsync from '../errors/catchAsync';
import CustomError from '../errors/customError';

import env from '../utils/validateEnv';
import { generateTwoFactorToken, generateVerificationToken } from '../utils/token';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '../utils/mail';

import { getUserByEmail } from '../data/user';
import { getTwoFactorTokenByEmail } from '../data/two-factor-token';
import { getVerificationTokenByToken } from '../data/verification-token';
import { getTwoFactorConfirmationByUserId } from '../data/two-factor-confirmation';

import { db } from '../models/db';
import { UserRole } from '@prisma/client';

const authController = {
  signup: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name, phone } = req.body;

    // check for missing fields
    if (!email || !password || !name || !phone) {
      throw new CustomError('missing required fields', 400);
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

  signin: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, code } = req.body;

    // check for missing fields
    if (!email || !password) {
      throw new CustomError('Missing required fields', 400);
    }

    // Check if user with given email exists and return error if email does not exist
    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
      return next(new CustomError('Invalid credentials', 400));
    }

    // Send verification email if user's email is not verified
    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(existingUser.email);

      const { error } = await sendVerificationEmail(verificationToken.email, verificationToken.token);

      if (error) {
        return next(new CustomError('Error sending verification email', 500));
      }

      return next(res.status(201).json({ success: true, message: 'Confirmation email sent!' }));
    }

    // Check if password matches and return error if password does not match
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return next(res.status(401).json({ success: false, message: 'Invalid Credentials!' }));
    }

    // Handle two-factor authentication
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        // Validate two-factor authentication code
        const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
        if (!twoFactorToken || twoFactorToken.token !== code) {
          return next(res.status(401).json({ success: false, message: 'Invalid code!' }));
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

        return next(res.status(200).json({ success: true, message: 'Token sent to email successfully' }));
      }
    }

    // Sign in the user with credentials
    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email, role: existingUser.role },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN,
      }
    );

    //sanitize the required value only
    const sanitizedUser = {
      ...existingUser,
      id: undefined,
      password: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };

    res
      .status(201)
      .cookie(env.COOKIES_NAME, JSON.stringify({ token, user: sanitizedUser }), {
        path: '/',
        maxAge: 3600,
        httpOnly: true,
      })
      .json({
        success: true,
        token,
        data: {
          user: sanitizedUser,
        },
      });
  }),
};

export default authController;
