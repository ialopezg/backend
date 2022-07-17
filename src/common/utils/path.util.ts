export const getDefaultPath = (): string => 'storage';

export const getPath = (path: string): string =>
  path ? `${getDefaultPath()}/${path}` : getDefaultPath();
