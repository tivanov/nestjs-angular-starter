import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CryptographyHelpersService } from './cryptography-helpers.service';
import { createMockConfigService } from '../../../test/support/mocks/config.mock';

describe('CryptographyHelpersService', () => {
  let service: CryptographyHelpersService;
  const mockConfig = createMockConfigService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptographyHelpersService,
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get(CryptographyHelpersService);
  });

  describe('encrypt / decrypt', () => {
    it('round-trips plaintext', () => {
      const inputPlaintext = 'hello world';

      const encrypted = service.encrypt(inputPlaintext);
      const actual = service.decrypt(encrypted);

      expect(actual).toBe(inputPlaintext);
    });

    it('round-trips empty string', () => {
      const encrypted = service.encrypt('');
      expect(service.decrypt(encrypted)).toBe('');
    });

    it('produces different ciphertext for the same plaintext', () => {
      const inputPlaintext = 'same input';

      const encrypted1 = service.encrypt(inputPlaintext);
      const encrypted2 = service.encrypt(inputPlaintext);

      expect(encrypted1).not.toBe(encrypted2);
      expect(service.decrypt(encrypted1)).toBe(inputPlaintext);
      expect(service.decrypt(encrypted2)).toBe(inputPlaintext);
    });

    it('throws when decrypting invalid ciphertext', () => {
      expect(() => service.decrypt('not-valid-base64url!!!')).toThrow();
    });
  });

  describe('signHmacSha256 / verifyHmacSha256', () => {
    it('signHmacSha256 returns consistent output for the same input', () => {
      const inputPayload = 'payload-to-sign';
      const inputKey = 'secret-key';

      const hash1 = service.signHmacSha256(inputPayload, inputKey);
      const hash2 = service.signHmacSha256(inputPayload, inputKey);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });

    it('verifyHmacSha256 rejects an invalid hash', () => {
      const actual = service.verifyHmacSha256(
        'payload',
        'wrong-hash',
        'secret-key',
      );

      expect(actual).toBe(false);
    });
  });

  describe('verifyOauthState', () => {
    it('returns false for empty or undefined state', () => {
      expect(service.verifyOauthState('')).toBe(false);
      expect(service.verifyOauthState('undefined')).toBe(false);
    });

    it('returns false for malformed state', () => {
      expect(service.verifyOauthState('not-valid-state')).toBe(false);
    });
  });
});
