import { SafeboxRepository } from '../domain';

export class GetSafeboxItemsUsecase {
  constructor(private repository: SafeboxRepository) {}

  async handle(safeboxId: string): Promise<string[]> {
    const sb = await this.repository.get(safeboxId);
    return sb.items;
  }
}
