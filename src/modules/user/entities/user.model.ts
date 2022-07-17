import { generateHash } from '@ialopezg/corejs';
import { isEmail } from 'class-validator';
import * as mongoose from 'mongoose';

import { db } from '../../../models/db';

interface UserInterface extends mongoose.Document {
  name: string;

  lastname?: string;

  phone?: string;

  mobile: string;

  email: string;

  username?: string;

  password: string;

  avatar: string;

  role: string;

  status: string;

  verifiedAt: Date;
}

type UserType = UserInterface & mongoose.Document;

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String },
    phone: { type: String },
    mobile: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validator: [isEmail, 'Please, fill a valid email address!'],
    },
    username: { type: String, unique: true, index: true },
    password: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ['USER', 'ADMIN', 'SU'], default: 'USER' },
    verifiedAt: { type: Date },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Banned'],
      default: 'Inactive',
    },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function (next: any) {
  // encrypt the password
  if (this.password && this.isModified('password')) {
    this.password = await generateHash(this.password);
  }

  // if no lastname, take lastname from name
  if (!this?.lastname && this.name.indexOf(' ') > 0) {
    const fullName = this.name.split(' ');
    if (fullName.length >= 2) {
      this.name = fullName[0];
      this.lastname = fullName.slice(1).join(' ');
    }
  }

  // if no username take username from the email address
  if (!this.username) {
    this.username = this.email.split('@').shift();
  }

  next();
});

const User = db.model<UserType>('User', UserSchema);

const parseUser = (user: any): any => {
  return user
    ? {
        uuid: user.id,
        name: user.name,
        lastname: user.lastname,
        phone: user.phone,
        mobile: user.mobile,
        username: user.email,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
      }
    : null;
};

export { User, parseUser };
