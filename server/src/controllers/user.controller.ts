import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import CustomError from '../errors/customError';
import asyncCatch from '../errors/catchAsync';

import { getUserById } from '../data/user';

import { db } from '../models/db';

const userController = {
  /*  **********Update user profile********** */
  updateProfile: asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError(`User not found!`, 404);
    }

    const user = req.user;
    const { password, newPassword, phone, isTwoFactorEnabled, name, role } = req.body;

    let changedPassword;

    // Get user data from the database
    const dbUser = await getUserById(user.id as string);
    if (!dbUser) {
      throw new CustomError(`User not found!`, 404);
    }

    // If password is being changed
    if (password && password.length > 0 && newPassword && password.length > 0 && dbUser.password) {
      // Check if the current password matches the user's password
      const passwordsMatch = await bcrypt.compare(password, dbUser.password);
      if (!passwordsMatch) return next(res.status(401).json({ success: false, message: 'Invalid password!' }));

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      changedPassword = hashedPassword;
    } else {
      // If password is not being changed, remove password field from update data
      changedPassword = undefined;
    }

    // If phone number is being changed check if it is 10 digits
    if (phone && (phone.length < 10 || phone.length > 10)) {
      return next(res.status(400).json({ success: false, message: 'Phone Number should be of 10 digits!' }));
    }

    // Update user settings in the database
    const updatedUser = await db.user.update({
      where: { id: dbUser.id },
      data: {
        role,
        name,
        isTwoFactorEnabled,
        password: changedPassword,
        phone,
      },
    });

    res.status(200).json({ success: true, message: 'Settings Updated!', data: { user: updatedUser } });
  }),

  /*  **********Delete user profile********** */
  deleteProfile: asyncCatch(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new CustomError(`User not found!`, 404);
    }

    // Delete user from database
    await db.user.delete({
      where: { id: req.user.id },
    });

    res.status(200).json({ success: true, message: 'Your account has been deleted.' });
  }),

  /*  **********Get all users********** */
  getUsers: asyncCatch(async (req: Request, res: Response) => {
    const users = await db.user.findMany({
      select: {
        email: true,
        name: true,
        image: true,
        isTwoFactorEnabled: true,
        phone: true,
        role: true,
      },
    });

    if (!users) {
      throw new CustomError(`User not found!`, 404);
    }

    res.status(200).json({ success: true, message: 'User details retrieved successfully', data: { users } });
  }),

  /*  **********Get signle user by id********** */
  getUser: asyncCatch(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new CustomError(`User not found!`, 404);
    }

    const user = await db.user.findUnique({
      where: { id: req.user.id },
      select: {
        email: true,
        name: true,
        image: true,
        isTwoFactorEnabled: true,
        phone: true,
        role: true,
      },
    });

    if (!user) {
      throw new CustomError(`User not found!`, 404);
    }

    res.status(200).json({ success: true, message: 'User details retrieved successfully', data: { user } });
  }),
};

export default userController;
