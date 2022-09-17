import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
export type SafeboxDocument = Safebox & Document;

@Schema()
export class Safebox {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String] })
  items: string[];
  @Prop({
    default: 0,
  })
  intents: number;
}

export const SafeboxSchema = SchemaFactory.createForClass(Safebox)
  .pre('save', function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  })
  .method({
    comparePassword(candidatePassword) {
      return bcrypt.compareSync(candidatePassword, this.password);
    },
  });
