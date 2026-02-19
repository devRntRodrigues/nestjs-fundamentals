import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Coffee extends Document {
  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop({ type: [Types.ObjectId], ref: 'Flavor' })
  flavors: Types.ObjectId[];

  @Prop({ default: 0 })
  recommendations: number;
}

export const CoffeeSchema = SchemaFactory.createForClass(Coffee);
