import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { OfficeLocation } from './consts/office-location.const';

describe('EmployeesController (unit)', () => {
  let controller: EmployeesController;
  let mockService: Partial<Record<keyof EmployeesService, jest.Mock>>;

  beforeEach(async () => {
    mockService = {
      create: jest.fn().mockResolvedValue({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
      }),
      findAll: jest.fn().mockResolvedValue({
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      }),
      findOne: jest.fn().mockResolvedValue({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
      }),
      update: jest.fn().mockResolvedValue({
        id: '1',
        firstName: 'Jane',
        lastName: 'Doe',
      }),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [{ provide: EmployeesService, useValue: mockService }],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
  });

  describe('create', () => {
    it('creates an employee and returns result', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        office: 'Riga' as any,
        dateOfBirth: '10-12-2020',
        phoneNumber: '+1234567890',
        positiveTagIds: [],
        negativeTagIds: [],
      };

      const res = await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(res).toEqual({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
      });
    });
  });

  describe('findAll', () => {
    it('findAll without query parameters calls service.findAll', async () => {
      const res = await controller.findAll({});

      expect(mockService.findAll).toHaveBeenCalledWith({});
      expect(res.data).toEqual([]);
      expect(res.meta.page).toBe(1);
      expect(res.meta.limit).toBe(10);
    });

    it('findAll with office filter forwards the filter', async () => {
      mockService.findAll = jest.fn().mockResolvedValue({
        data: [{ id: '1', office: 'NYC' }],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      const res = await controller.findAll({ office: 'NYC' as OfficeLocation });

      expect(mockService.findAll).toHaveBeenCalledWith({ office: 'NYC' });
      expect(res.data.length).toBe(1);
      expect(res.data[0].office).toBe('NYC');
    });

    it('findAll with search forwards the search term', async () => {
      mockService.findAll = jest.fn().mockResolvedValue({
        data: [{ id: '1', firstName: 'John' }],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      const res = await controller.findAll({ search: 'John' });

      expect(mockService.findAll).toHaveBeenCalledWith({ search: 'John' });
      expect(res.data[0].firstName).toBe('John');
    });

    it('findAll with pagination forwards page and limit', async () => {
      mockService.findAll = jest.fn().mockResolvedValue({
        data: [{ id: '1' }],
        meta: { total: 50, page: 2, limit: 20, totalPages: 3 },
      });

      const res = await controller.findAll({ page: '2', limit: '20' });

      expect(mockService.findAll).toHaveBeenCalledWith({ page: '2', limit: '20' });
      expect(res.meta.page).toBe(2);
      expect(res.meta.limit).toBe(20);
      expect(res.meta.totalPages).toBe(3);
    });

    it('findAll with multiple filters forwards all filters', async () => {
      mockService.findAll = jest.fn().mockResolvedValue({
        data: [{ id: '1', firstName: 'John', office: 'NYC' }],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      const res = await controller.findAll({
        office: 'NYC' as OfficeLocation,
        search: 'John',
        page: '1',
        limit: '10',
      });

      expect(mockService.findAll).toHaveBeenCalledWith({
        office: 'NYC',
        search: 'John',
        page: '1',
        limit: '10',
      });
      expect(res.data[0].firstName).toBe('John');
    });
  });

  describe('findOne', () => {
    it('findOne forwards id to service and returns employee', async () => {
      const res = await controller.findOne('1');

      expect(mockService.findOne).toHaveBeenCalledWith('1');
      expect(res).toEqual({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('findOne works with string id', async () => {
      mockService.findOne = jest.fn().mockResolvedValue({
        id: 'abc123',
        firstName: 'Jane',
        lastName: 'Smith',
      });

      const res = await controller.findOne('abc123');

      expect(mockService.findOne).toHaveBeenCalledWith('abc123');
      expect(res.id).toBe('abc123');
    });
  });

  describe('update', () => {
    it('update forwards id and dto to service.update', async () => {
      const dto = { firstName: 'Jane' };

      const res = await controller.update('1', dto);

      expect(mockService.update).toHaveBeenCalledWith('1', dto);
      expect(res).toEqual({
        id: '1',
        firstName: 'Jane',
        lastName: 'Doe',
      });
    });

    it('update with partial dto', async () => {
      const dto = { lastName: 'Smith' };

      await controller.update('1', dto);

      expect(mockService.update).toHaveBeenCalledWith('1', {
        lastName: 'Smith',
      });
    });

    it('update with tags', async () => {
      const dto = { positiveTagIds: ['tag1', 'tag2'] };

      await controller.update('1', dto);

      expect(mockService.update).toHaveBeenCalledWith('1', {
        positiveTagIds: ['tag1', 'tag2'],
      });
    });

    it('update with negative tags', async () => {
      const dto = { negativeTagIds: [1, 2, 3] };

      await controller.update('1', dto);

      expect(mockService.update).toHaveBeenCalledWith('1', {
        negativeTagIds: [1, 2, 3],
      });
    });
  });

  describe('remove', () => {
    it('remove forwards id to service.remove', async () => {
      const res = await controller.remove('1');

      expect(mockService.remove).toHaveBeenCalledWith('1');
      expect(res).toBeUndefined();
    });

    it('remove works with string id', async () => {
      mockService.remove = jest.fn().mockResolvedValue(undefined);

      await controller.remove('abc123');

      expect(mockService.remove).toHaveBeenCalledWith('abc123');
    });
  });
});
