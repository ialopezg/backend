import * as mongoose from 'mongoose';

import { db } from './db';

interface Currency extends mongoose.Document {
  name: string;
  code: any;
  exchangeRate: number;
}

type CurrencyType = Currency & mongoose.Document;

export const Currency = db.model<CurrencyType>(
  'Currency',
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      code: { type: String, required: true },
      exchangeRate: { type: Number, required: true },
    },
    { timestamps: true },
  ),
);
