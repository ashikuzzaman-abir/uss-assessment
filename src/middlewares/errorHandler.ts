import { Request, Response, NextFunction } from 'express';
const NODE_ENV = process.env.NODE_ENV || 'development';
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (NODE_ENV === 'development') {
    console.error(err);
    return res.status(500).json({ message: err.message, stack: err.stack });
  }
  return res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
