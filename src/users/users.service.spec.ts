import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../database/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { UserNotFoundException } from './errors/user-not-found';
import { ConflictException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const user = {
  id: "019adfe1-bdfc-7ea5-b6ca-0467efaf873e",
  username: 'carlosdealmeida',
  email: 'email@example.com',
  password: '12345678',
  role: Role.user,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return list of users', async () => {
      prisma.user.findMany.mockResolvedValue([user]);

      const result = await service.getAllUsers();

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe(user.email);
      expect(result[0]).not.toHaveProperty('password');
    });
  });

  describe('getUserById', () => {
    it('should return a user if found (without password)', async () => {
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.getUserById(user.id); 

      expect(result).toBeDefined();
      expect(result.id).toBe(user.id);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UserNotFoundException if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById('uuid-non-existent'))
        .rejects
        .toThrow(UserNotFoundException);
    });
  });

  describe('createUser', () => {
    const createUserDto = {
      username: 'NewUser',
      email: 'new@email.com',
      password: '123',
      role: Role.user 
    };

    it('should successfully create a user and hash the password', async () => {
      prisma.user.create.mockResolvedValue({
        ...user,
        ...createUserDto,
        password: 'hashed_by_bcrypt',
      });

      const result = await service.createUser(createUserDto); 

      expect(result).toHaveProperty('id');
      expect(result).not.toHaveProperty('password');
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists (P2002)', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Error', {
        code: 'P2002',
        clientVersion: '1',
      });
      prisma.user.create.mockRejectedValue(error);

      await expect(service.createUser(createUserDto))
        .rejects
        .toThrow(ConflictException);
    });
  });

  describe('updateUser', () => {
    const updateDto = { username: 'UpdatedName' };

    it('should successfully update the user', async () => {
      prisma.user.update.mockResolvedValue({
        ...user,
        username: 'UpdatedName',
      });

      const result = await service.updateUser(user.id, updateDto);

      expect(result.username).toBe('UpdatedName');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UserNotFoundException if user does not exist (P2025)', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Error', {
        code: 'P2025',
        clientVersion: '1',
      });
      prisma.user.update.mockRejectedValue(error);

      await expect(service.updateUser('uuid-non-existent', updateDto))
        .rejects
        .toThrow(UserNotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete the user', async () => {
      prisma.user.delete.mockResolvedValue(user);

      await expect(service.deleteUser(user.id)).resolves.not.toThrow();

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: user.id } });
    });

    it('should throw UserNotFoundException if user does not exist when deleting', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Error', {
        code: 'P2025',
        clientVersion: '1',
      });
      prisma.user.delete.mockRejectedValue(error);

      await expect(service.deleteUser('uuid-non-existent'))
        .rejects
        .toThrow(UserNotFoundException);
    });
  });
});