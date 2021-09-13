import 'providers/polyfill.provider';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from 'modules/app/services';
import { contextMiddleware } from 'middlewares';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}
