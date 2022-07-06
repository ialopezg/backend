import { Schema } from 'mongoose';

import { db } from '../../../models/db';

interface PreferenceInterface extends Document {
  key: string;
  value: string;
}

type PreferenceType = PreferenceInterface & Document;

const PreferenceSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { timestamps: true },
);

export const Preference = db.model<PreferenceType>(
  'Preference',
  PreferenceSchema,
);

export const defaultValues = {};
