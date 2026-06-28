import { IsEnum, IsHexColor, IsString } from 'class-validator';
import { TagType } from '../consts/tag-type.const';

export class CreateTagDto {
  @IsString()
  label: string;

  @IsHexColor()
  color: string;

  @IsEnum(TagType)
  type: TagType;
}
