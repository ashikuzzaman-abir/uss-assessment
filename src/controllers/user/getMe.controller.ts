import { Response, NextFunction } from 'express';
import User from '../../models/user.model';

const getMeController = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json(user);
  } catch (error: any) {
    next(error);
  }
};

export default getMeController;
