import { NextFunction, Request, Response } from 'express';
import env from '../utils/validateEnv';
import jwt from 'jsonwebtoken';

import CustomError from '../errors/customError';
import asyncCatch from '../errors/catchAsync';
import { UserRole } from '@prisma/client';
import { db } from '../models/db';

const validate = {
  cookie: asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.cookies[env.COOKIES_NAME];
    if (!cookie) return next();

    const { token } = JSON.parse(cookie);
    const user = jwt.verify(token, env.JWT_SECRET);
    req.user = user;
    next();
  }),

  admin: asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new CustomError(`Not Found`, 404);

    const id = req.user.id;

    const admin = await db.user.findUnique({
      where: { id, role: UserRole.ADMIN },
    });
    if (!admin) throw new CustomError(`Forbidden`, 403);
    next();
  }),
};

export default validate;
