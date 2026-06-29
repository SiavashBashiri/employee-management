import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { OfficeLocation } from '../consts/office-location.const';

export class GetEmployeesQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  office?: OfficeLocation;
}
