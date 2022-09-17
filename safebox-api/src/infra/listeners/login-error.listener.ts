import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import LoginErrorEvent from '../../application/events/login-error.event';
import { SafeboxRepository } from '../../domain';
import UpdateIntentUsecase from '../../application/update-intent.usecase';

@Injectable()
export class LoginErrorListener {
  constructor(
    @Inject('SafeboxRepository') private safeboxRepository: SafeboxRepository,
  ) {}
  @OnEvent('login.error')
  async handleOrderCreatedEvent(event: LoginErrorEvent) {
    await new UpdateIntentUsecase(this.safeboxRepository).handle(
      event.safeboxId,
    );
  }
}
