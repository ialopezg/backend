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

export const defaultValues = {
  company: {
    name: process.env.COMPANY_NAME || '',
    contact: {
      phone: process.env.COMPANY_PHONE_NUMBER || '',
      mobile: process.env.COMPANY_CONTACT_MOBILE_NUMBER || '',
      email: process.env.COMPANY_CONTACT_EMAIL_ADDRESS || '',
      url: process.env.COMPANY_CONTACT_URL || '',
      address: process.env.CONPANY_CONTACT_ADDRESS || '',
      city: process.env.COMPANY_CONTACT_CITY || '',
      cityAbbr: process.env.COMPANY_CONTACT_STATE_ABBR || '',
      state: process.env.COMPANY_CONTACT_STATE || '',
      country: process.env.COMPANY_CONTACT_COUNTRY || '',
      zipCode: process.env.COMPANY_CONTACT_ZIP_CODE,
      latitude: process.env.COMPANY_CONTACT_LATITUDE,
      longitude: process.env.COMPANY_CONTACT_LONGITUDE,
      timezone: process.env.COMPANY_CONTACT_TIMEZON || '',
    },
    logo: {
      web: process.env.COMPANY_LOGO_URL || '',
      mobile:
        process.env.COMPANY_LOGO_MOBILE_URL ||
        process.env.COMPANY_LOGO_URL ||
        '',
      favicon:
        process.env.COMPANY_FAVICON_URL || process.env.COMPANY_LOGO_URL || '',
      footer: process.env.COMPANY_FOOTER || '',
    },
    tos: '<p>TODO</p>',
    about:
      '<p>This is about us page. hello and hi from about page description.</p>',
    copyright: 'Copyright © 2022 Apple Inc. All rights reserved.',
    colors: { primary: '#4c8141', secondary: '#061fe0' },
  },
  frontend: {
    url: {
      base: process.env.FRONTEND_URL_BASE || '',
      verification: process.env.FRONTEND_URL_VERIFICATION || '',
      password: process.env.FRONTEND_URL_PASSWORD_RESET || '',
      subscription: {
        unsubscribe: process.env.FRONTEND_URL_SUBSCRIPTION_UNSUBSCRIBE || '',
        preferences: process.env.FRONTEND_URL_SUBSCRIPTION_PREFERENCES || '',
      },
    },
  },
  user: {
    requires: { verification: process.env.USER_REQUIRES_VERIFICATION || true },
  },
  mailer: {
    enabled: process.env.MAILER_ENABLED || true,
    service: {
      name: process.env.MAILER_SERVICE_NAME || '',
      user: process.env.MAILER_SERVICE_USER || '',
      password: process.env.MAILER_SERVICE_PASSWORD || '',
      sender: process.env.MAILER_SERVICE_SENDER_NAME || '',
    },
  },
  token: {
    access: {
      secretKey: process.env.ACCESS_TOKEN_SECRET_KEY || '',
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME || '',
    },
    verification: {
      secretKey: process.env.VERIFICATION_TOKEN_SECRET_KEY || '',
      expiresIn: process.env.VERIFICATION_TOKEN_EXPIRATION_TIME || '',
    },
  },
};
