import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import User from '../../models/user.model';
import bcrypt from 'bcrypt';
import { usernameRegex } from '../../config/main.config';

type BodyType = {
  username: string;
  email: string;
  password: string;
};

const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  // create a user
  try {
    const { password, email, username } = req.body as BodyType;

    //check if user exist
    const existedUser = await User.findOne({ email, username });
    if (existedUser)
      return res.status(400).json({ message: 'User already exists' });

    // create a user
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    req.body.password = hashedPass;

    const user = new User(req.body);
    const savedUser: any = await user.save();
    const { password: pass, ...userWithoutPassword } = savedUser._doc;
    if (!savedUser)
      return res.status(400).json({ message: 'User could not be created' });
    const token = savedUser.generateAuthToken();
    return res.status(201).json({
      message: 'user has been created',
      user: { ...userWithoutPassword },
      token,
    });
  } catch (error: any) {
    next(error);
  }
};

// for validating the req.body
const validate = (data: BodyType): Joi.ValidationResult => {
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
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.email': 'Email must be a valid email',
    }),
    password: Joi.string().min(8).max(255).required().messages({
      'any.required': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password cannot be more than 255 characters',
    }),
  });
  return schema.validate(data);
};

export default createUser;
