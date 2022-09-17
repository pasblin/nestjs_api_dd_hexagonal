import { SafeboxRepository } from '../domain';

export class UpdateSafeboxUsecase {
  constructor(private repository: SafeboxRepository) {}

  handle(items: string[], safeboxId: string): Promise<void> {
    return this.repository.update(items, safeboxId);
  }
}
