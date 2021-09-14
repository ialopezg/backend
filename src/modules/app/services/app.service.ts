import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly _logger: Logger = new Logger(AppService.name);

  async onModuleInit() {
    this._logger.log('AppService has been initialized.');
  }
}
