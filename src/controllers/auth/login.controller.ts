import { NextFunction, Response } from 'express';
import Joi from 'joi';
import User from '../../models/user.model';
import bcrypt from 'bcrypt';
import { usernameRegex } from '../../config/main.config';

type BodyType = {
  username: string;
  password: string;
};

const login = async (req: any, res: Response, next: NextFunction) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const { username, password } = req.body as BodyType;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: 'Invalid username or password' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: 'Invalid username or password' });
    const token = user.generateAuthToken();
    res.status(200).json({ token });
  } catch (error: any) {
    next(error);
  }
};

const validate = (data: any) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(2)
      .max(15)
      .regex(usernameRegex)
      .required()
      .messages({
        'any.required': 'Username is required',
        'string.min': 'Username must be at least 2 characters long',
        'string.max': 'Username cannot be more than 15 characters',
        'string.pattern.base':
          'Username must contain only letters, numbers, highphen and underscores',
      }),
    password: Joi.string().min(8).max(255).required().messages({
      'any.required': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot be more than 255 characters',
    }),
  });
  return schema.validate(data);
};

export default login;
