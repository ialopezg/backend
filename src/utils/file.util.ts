import path from 'path';

export const getFilenameWithoutExtension = (filename: string) => path.parse(filename).name;

export const getFileExtension = (filename: string) => path.parse(filename).ext;
