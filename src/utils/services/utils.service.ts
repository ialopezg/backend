import _ from 'lodash';

export class UtilsService {
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E,
    options?: any,
  ): T;
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E[],
    options?: any,
  ): T[];
  public static toDto<T, E>(
    model: new (entity: E, options?: any) => T,
    entity: E | E[],
    options?: any,
  ): T | T[] {
    if (_.isArray(entity)) {
      return entity.map((u) => new model(u, options));
    }

    return new model(entity, options);
  }

  static capitalizeFirst(value: string): string {
    return `${value.toString().toLowerCase().charAt(0).toUpperCase()}${value
      .toString()
      .toLowerCase()
      .slice(1)}`;
  }

  static generateRandomInteger(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^a-zA-Z0-9]+/g, '')
      .toUpperCase()
      .substr(0, length);
  }

  static getAge(birthdate: Date | string | number): number {
    return Math.floor(
      (new Date().getTime() - new Date(birthdate).getTime()) / 3.15576e10,
    );
  }
}
