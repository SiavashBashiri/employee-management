import { IsHexColor, IsString } from 'class-validator';

export class UpdateTagDto {
  @IsString()
  label: string;

  @IsHexColor()
  color: string;
}
