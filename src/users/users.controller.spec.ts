import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsersService = {
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: typeof mockUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const result = [{ id: 'uuid', email: 'test@example.com' }];
      service.getAllUsers.mockResolvedValue(result);

      const response = await controller.getUsers();

      expect(response).toEqual(result);
      expect(service.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should return a single user', async () => {
      const result = { id: 'uuid', email: 'test@example.com' };
      service.getUserById.mockResolvedValue(result);

      const response = await controller.getUser('uuid');

      expect(response).toEqual(result);
      expect(service.getUserById).toHaveBeenCalledWith('uuid');
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const dto = {
        username: 'Test',
        email: 'test@example.com',
        password: '123',
        role: 'user' as any
      };
      const result = { id: 'uuid', ...dto };

      service.createUser.mockResolvedValue(result);

      const response = await controller.createUser(dto);

      expect(response).toEqual(result);
      expect(service.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const dto = { username: 'Updated' };
      const result = { id: 'uuid', username: 'Updated', email: 'test@example.com' };

      service.updateUser.mockResolvedValue(result);

      const response = await controller.updateUser('uuid', dto);

      expect(response).toEqual(result);
      expect(service.updateUser).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      service.deleteUser.mockResolvedValue(undefined);

      await controller.deleteUser('uuid');

      expect(service.deleteUser).toHaveBeenCalledWith('uuid');
    });
  });
});