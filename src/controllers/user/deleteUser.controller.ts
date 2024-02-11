import { NextFunction, Request, Response } from 'express';
import User from '../../models/user.model';

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default deleteUser;
