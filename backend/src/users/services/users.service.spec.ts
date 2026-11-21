import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorCode } from '@app/contracts';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import { Types } from 'mongoose';
import { createMockConfigService } from '../../../test/support/mocks/config.mock.js';
import { IdentitiesService } from '../../auth/services/identities.service.js';
import { User } from '../model/user.model.js';
import { LoginRecordsService } from './login-records.service.js';
import { UsersService } from './users.service.js';

describe('UsersService login', () => {
  let service: UsersService;
  let passwordHash: string;

  const userId = new Types.ObjectId();
  const inputUser = {
    _id: userId,
    userName: 'ada',
    loginAttempts: 0,
    blockExpires: new Date(0),
  } as User;
  const inputRequest = {} as Request;

  const mockFindLean = vi.fn();
  const mockUserModel = {
    find: vi.fn(() => ({ lean: mockFindLean })),
    findByIdAndUpdate: vi.fn(),
  };
  const mockIdentities = {
    getValid: vi.fn(),
  };
  const mockLoginRecords = {
    addInBackground: vi.fn(),
  };

  beforeAll(async () => {
    passwordHash = await bcrypt.hash('correct-password', 10);
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    mockFindLean.mockResolvedValue([inputUser]);
    mockIdentities.getValid.mockResolvedValue({ secret: passwordHash });
    mockUserModel.findByIdAndUpdate.mockResolvedValue({
      ...inputUser,
      loginAttempts: 1,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: LoginRecordsService, useValue: mockLoginRecords },
        { provide: IdentitiesService, useValue: mockIdentities },
        { provide: ConfigService, useValue: createMockConfigService() },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('increments login attempts when the password is wrong', async () => {
    await expect(
      service.login(inputUser.userName, 'wrong-password', inputRequest),
    ).rejects.toMatchObject({
      response: { code: ErrorCode.INVALID_USERNAME_PASSWORD },
    });

    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      userId,
      { $inc: { loginAttempts: 1 } },
      { new: true, lean: true },
    );
    expect(mockLoginRecords.addInBackground).not.toHaveBeenCalled();
  });

  it('blocks the user when failed attempts reach the threshold', async () => {
    mockUserModel.findByIdAndUpdate
      .mockResolvedValueOnce({ ...inputUser, loginAttempts: 10 })
      .mockResolvedValueOnce({ ...inputUser, loginAttempts: 0 });

    await expect(
      service.login(inputUser.userName, 'wrong-password', inputRequest),
    ).rejects.toMatchObject({
      response: { code: ErrorCode.INVALID_USERNAME_PASSWORD },
    });

    expect(mockUserModel.findByIdAndUpdate).toHaveBeenNthCalledWith(
      1,
      userId,
      { $inc: { loginAttempts: 1 } },
      { new: true, lean: true },
    );
    expect(mockUserModel.findByIdAndUpdate).toHaveBeenNthCalledWith(
      2,
      userId,
      expect.objectContaining({
        blockExpires: expect.any(Date),
        loginAttempts: 0,
      }),
      { new: true, lean: true },
    );
  });

  it.each([
    { foundUsers: [] as User[], label: 'an unknown username' },
    {
      foundUsers: [inputUser, inputUser],
      label: 'more than one matching user',
    },
  ])(
    'returns INVALID_USERNAME_PASSWORD for $label without counting attempts',
    async ({ foundUsers }) => {
      mockFindLean.mockResolvedValue(foundUsers);

      await expect(
        service.login('missing', 'wrong-password', inputRequest),
      ).rejects.toMatchObject({
        response: { code: ErrorCode.INVALID_USERNAME_PASSWORD },
      });

      expect(mockUserModel.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(mockIdentities.getValid).not.toHaveBeenCalled();
    },
  );

  it('resets login attempts after a successful login', async () => {
    const actualUser = await service.login(
      inputUser.userName,
      'correct-password',
      inputRequest,
    );

    expect(actualUser).toBe(inputUser);
    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, {
      loginAttempts: 0,
    });
    expect(mockLoginRecords.addInBackground).toHaveBeenCalledWith(
      inputUser,
      inputRequest,
    );
    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      userId.toHexString(),
      { lastLogin: expect.any(Date) },
    );
  });

  it('rejects a blocked user without incrementing attempts', async () => {
    mockFindLean.mockResolvedValue([
      { ...inputUser, blockExpires: new Date(Date.now() + 60_000) },
    ]);

    await expect(
      service.login(inputUser.userName, 'correct-password', inputRequest),
    ).rejects.toMatchObject({
      response: { code: ErrorCode.USER_IS_BLOCKED },
    });

    expect(mockUserModel.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(mockIdentities.getValid).not.toHaveBeenCalled();
  });
});
