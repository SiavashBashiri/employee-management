import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OfficeLocation } from '../consts/office-location.const';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (_, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Employee {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, type: String, enum: Object.values(OfficeLocation) })
  office: OfficeLocation;

  @Prop({ required: true, type: Date })
  dateOfBirth: Date;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({
    type: [String],
    required: true,
    default: [],
  })
  positiveTagIds: string[];

  @Prop({
    type: [Number],
    required: true,
    default: [],
  })
  negativeTagIds: number[];
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
