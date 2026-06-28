import { Test, TestingModule } from '@nestjs/testing';
import { TagType } from './consts/tag-type.const';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

describe('TagsController (unit)', () => {
  let controller: TagsController;
  let mockService: Partial<Record<keyof TagsService, jest.Mock>>;

  beforeEach(async () => {
    mockService = {
      create: jest.fn().mockResolvedValue({ id: '1', label: 'a' }),
      findAll: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({ id: '1', label: 'updated' }),
      remove: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [{ provide: TagsService, useValue: mockService }],
    }).compile();

    controller = module.get<TagsController>(TagsController);
  });

  it('creates a tag and returns result', async () => {
    const dto = { label: 'a', color: '#fff', type: TagType.POSITIVE } as any;

    const res = await controller.create(dto);

    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(res).toEqual({ id: '1', label: 'a' });
  });

  it('findAll without type calls service.findAll(undefined)', async () => {
    await controller.findAll(undefined);

    expect(mockService.findAll).toHaveBeenCalledWith(undefined);
  });

  it('findAll with type forwards the type', async () => {
    await controller.findAll(TagType.NEGATIVE);

    expect(mockService.findAll).toHaveBeenCalledWith(TagType.NEGATIVE);
  });

  it('update forwards id and dto to service.update', async () => {
    const res = await controller.update('123', { label: 'updated' } as any);

    expect(mockService.update).toHaveBeenCalledWith('123', {
      label: 'updated',
    });
    expect(res).toEqual({ id: '1', label: 'updated' });
  });

  it('remove forwards id to service.remove', async () => {
    const res = await controller.remove('123');

    expect(mockService.remove).toHaveBeenCalledWith('123');
    expect(res).toEqual({ deletedCount: 1 });
  });
});
