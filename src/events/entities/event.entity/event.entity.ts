import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Event {
  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  payload: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ name: 1, type: -1 });
