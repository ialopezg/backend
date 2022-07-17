import * as mongoose from 'mongoose';

import { db } from '../../../models/db';
import { TokenType } from '../enums';

const Schema = mongoose.Schema;

interface TokenInterface extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  type: string;
  hash: string;
}

type TokenDataType = TokenInterface & mongoose.Document;

export const Token = db.model<TokenDataType>(
  'Token',
  new mongoose.Schema(
    {
      user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
      type: {
        type: String,
        enum: TokenType,
        default: TokenType.VERIFICATION,
      },
      hash: { type: String, required: true, unique: true },
    },
    { timestamps: true },
  ),
);
