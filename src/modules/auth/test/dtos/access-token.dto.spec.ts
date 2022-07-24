import { AccessTokenDto } from '../../dtos';

describe('AccessTokenDto', () => {
  it('should create with value', () => {
    const accessToken = new AccessTokenDto('any_value');

    expect(accessToken).toEqual({ value: 'any_value' });
  });
});
