import { generateHash } from '@ialopezg/corejs';
import { isEmail } from 'class-validator';
import * as mongoose from 'mongoose';

import { db } from './db';

interface IUser extends mongoose.Document {
  name: string;
  lastname: any;
  email: string;
  username: string;
  password: string;
}

type UserType = IUser & mongoose.Document;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validator: [isEmail, 'Please, fill a valid email address!'],
    },
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);
UserSchema.pre('save', async function (next: any) {
  if (this.password && this.isModified('password')) {
    this.password = await generateHash(this.password);
  }

  next();
});

const User = db.model<UserType>('User', UserSchema);

export { User };
