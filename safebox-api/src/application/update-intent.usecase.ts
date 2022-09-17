import { SafeboxRepository } from '../domain';
export default class UpdateIntentUsecase {
  constructor(private repository: SafeboxRepository) {}

  handle(safeboxId: string): Promise<void> {
    return this.repository.updateIntents(safeboxId);
  }
}
