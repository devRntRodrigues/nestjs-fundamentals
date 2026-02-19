import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Flavor {
  @Prop({ required: true, unique: true })
  name: string;
}

export const FlavorSchema = SchemaFactory.createForClass(Flavor);
