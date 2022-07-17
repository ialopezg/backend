/**
 * Looks for a key dot-notation value in given target object.
 *
 * @param key Key property name
 * @param target Target object
 *
 * @returns Key property value.
 */
export const getValue = (key: string, target: any): any => {
  return key.split('.').reduce((o: any, k: string) => (o || {})[k], target);
};

/**
 * Convert a string dot-notation into an object.
 *
 * @param key Dot-notation text.
 * @param defaultValue Default value for object property.
 *
 * @returns An object containing all properties given in dot-notation string.
 */
export const parseValue = (key: string, defaultValue: any = '') => {
  const result = {};

  // Split path into component parts
  const parts = key.split('.');

  // Create sub-objects along path as needed
  let target = result;
  while (parts.length > 1) {
    const part = parts.shift();
    target = target[part] = target[part] || {};
  }
  // Set value at end of path
  target[parts[0]] = defaultValue;

  return result;
};
