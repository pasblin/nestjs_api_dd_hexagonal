import { Safebox, SafeboxRepository } from '../domain';

export class CreateSafeboxUsecase {
  constructor(private repository: SafeboxRepository) {}

  handle(safebox: Safebox): Promise<string> {
    return this.repository.create(safebox);
  }
}
