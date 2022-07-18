import { generateHash } from '@ialopezg/corejs';
import { isEmail } from 'class-validator';
import { Document, Schema } from 'mongoose';

import { db } from '../../../models/db';
import { UserDto } from '../dtos';
import { UserStatus } from '../enums';

interface UserInterface extends Document {
  name: string;

  lastname?: string;

  phone?: string;

  mobile: string;

  email: string;

  username?: string;

  password: string;

  avatar: string;

  role: string;

  status: UserStatus;

  verifiedAt: Date;
}

type UserType = UserInterface & Document;

const UserSchema = new Schema(
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
      validator: [ isEmail, 'Please, fill a valid email address!' ],
    },
    username: { type: String, unique: true, index: true },
    password: { type: String, required: true },
    avatar: { type: String },
    role: { type: Schema.Types.ObjectId, required: true, ref: 'Role' },
    verifiedAt: { type: Date },
    status: {
      type: String,
      enum: UserStatus,
      default: UserStatus.INACTIVE,
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

  if (this.status === 'Active') {
    this.verifiedAt = new Date();
  }

  next();
});

UserSchema.methods.toDto = function (): UserDto {
  return {
    uuid: this.id,
    name: this.name,
    lastname: this.lastname,
    phone: this.phone,
    mobile: this.mobile,
    username: this.email,
    email: this.email,
    avatar: this.avatar,
    role: this.role,
    status: this.status,
    verifiedAt: this.verifiedAt,
  };
};

export const User = db.model<UserType>('User', UserSchema);
