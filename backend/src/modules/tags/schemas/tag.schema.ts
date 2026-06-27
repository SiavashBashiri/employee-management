import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TagType } from '../consts/tag-type.const';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true })
export class Tag {
  @Prop()
  id: string | number;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  type: TagType;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
