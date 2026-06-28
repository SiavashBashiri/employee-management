import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagType } from './consts/tag-type.const';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(dto: CreateTagDto) {
    const id =
      dto.type === TagType.POSITIVE
        ? crypto.randomUUID()
        : await this.generateNumericId();

    const tag = new this.tagModel({
      ...dto,
      id,
    });

    return tag.save();
  }

  async findAll(type?: TagType) {
    if (type) {
      return this.tagModel.find({ type });
    }
    return this.tagModel.find();
  }

  async update(id: string | number, dto: UpdateTagDto) {
    return this.tagModel.findOneAndUpdate({ id: id.toString() }, dto, {
      new: true,
    });
  }

  async remove(id: string | number) {
    return this.tagModel.deleteOne({ id: id.toString() });
  }

  private async generateNumericId(): Promise<number> {
    const last = await this.tagModel
      .findOne({ type: TagType.NEGATIVE })
      .sort({ id: -1 });

    return last?.id ? Number(last.id) + 1 : 1;
  }
}
