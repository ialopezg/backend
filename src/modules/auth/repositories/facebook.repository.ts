export interface CreateFacebookUser {
  fid: string;
  name: string;
  email?: string;
}

export interface UpdateFacebookUser extends CreateFacebookUser {
  id: string;
}

export interface FindFacebookUserParams {
  email: string;
}

export interface FacebookRepositoryResult {
  id: string;
  name?: string;
}

export interface FacebookRepository {
  create: (params: CreateFacebookUser) => Promise<void>;
  load: (params: FindFacebookUserParams) => Promise<FacebookRepositoryResult>;
  update: (params: UpdateFacebookUser) => Promise<void>;
}
