import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

type IRequest = Request & {
  user?: any;
};

type IUser = {
  _id: string;
  username: string;
  email: string;
};

export const protect = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_PRIVATE_KEY || 'fallback_key_12345_924542'
      ) as IUser;
      req.user = await User.findById(decoded?._id).select('-password');
      next();
    } catch (error: any) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
