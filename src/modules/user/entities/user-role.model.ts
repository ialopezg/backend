import { db } from '../../../models/db';
import mongoose from 'mongoose';

interface UserRoleInterface extends mongoose.Document {
  name: string;
  default: boolean;
}

type UserRoleType = UserRoleInterface & mongoose.Document;

const UserRoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    default: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'user_roles',
  },
);

export const defaultRoles = [
  { name: 'ROOT' },
  { name: 'ADMIN' },
  { name: 'USER', default: true },
];

export const UserRole = db.model<UserRoleType>('UserRole', UserRoleSchema);