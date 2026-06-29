import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { Tag, TagDocument } from '../tags/schemas/tag.schema';
import { TagType } from '../tags/consts/tag-type.const';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { OfficeLocation } from './consts/office-location.const';
import { GetEmployeesQueryDto } from './dto/get-employees.query';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>,

    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagDocument>,
  ) {}

  public async create(dto: CreateEmployeeDto) {
    await this.validateTags(dto);

    return (await this.employeeModel.create(dto)).toJSON();
  }

  async findAll(query: GetEmployeesQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (query.office) {
      filter.office = query.office;
    }

    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.employeeModel.find(filter).skip(skip).limit(limit),
      this.employeeModel.countDocuments(filter),
    ]);

    const cleanedData = data.map((doc) => doc.toJSON());

    return {
      data: cleanedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async findOne(id: string) {
    const employee = await this.employeeModel.findById(id);

    if (!employee) {
      throw new NotFoundException('Employee not found.');
    }

    return employee;
  }

  public async update(id: string, dto: UpdateEmployeeDto) {
    if (this.hasTags(dto)) {
      await this.validateTags({
        positiveTagIds: dto.positiveTagIds ?? [],
        negativeTagIds: dto.negativeTagIds ?? [],
      });
    }

    const employee = await this.employeeModel
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .lean();

    if (!employee) {
      throw new NotFoundException('Employee not found.');
    }

    return employee;
  }

  public async remove(id: string) {
    const employee = await this.employeeModel.findByIdAndDelete(id);

    if (!employee) {
      throw new NotFoundException('Employee not found.');
    }

    return;
  }

  private async validateTags(dto: {
    positiveTagIds: string[];
    negativeTagIds: number[];
  }) {
    await this.validatePositiveTags(dto.positiveTagIds);
    await this.validateNegativeTags(dto.negativeTagIds);
  }

  private async validatePositiveTags(ids: string[]) {
    if (!ids?.length) return;

    const tags = await this.tagModel.find({
      type: TagType.POSITIVE,
    });
    const existing = new Set(tags.map((t) => t.id as string));

    const invalid = ids.filter((id) => !existing.has(id));

    if (invalid.length) {
      throw new BadRequestException(
        `Invalid positive tag ids: ${invalid.join(', ')}`,
      );
    }
  }

  private async validateNegativeTags(ids: number[]) {
    if (!ids?.length) return;

    const tags = await this.tagModel.find({
      type: TagType.NEGATIVE,
    });
    const existing = new Set(tags.map((t) => Number(t.id)));

    const invalid = ids.filter((id) => !existing.has(id));

    if (invalid.length) {
      throw new BadRequestException(
        `Invalid negative tag ids: ${invalid.join(', ')}`,
      );
    }
  }

  private hasTags(dto: UpdateEmployeeDto): boolean {
    return !!(dto.positiveTagIds || dto.negativeTagIds);
  }
}
