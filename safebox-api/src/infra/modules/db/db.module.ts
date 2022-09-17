import { Module} from '@nestjs/common';
import { MongooseModule} from "@nestjs/mongoose";
import {ConfigService} from "@nestjs/config";
import {SafeboxSchema} from "./adapters/schema/safebox.shema";
import SafeboxRepositoryMongo from "./adapters/safebox.repository.mongo";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('DATABASE_URL'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{name: 'Safebox', schema: SafeboxSchema}]),
    ],
    exports: [SafeboxRepositoryMongo,MongooseModule,],
    providers: [
        SafeboxRepositoryMongo,
    ]
})
export class DbModule {}
