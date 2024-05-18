import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import catchAsync from '../errors/catchAsync';
import CustomError from '../errors/customError';

import { generateVerificationToken } from '../utils/token';
import { sendVerificationEmail } from '../utils/mail';

import { getUserByEmail } from '../data/user';
import { getVerificationTokenByToken } from '../data/verification-token';

import { db } from '../models/db';

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

    // Create new user in the database
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate and send verification email
    const verificationToken = await generateVerificationToken(email);
    const { error } = await sendVerificationEmail(verificationToken.email, verificationToken.token);

    if (error) {
      return next(res.status(400).json({ success: false, data: error }));
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
      return next(res.status(400).json({ success: false, message: 'Token has expired!' }));
    }

    // Retrieve user by email from the token and return error if email does not exist
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return next(res.status(400).json({ success: false, message: 'Email does not exist!' }));
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
};

export default authController;
