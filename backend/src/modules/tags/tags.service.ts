import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagType } from './consts/tag-type.const';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, TagDocument } from './schemas/tag.schema';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  public async create(dto: CreateTagDto) {
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

  public async findAll(type?: TagType) {
    if (type) {
      return this.tagModel.find({ type });
    }
    return this.tagModel.find();
  }

  public async update(id: string | number, dto: UpdateTagDto) {
    return this.tagModel.findOneAndUpdate(this.buildIdFilter(id), dto, {
      new: true,
    });
  }

  public async remove(id: string | number) {
    return this.tagModel.deleteOne(this.buildIdFilter(id));
  }

  private buildIdFilter(id: string | number) {
    const stringId = id.toString();
    const numericId = Number(stringId);
    const filter: Record<string, any> = { id: stringId };

    if (!Number.isNaN(numericId)) {
      filter.id = { $in: [stringId, numericId] };
    }

    return filter;
  }

  private async generateNumericId(): Promise<number> {
    const last = await this.tagModel
      .findOne({ type: TagType.NEGATIVE })
      .sort({ id: -1 });

    return last?.id ? Number(last.id) + 1 : 1;
  }
}
