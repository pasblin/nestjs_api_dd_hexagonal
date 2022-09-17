import { Safebox } from '../safebox';

export interface SafeboxRepository {
  create(safebox: Safebox): Promise<string>;

  update(items: string[], safeboxId: string): Promise<void>;

  updateIntents(id: string): Promise<void>;

  get(id: string): Promise<Safebox>;
}
