import { FacebookAccountDto } from '../../dtos/facebook-account.dto';

describe('FacebookAccountDto', () => {
  const data = {
    id: 'any_facebook_id',
    email: 'any_facebook_email',
    name: 'any_facebook_name',
  };

  it('should create with facebook data only', () => {
    const account = new FacebookAccountDto(data);

    expect(account).toEqual({
      fid: 'any_facebook_id',
      email: 'any_facebook_email',
      name: 'any_facebook_name',
    });
  });

  it('should update name if its not empty', () => {
    const userData = { id: 'any_id', name: 'any_name' };
    const account = new FacebookAccountDto(data, userData);

    expect(account).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_facebook_email',
      fid: 'any_facebook_id',
    });
  });
});
