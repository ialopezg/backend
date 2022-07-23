export interface FacebookDataDto {
  id: string;
  name: string;
  email: string;
}

export interface UserDto {
  id?: string;
  name?: string;
}

export class FacebookAccountDto {
  id?: string;
  fid: string;
  name: string;
  email: string;

  constructor(facebookDataDto: FacebookDataDto, userDto?: UserDto) {
    this.id = userDto?.id;
    this.fid = facebookDataDto.id;
    this.name = userDto?.name ?? facebookDataDto.name;
    this.email = facebookDataDto.email;
  }
}
