import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function generateHash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function validateHash(
  password: string,
  hash: string,
): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash || '');
}

export function encodeString(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}
