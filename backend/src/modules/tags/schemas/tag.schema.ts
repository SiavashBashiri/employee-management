import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { TagType } from '../consts/tag-type.const';

export type TagDocument = HydratedDocument<Tag>;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (_, ret: any) => {
      delete ret._id;

      return ret;
    },
  },
})
export class Tag {
  @Prop({ type: MongooseSchema.Types.Mixed })
  id?: string | number;

  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  color: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(TagType),
    default: TagType.POSITIVE,
  })
  type: TagType = TagType.POSITIVE;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
