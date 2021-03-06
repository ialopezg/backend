export interface FacebookUserDto {
  id?: string;
  fid: string;
  name: string;
  email: string;
}

export interface FindFacebookUserParams {
  email: string;
}

export interface FacebookRepositoryResult {
  id: string;
  name?: string;
}

export interface UserRepository {
  load: (params: FindFacebookUserParams) => Promise<FacebookRepositoryResult>;
  save: (params: FacebookUserDto) => Promise<FacebookRepositoryResult>;
}
