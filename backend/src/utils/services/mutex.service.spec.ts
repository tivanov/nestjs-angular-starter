import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MutexService } from './mutex.service.js';
import { Mutex } from '../model/mutex.model.js';
import { AppBadRequestException } from 'src/shared/exceptions/app-bad-request-exception.js';
import { ErrorCode } from '@app/contracts';

describe('MutexService', () => {
  let service: MutexService;

  const mockFindOneLean = vi.fn<(...args: any[]) => any>();

  const mockMutexModel = {
    findOneAndUpdate: vi.fn<(...args: any[]) => any>(),
    findOne: vi.fn(() => ({ lean: mockFindOneLean })),
    create: vi.fn<(...args: any[]) => any>(),
    updateOne: vi.fn<(...args: any[]) => any>(),
    deleteOne: vi.fn<(...args: any[]) => any>(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockFindOneLean.mockReset();
    vi.useFakeTimers();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MutexService,
        {
          provide: getModelToken(Mutex.name),
          useValue: mockMutexModel,
        },
      ],
    }).compile();

    service = module.get(MutexService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs work while holding the lock and releases it afterward', async () => {
    mockMutexModel.findOneAndUpdate.mockResolvedValue(null);
    mockFindOneLean.mockResolvedValue(null);
    mockMutexModel.create.mockResolvedValue({});
    mockMutexModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const work = vi.fn(async () => 'done');

    const actual = await service.execWithMutex('resource-1', work);

    expect(actual).toBe('done');
    expect(work).toHaveBeenCalledTimes(1);
    expect(mockMutexModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceId: 'resource-1',
        lockId: expect.any(String),
      }),
    );
    expect(mockMutexModel.deleteOne).toHaveBeenCalledWith({
      resourceId: 'resource-1',
      lockId: expect.any(String),
    });
  });

  it('acquires an expired lock atomically without deleting first', async () => {
    mockMutexModel.findOneAndUpdate.mockImplementation(
      (_filter, update: { $set: { lockId: string } }) => ({
        resourceId: 'resource-1',
        lockId: update.$set.lockId,
      }),
    );

    await service.execWithMutex('resource-1', async () => undefined);

    expect(mockMutexModel.findOneAndUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceId: 'resource-1',
        $or: expect.any(Array),
      }),
      expect.objectContaining({
        $set: expect.objectContaining({
          lockId: expect.any(String),
          lockExpiresAt: expect.any(Date),
        }),
      }),
      { new: true, lean: true },
    );
    expect(mockMutexModel.create).not.toHaveBeenCalled();
  });

  it('throws MUTEX_LOCKED when another holder owns a valid lock', async () => {
    mockMutexModel.findOneAndUpdate.mockResolvedValue(null);
    mockFindOneLean.mockResolvedValue({
      resourceId: 'resource-1',
      lockId: 'other-lock',
      lockExpiresAt: new Date(Date.now() + 60_000),
    });

    await expect(
      service.execWithMutex('resource-1', async () => undefined),
    ).rejects.toMatchObject({
      response: { code: ErrorCode.MUTEX_LOCKED },
    });

    expect(mockMutexModel.create).not.toHaveBeenCalled();
  });

  it('maps duplicate-key create races to MUTEX_LOCKED', async () => {
    mockMutexModel.findOneAndUpdate.mockResolvedValue(null);
    mockFindOneLean.mockResolvedValue(null);
    mockMutexModel.create.mockRejectedValue({ code: 11000 });

    await expect(
      service.execWithMutex('resource-1', async () => undefined),
    ).rejects.toBeInstanceOf(AppBadRequestException);
  });

  it('renews the lock while work is still running', async () => {
    mockMutexModel.findOneAndUpdate.mockImplementation(
      (_filter, update: { $set: { lockId: string } }) => ({
        resourceId: 'resource-1',
        lockId: update.$set.lockId,
      }),
    );
    mockMutexModel.updateOne.mockResolvedValue({ modifiedCount: 1 });
    mockMutexModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

    let resolveWork!: () => void;
    const work = new Promise<void>((resolve) => {
      resolveWork = resolve;
    });

    const execPromise = service.execWithMutex('resource-1', async () => {
      await work;
    });

    await vi.advanceTimersByTimeAsync(20_000);

    expect(mockMutexModel.updateOne).toHaveBeenCalledWith(
      expect.objectContaining({
        resourceId: 'resource-1',
        lockId: expect.any(String),
      }),
      expect.objectContaining({
        $set: expect.objectContaining({
          lockExpiresAt: expect.any(Date),
        }),
      }),
    );

    resolveWork();
    await execPromise;
  });
});
