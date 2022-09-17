import { BasicStrategy as Strategy } from 'passport-http';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SafeboxRepository } from '../../domain';
import { EventEmitter2 } from '@nestjs/event-emitter';
import LoginErrorEvent from '../../application/events/login-error.event';
import { LockedException } from '../exceptions/locked.exception';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(
    private eventEmitter: EventEmitter2,
    @Inject('SafeboxRepository')
    private readonly safeboxRepository: SafeboxRepository,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(req, username, password): Promise<boolean> {
    const safebox: any = await this.safeboxRepository.get(req.params.id);
    if (safebox.intents >= 3) {
      throw new LockedException();
    }
    if (safebox.name === username && safebox.comparePassword(password)) {
      return true;
    }
    const loginErrorEvent = new LoginErrorEvent();
    loginErrorEvent.safeboxId = req.params.id;
    this.eventEmitter.emit('login.error', loginErrorEvent);
    return false;
  }
}
