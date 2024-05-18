import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import catchAsync from '../errors/catchAsync';
import CustomError from '../errors/customError';

import { generateVerificationToken } from '../utils/token';
import { sendVerificationEmail } from '../utils/mail';

import { getUserByEmail } from '../data/user';
import { db } from '../models/db';

const authController = {
  signup: catchAsync(async (req: Request, res: Response) => {
    const { email, password, name, phone } = req.body;

    // check for missing fields
    if (!email || !password || !name || !phone) throw new CustomError('missing required fields', 400);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user with given email already exists and return error if email is already in use
    const existingUser = await getUserByEmail(email);
    if (existingUser) throw new CustomError('Email already in use!', 400);

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
      res.status(400).json({ success: false, data: error });
      return;
    }

    res.status(201).json({ success: true, message: 'Confirmation email sent!' });
  }),
};

export default authController;
