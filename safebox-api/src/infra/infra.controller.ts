import {
  Body,
  Controller,
  Get, HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import SafeboxDto from './dto/safebox.dto';
import {
  CreateSafeboxUsecase,
  GetSafeboxItemsUsecase,
  UpdateSafeboxUsecase,
} from '../application';
import { BasicAuthGuard } from './auth/basic-auth.guard';
import { SafeboxRepository } from '../domain';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('safebox')
export class InfraController {
  constructor(
    @Inject('SafeboxRepository') private safeboxRepository: SafeboxRepository,
    private jwtService: JwtService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  public async createSafebox(
    @Body() safebox: SafeboxDto,
  ): Promise<any> {
    const safeBoxId = await new CreateSafeboxUsecase(
      this.safeboxRepository,
    ).handle({
      name: safebox.name,
      password: safebox.password,
      items: [],
    });
    return {id: safeBoxId};
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async updateProduct(
    @Param('id') id: string,
    @Body() safebox: Pick<SafeboxDto, 'items'>,
  ): Promise<void> {
    await new UpdateSafeboxUsecase(
      this.safeboxRepository,
    ).handle(safebox.items, id);
    return null;
  }

  @Get(':id/items')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async getItems(
    @Param('id') id: string,
  ): Promise<string[]> {
    const items: string[] = await new GetSafeboxItemsUsecase(
      this.safeboxRepository,
    ).handle(id);
    return items;
  }

  @Get(':id/open')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async open(
    @Param('id') id: string,
  ): Promise<{ token: string }> {
    return {
      token: this.jwtService.sign({}),
    };
  }
}
