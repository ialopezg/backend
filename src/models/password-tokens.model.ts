import * as mongoose from 'mongoose';

import { db } from './db';

const Schema = mongoose.Schema;

interface PasswordToken extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  token: string;
}

type PasswordTokenType = PasswordToken & mongoose.Document;

export const PasswordTokenModel = db.model<PasswordTokenType>(
  'PasswordToken',
  new mongoose.Schema(
    {
      user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
      token: { type: String, required: true },
    },
    {
      timestamps: true,
      collection: 'password_tokens',
    },
  ),
);
