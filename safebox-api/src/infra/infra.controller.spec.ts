import { Test, TestingModule } from '@nestjs/testing';
import { InfraController } from './infra.controller';
import { BasicStrategy } from './auth/basic.strategy';
import { LoginErrorListener } from './listeners/login-error.listener';
import { JwtStrategy } from './auth/jwt.strategy';
import SafeboxRepositoryMongo from './modules/db/adapters/safebox.repository.mongo';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {Safebox, SafeboxRepository} from '../domain';
import {Safebox as SafeboxDb} from './modules/db/adapters/schema/safebox.shema';
import {Response} from 'express';
import {getModelToken} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';
import HttpExceptionFilter from "./exceptions/http-exception.filter";



describe('InfraController', () => {
  let controller: InfraController;
  let safeboxRepository: SafeboxRepository;

  const res = {} as unknown as Response

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot(),
        PassportModule,
        ConfigModule.forRoot({
          isGlobal: true
        }),
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
        {
          provide: getModelToken('Safebox'),
          useValue: Model<SafeboxDb> // <-- Use the Model Class from Mongoose
        },

        BasicStrategy,
        HttpExceptionFilter,
        LoginErrorListener,
        JwtStrategy,
        {
          provide: 'SafeboxRepository',
          useClass: SafeboxRepositoryMongo,
        },
      ],
    }).compile();
    safeboxRepository = module.get<SafeboxRepository>('SafeboxRepository');
    controller = module.get<InfraController>(InfraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create safe box', () => {
    it('should create safebox', async () => {
      jest.spyOn(safeboxRepository, 'create').mockImplementation(() => Promise.resolve('63189e775dedd03ba7eab4cd'));
      expect(await controller.createSafebox({'name': 'safebox.name3', 'password': 'safebox.password'})).toEqual({id: '63189e775dedd03ba7eab4cd' });
    });
    it('should return existed safebox', async () => {
      jest.spyOn(safeboxRepository, 'create').mockRejectedValue(mongoose.Error.ParallelSaveError);
      try {
        await controller.createSafebox({
          'name': 'safebox.name3',
          'password': 'safebox.password'
        });
      } catch (e) {
        console.log(e)
        expect(e).toEqual(mongoose.Error.ParallelSaveError);
      }
    });
  });
});
