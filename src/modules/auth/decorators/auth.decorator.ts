import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleType } from 'modules/auth/constants';
import {
  JwtAccessTokenGuard,
  EmailConfirmationGuard,
  RolesGuard,
} from 'modules/auth/guards';

export function Authorization(...roles: RoleType[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAccessTokenGuard, RolesGuard, EmailConfirmationGuard),
  );
}
