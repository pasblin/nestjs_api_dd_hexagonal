import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SafeboxRepository, Safebox } from '../../../../domain';
import { SafeboxDocument } from './schema/safebox.shema';

@Injectable()
export default class SafeboxRepositoryMongo implements SafeboxRepository {
  constructor(
    @InjectModel('Safebox')
    private readonly safeboxModel: Model<SafeboxDocument>,
  ) {}

  async create(safebox: Safebox): Promise<string> {
    const createSafebox = new this.safeboxModel(safebox);
    const safeBox = await createSafebox.save();
    return safeBox.id;
  }

  async update(items: string[], safeboxId: string): Promise<void> {
    const updated = await this.safeboxModel.findByIdAndUpdate(safeboxId, {
      $addToSet: { items: items },
    });
    if (!updated) {
      throw new NotFoundException();
    }
  }

  async get(id: string): Promise<Safebox> {
    const safebox = await this.safeboxModel.findById(id);
    if (!safebox) {
      throw new NotFoundException();
    }
    return safebox;
  }

  async updateIntents(safeboxId: string): Promise<void> {
    const updated = await this.safeboxModel.findByIdAndUpdate(safeboxId, {
      $inc: { intents: 1 },
    });
    if (!updated) {
      throw new NotFoundException();
    }
  }
}
