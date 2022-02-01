import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'modules/auth/constants';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
