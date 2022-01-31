import { v4 as uuid } from 'uuid';

export const generateUUID = (): string => uuid();

export const generateFilename = (ext: string): string =>
  `${generateUUID()}.${ext}`;
