import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export async function generateHash(password: string): Promise<string> {
  return bcrypt.hashSync(password, 10);
}

export function validateHash(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash || '');
}

export async function encodeString(text: string): Promise<string> {
  return crypto.createHash('sha256').update(text).digest('hex');
}
