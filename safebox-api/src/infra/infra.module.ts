import { DynamicModule, Module } from '@nestjs/common';
import { InfraController } from './infra.controller';
import SafeboxRepositoryMongo from './modules/db/adapters/safebox.repository.mongo';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './auth/basic.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { LoginErrorListener } from './listeners/login-error.listener';
import { DbModule } from './modules/db/db.module';

@Module({
})
export class InfraModule {
  static foorRoot(): DynamicModule {
    return {
      module: InfraModule,
      imports: [
        DbModule,
        PassportModule,
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '3m' },
          }),
          inject: [ConfigService],
        }),

      ],
      controllers: [InfraController],
      providers: [
        BasicStrategy,
        LoginErrorListener,
        JwtStrategy,
        {
          provide: 'SafeboxRepository',
          useExisting: SafeboxRepositoryMongo,
        },
      ],
    };
  }
}