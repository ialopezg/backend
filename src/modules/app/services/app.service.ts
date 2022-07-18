import { Component } from '@ialopezg/corejs';

import { PreferenceService } from '../../preference/services';
import { UserRoleService } from '../../user/services';
import { AuthService } from '../../auth/services';

@Component()
export class AppService {
  constructor(
    private readonly preferences: PreferenceService,
    private readonly userRoleService: UserRoleService,
    private readonly authService: AuthService,
  ) {
    this.init()
      .then(() => {})
      .catch((error: any) => console.log(error));
  }

  async init(): Promise<void> {
    await this.preferences.createDefaultValues();
    await this.userRoleService.createDefaultRoles();
    await this.authService.createDefaultUsers();
    console.log('Application initialized!');
  }
}