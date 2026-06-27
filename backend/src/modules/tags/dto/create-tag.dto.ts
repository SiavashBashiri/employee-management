import { TagType } from '../consts/tag-type.const';

export class CreateTagDto {
  label: string;
  color: string;
  type: TagType;
}
