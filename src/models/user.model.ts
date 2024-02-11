import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema } from 'mongoose';

export type UserType = Document & {
  username: string;
  email: string;
  password: string;
  generateAuthToken: () => string;
};

const schema = new Schema<UserType>(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Email is required'],
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      maxlength: [1024, 'Password cannot be more than 1024 characters'],
    },
  },
  {
    timestamps: true,
  }
);

schema.methods.generateAuthToken = function (this: UserType) {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.JWT_PRIVATE_KEY || 'fallback_key_12345_924542'
  );
  return token;
};

const User = mongoose.model<UserType>('User', schema);
export default User;
