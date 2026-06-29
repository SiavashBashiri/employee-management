import { TagType } from './consts/tag-type.const';
import { TagsService } from './tags.service';

describe('TagsService (unit)', () => {
  let service: TagsService;
  let mockModel: any;

  beforeEach(() => {
    mockModel = jest.fn((dto: any) => ({
      save: jest.fn().mockResolvedValue(dto),
    }));

    mockModel.findOne = jest
      .fn()
      .mockReturnValue({ sort: jest.fn().mockResolvedValue(undefined) });
    mockModel.find = jest.fn().mockResolvedValue([]);
    mockModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);
    mockModel.deleteOne = jest.fn().mockResolvedValue({});

    service = new TagsService(mockModel);
  });

  it('creates a positive tag with string id', async () => {
    const dto = { label: 'Good', color: '#fff', type: TagType.POSITIVE };

    const saved = await service.create(dto);

    expect(mockModel).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Good',
        type: TagType.POSITIVE,
        id: expect.any(String),
      }),
    );
    expect(saved).toMatchObject(expect.objectContaining({ label: 'Good' }));
  });

  it('creates a negative tag with numeric id when previous exists', async () => {
    mockModel.findOne = jest
      .fn()
      .mockReturnValue({ sort: jest.fn().mockResolvedValue({ id: '4' }) });

    const dto = { label: 'Bad', color: '#000', type: TagType.NEGATIVE };

    const saved = await service.create(dto);

    expect(mockModel.findOne).toHaveBeenCalledWith({ type: TagType.NEGATIVE });
    expect(mockModel).toHaveBeenCalledWith(
      expect.objectContaining({ id: '5' }),
    );
    expect(saved).toMatchObject(expect.objectContaining({ label: 'Bad' }));
  });

  it('findAll delegates to model.find', async () => {
    mockModel.find = jest.fn().mockResolvedValue([{ label: 'x' }]);

    const res = await service.findAll();

    expect(mockModel.find).toHaveBeenCalled();
    expect(res).toEqual([{ label: 'x' }]);
  });

  it('findAll with type filters', async () => {
    mockModel.find = jest.fn().mockResolvedValue([{ label: 'y' }]);

    const res = await service.findAll(TagType.POSITIVE);

    expect(mockModel.find).toHaveBeenCalledWith({ type: TagType.POSITIVE });
    expect(res).toEqual([{ label: 'y' }]);
  });

  it('update calls findOneAndUpdate with string id', async () => {
    mockModel.findOneAndUpdate = jest
      .fn()
      .mockResolvedValue({ label: 'updated' });

    const res = await service.update(123, { label: 'updated' } as any);

    expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
      { id: '123' },
      { label: 'updated' },
      { new: true },
    );
    expect(res).toEqual({ label: 'updated' });
  });

  it('remove calls deleteOne with string id', async () => {
    mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

    const res = await service.remove('abc');

    expect(mockModel.deleteOne).toHaveBeenCalledWith({ id: 'abc' });
    expect(res).toEqual({ deletedCount: 1 });
  });

  it('remove calls deleteOne with numeric id as string or number', async () => {
    mockModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

    const res = await service.remove('123');

    expect(mockModel.deleteOne).toHaveBeenCalledWith({
      id: { $in: ['123', 123] },
    });
    expect(res).toEqual({ deletedCount: 1 });
  });
});
