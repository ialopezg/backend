export class TokenDto {
  constructor(private readonly value: string) {}

  static get expirationInMs() {
    return 30 * 60 * 1000;
  }
}
