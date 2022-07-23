export interface CreateFacebookUserParams {
  fid: string;
  name: string;
  email: string;
}

export interface FindFacebookUserParams {
  email: string;
}

export interface FacebookRepositoryResult {
  result: undefined;
}

export interface FacebookRepository {
  create: (params: CreateFacebookUserParams) => Promise<void>;
  load: (params: FindFacebookUserParams) => Promise<FacebookRepositoryResult>;
}
