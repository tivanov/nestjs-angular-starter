import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as fs from 'fs/promises';
import { createMockConfigService } from '../../../test/support/mocks/config.mock';
import { SharedModule } from '../shared.module';

jest.mock('fs/promises', () => ({ mkdir: jest.fn() }));

describe('Uploads directory initialization', () => {
  const originalWorkerNumber = process.env.WORKER_NUMBER;
  const mockMkdir = jest.mocked(fs.mkdir);

  beforeEach(() => {
    process.env.WORKER_NUMBER = '0';
    mockMkdir.mockReset();
    mockMkdir.mockResolvedValue(undefined);
  });

  afterEach(() => {
    if (originalWorkerNumber === undefined) {
      delete process.env.WORKER_NUMBER;
    } else {
      process.env.WORKER_NUMBER = originalWorkerNumber;
    }
    jest.restoreAllMocks();
  });

  async function initializeModule(uploadsDir: string = '/tmp/test-uploads') {
    const module = await Test.createTestingModule({
      imports: [
        SharedModule,
        {
          module: ConfigModule,
          global: true,
          providers: [
            {
              provide: ConfigService,
              useValue: createMockConfigService({ app: { uploadsDir } }),
            },
          ],
          exports: [ConfigService],
        },
      ],
    }).compile();
    await module.init();
    await module.close();
  }

  it('creates the configured directory during module initialization', async () => {
    await initializeModule();
    expect(mockMkdir).toHaveBeenCalledWith('/tmp/test-uploads', {
      recursive: true,
    });
  });

  it.each(['1', undefined])(
    'skips creation for worker %s',
    async (workerNumber) => {
      if (workerNumber === undefined) delete process.env.WORKER_NUMBER;
      else process.env.WORKER_NUMBER = workerNumber;
      await initializeModule();
      expect(mockMkdir).not.toHaveBeenCalled();
    },
  );

  it('skips creation when no path is configured', async () => {
    await initializeModule('');
    expect(mockMkdir).not.toHaveBeenCalled();
  });

  it('logs failures and continues initialization', async () => {
    const inputError = new Error('Permission denied');
    mockMkdir.mockRejectedValue(inputError);
    const mockLog = jest
      .spyOn(Logger, 'error')
      .mockImplementation(() => undefined);
    await expect(initializeModule()).resolves.toBeUndefined();
    expect(mockLog).toHaveBeenCalledWith(inputError);
  });
});
