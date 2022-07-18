import { Component } from '@ialopezg/corejs';

import { defaultRoles, UserRole } from '../entities';
import { PreferenceService } from '../../preference/services';

@Component()
export class UserRoleService {
  constructor(private readonly preferences: PreferenceService) {}

  async createDefaultRoles(): Promise<void> {
    if (!(await this.empty())) {
      return null;
    }

    await UserRole.insertMany(defaultRoles);
    const defaultRole = await this.getDefaultRole();
    await this.preferences.setValue(
      'user.roles.default',
      defaultRole ? defaultRole.name : 'USER',
    );
    console.log('Default roles successfully created!');
  }

  async empty(): Promise<boolean> {
   return (await UserRole.countDocuments({})) <= 0;
  }

  async getRole(
    options: Partial<{ default: true, name: string, uuid: string }>,
    coincidence = false,
    exactMatch = true,
  ): Promise<any> {
    // Get simple comparison result
    if (!coincidence) {
      const key = Object.keys(options).shift();
      const value = options[key];

      // Otherwise compare first options key value
      return UserRole.findOne({
        [key]: exactMatch ? value : new RegExp(`^${value}$`, 'i'),
      });
    }

    // Get options keys
    const keys = Object.keys(options);
    // If coincidence and keys length equals 1, return non-coincidence and exact match
    if (keys.length > 0 && keys.length < 2) {
      return this.getRole(options);
    }

    // If keys length > 1 make coincidence search
    const filters = [];
    keys.forEach((key: string) => {
      filters.push({
        [key]: exactMatch ? options[key] : new RegExp(`^${options[key]}$`, 'i'),
      });
    });

    return UserRole.findOne({ $or: filters });
  }

  async getDefaultRole() {
    return this.getRole({ default: true });
  }

  async getRoleByName(name: string): Promise<any> {
    return this.getRole({ name });
  }
}