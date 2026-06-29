import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TagType } from '../tags/consts/tag-type.const';
import { EmployeesService } from './employees.service';
import { OfficeLocation } from './consts/office-location.const';

describe('EmployeesService (unit)', () => {
  let service: EmployeesService;
  let mockEmployeeModel: any;
  let mockTagModel: any;

  beforeEach(() => {
    mockEmployeeModel = jest.fn((dto: any) => ({
      toJSON: jest.fn().mockReturnValue(dto),
    }));

    mockEmployeeModel.create = jest
      .fn()
      .mockImplementation(async (dto: any) => ({
        toJSON: jest.fn().mockReturnValue(dto),
      }));
    mockEmployeeModel.find = jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });
    mockEmployeeModel.countDocuments = jest.fn().mockResolvedValue(0);
    mockEmployeeModel.findById = jest.fn().mockResolvedValue(null);
    mockEmployeeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });
    mockEmployeeModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    mockTagModel = jest.fn();
    mockTagModel.find = jest.fn().mockResolvedValue([]);

    service = new EmployeesService(mockEmployeeModel, mockTagModel);
  });

  describe('create', () => {
    it('creates an employee with valid tags', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        positiveTagIds: [],
        negativeTagIds: [],
      };

      mockEmployeeModel.create = jest.fn().mockImplementation(async () => ({
        toJSON: jest.fn().mockReturnValue(dto),
      }));

      const res = await service.create(dto as any);

      expect(mockEmployeeModel.create).toHaveBeenCalledWith(dto);
      expect(res).toMatchObject(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
        }),
      );
    });

    it('throws BadRequestException when positive tag ids are invalid', async () => {
      const dto = {
        firstName: 'Jane',
        lastName: 'Smith',
        positiveTagIds: ['invalid-id'],
        negativeTagIds: [],
      };

      mockTagModel.find = jest
        .fn()
        .mockResolvedValue([{ id: 'valid-id', type: TagType.POSITIVE }]);

      await expect(service.create(dto as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(dto as any)).rejects.toThrow(
        'Invalid positive tag ids',
      );
    });

    it('throws BadRequestException when negative tag ids are invalid', async () => {
      const dto = {
        firstName: 'Jane',
        lastName: 'Smith',
        positiveTagIds: [],
        negativeTagIds: [999],
      };

      mockTagModel.find = jest.fn().mockImplementation(async (filter) => {
        if (filter.type === TagType.NEGATIVE) {
          return [{ id: '1', type: TagType.NEGATIVE }];
        }
        return [];
      });

      await expect(service.create(dto as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(dto as any)).rejects.toThrow(
        'Invalid negative tag ids',
      );
    });
  });

  describe('findAll', () => {
    it('returns paginated employees with default pagination', async () => {
      const employees = [
        {
          _id: '1',
          firstName: 'John',
          toJSON: jest.fn().mockReturnValue({ _id: '1', firstName: 'John' }),
        },
      ];

      mockEmployeeModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(employees),
        }),
      });

      mockEmployeeModel.countDocuments = jest.fn().mockResolvedValue(15);

      const res = await service.findAll({});

      expect(mockEmployeeModel.find).toHaveBeenCalledWith({});
      expect(res.meta.page).toBe(1);
      expect(res.meta.limit).toBe(10);
      expect(res.meta.total).toBe(15);
      expect(res.meta.totalPages).toBe(2);
      expect(res.data.length).toBe(1);
    });

    it('filters employees by office', async () => {
      const employees = [
        {
          _id: '1',
          office: 'NYC',
          toJSON: jest.fn().mockReturnValue({ _id: '1', office: 'NYC' }),
        },
      ];

      mockEmployeeModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(employees),
        }),
      });

      mockEmployeeModel.countDocuments = jest.fn().mockResolvedValue(1);

      const res = await service.findAll({ office: 'NYC' as OfficeLocation });

      expect(mockEmployeeModel.find).toHaveBeenCalledWith({
        office: 'NYC',
      });
      expect(res.data.length).toBe(1);
    });

    it('filters employees by search term', async () => {
      const employees = [
        {
          _id: '1',
          firstName: 'John',
          toJSON: jest.fn().mockReturnValue({ _id: '1', firstName: 'John' }),
        },
      ];

      mockEmployeeModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(employees),
        }),
      });

      mockEmployeeModel.countDocuments = jest.fn().mockResolvedValue(1);

      const res = await service.findAll({ search: 'John' });

      expect(mockEmployeeModel.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.arrayContaining([
            expect.objectContaining({
              firstName: expect.objectContaining({ $regex: 'John' }),
            }),
            expect.objectContaining({
              lastName: expect.objectContaining({ $regex: 'John' }),
            }),
          ]),
        }),
      );
      expect(res.data.length).toBe(1);
    });

    it('respects custom pagination', async () => {
      const employees = [
        {
          _id: '1',
          toJSON: jest.fn().mockReturnValue({ _id: '1' }),
        },
      ];

      mockEmployeeModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(employees),
        }),
      });

      mockEmployeeModel.countDocuments = jest.fn().mockResolvedValue(50);

      const res = await service.findAll({ page: '2', limit: '20' });

      expect(mockEmployeeModel.find().skip).toHaveBeenCalledWith(20);
      expect(mockEmployeeModel.find().skip().limit).toHaveBeenCalledWith(20);
      expect(res.meta.page).toBe(2);
      expect(res.meta.limit).toBe(20);
      expect(res.meta.totalPages).toBe(3);
    });
  });

  describe('findOne', () => {
    it('returns an employee by id', async () => {
      const employee = { _id: '1', firstName: 'John' };

      mockEmployeeModel.findById = jest.fn().mockResolvedValue(employee);

      const res = await service.findOne('1');

      expect(mockEmployeeModel.findById).toHaveBeenCalledWith('1');
      expect(res).toEqual(employee);
    });

    it('throws NotFoundException when employee not found', async () => {
      mockEmployeeModel.findById = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        'Employee not found',
      );
    });
  });

  describe('update', () => {
    it('updates employee without tags', async () => {
      const updated = { _id: '1', firstName: 'Jane' };

      mockEmployeeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(updated),
      });

      const res = await service.update('1', { firstName: 'Jane' });

      expect(mockEmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { firstName: 'Jane' },
        { new: true },
      );
      expect(res).toEqual(updated);
    });

    it('updates employee with valid positive tags', async () => {
      const updated = { _id: '1', positiveTagIds: ['tag1'] };

      mockTagModel.find = jest
        .fn()
        .mockResolvedValue([{ id: 'tag1', type: TagType.POSITIVE }]);

      mockEmployeeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(updated),
      });

      const res = await service.update('1', { positiveTagIds: ['tag1'] });

      expect(mockEmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { positiveTagIds: ['tag1'] },
        { new: true },
      );
      expect(res).toEqual(updated);
    });

    it('throws BadRequestException when invalid positive tags provided', async () => {
      mockTagModel.find = jest
        .fn()
        .mockResolvedValue([{ id: 'tag1', type: TagType.POSITIVE }]);

      await expect(
        service.update('1', { positiveTagIds: ['invalid'] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when invalid negative tags provided', async () => {
      mockTagModel.find = jest.fn().mockImplementation(async (filter) => {
        if (filter.type === TagType.NEGATIVE) {
          return [{ id: '1', type: TagType.NEGATIVE }];
        }
        return [];
      });

      await expect(
        service.update('1', { negativeTagIds: [999] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when employee not found', async () => {
      mockEmployeeModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('nonexistent', { firstName: 'Jane' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update('nonexistent', { firstName: 'Jane' }),
      ).rejects.toThrow('Employee not found');
    });
  });

  describe('remove', () => {
    it('removes an employee by id', async () => {
      const employee = { _id: '1', firstName: 'John' };

      mockEmployeeModel.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue(employee);

      const res = await service.remove('1');

      expect(mockEmployeeModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res).toBeUndefined();
    });

    it('throws NotFoundException when employee not found', async () => {
      mockEmployeeModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove('nonexistent')).rejects.toThrow(
        'Employee not found',
      );
    });
  });
});
