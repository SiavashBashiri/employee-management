import {
  IsString,
  IsDateString,
  IsEnum,
  IsArray,
  IsNumber,
} from 'class-validator';
import { OfficeLocation } from '../consts/office-location.const';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(OfficeLocation)
  office: OfficeLocation;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  phoneNumber: string;

  @IsArray()
  @IsString({ each: true })
  positiveTagIds: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  negativeTagIds: number[];
}
