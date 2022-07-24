import { TokenDto } from '../../dtos';

describe('TokenDto', () => {
  it('should create with value', () => {
    const accessToken = new TokenDto('any_value');

    expect(accessToken).toEqual({ value: 'any_value' });
  });

  it('should expire in 1800000 ms', function () {
    expect(TokenDto.expirationInMs).toEqual(1800000);
  });
});
