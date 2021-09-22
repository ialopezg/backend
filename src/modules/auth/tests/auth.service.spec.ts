import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AuthService } from '../services';
import { MAIL_QUEUE } from '../../mail/constants';
import { MailService } from '../../mail/services';
import { UserAuthRepository, UserRepository } from '../../user/repositories';
import { UserAuthService, UserService } from '../../user/services';
import {
  ConnectionMock,
  mockedConfigService,
  mockedJwtService,
} from '../../../utils/mocks';

describe('AuthService', () => {
  let module: TestingModule;
  let authService: AuthService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [BullModule.registerQueue({ name: MAIL_QUEUE })],
      providers: [
        UserService,
        UserAuthService,
        AuthService,
        MailService,
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: getRepositoryToken(UserRepository), useValue: {} },
        { provide: getRepositoryToken(UserAuthRepository), useValue: {} },
        { provide: Connection, useClass: ConnectionMock },
      ],
    }).compile();

    authService = await module.get(AuthService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const email = 'test@example.com';

      expect(typeof authService.getJwtConfirmToken(email)).toEqual('string');
    });
  });

  describe('when removing a cookie', () => {
    it('should return a object', () => {
      expect(typeof authService.getCookiesForLogout()).toEqual('object');
    });
  });
});
