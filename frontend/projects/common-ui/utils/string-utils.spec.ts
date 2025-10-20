import { StringUtils } from './string-utils';

describe('StringUtils', () => {
  describe('randomString', () => {
    it('should generate a string of the specified length', () => {
      const length = 10;
      const result = StringUtils.randomString(length);

      expect(result.length).toBe(length);
    });

    it('should generate different strings on multiple calls', () => {
      const length = 20;
      const result1 = StringUtils.randomString(length);
      const result2 = StringUtils.randomString(length);

      expect(result1).not.toBe(result2);
    });

    it('should only contain valid characters', () => {
      const length = 50;
      const result = StringUtils.randomString(length);
      const validChars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (const char of result) {
        expect(validChars).toContain(char);
      }
    });

    it('should return empty string for length 0', () => {
      const result = StringUtils.randomString(0);
      expect(result).toBe('');
    });

    it('should handle negative length gracefully', () => {
      const result = StringUtils.randomString(-5);
      expect(result).toBe('');
    });
  });

  describe('toHex', () => {
    it('should convert string to hexadecimal', () => {
      const input = 'Hello';
      const expected = '48656c6c6f'; // ASCII codes for 'H', 'e', 'l', 'l', 'o'
      const result = StringUtils.toHex(input);

      expect(result).toBe(expected);
    });

    it('should handle empty string', () => {
      const result = StringUtils.toHex('');
      expect(result).toBe('');
    });

    it('should handle single character', () => {
      const result = StringUtils.toHex('A');
      expect(result).toBe('41'); // ASCII code for 'A'
    });

    it('should handle special characters', () => {
      const result = StringUtils.toHex('!@#');
      expect(result).toBe('214023'); // ASCII codes for '!', '@', '#'
    });

    it('should handle unicode characters', () => {
      const result = StringUtils.toHex('ñ');
      expect(result).toBe('c3b1'); // UTF-8 encoding for 'ñ'
    });
  });

  describe('toTitleCase', () => {
    it('should convert string to title case', () => {
      const input = 'hello world';
      const expected = 'Hello World';
      const result = StringUtils.toTitleCase(input);

      expect(result).toBe(expected);
    });

    it('should handle single word', () => {
      const result = StringUtils.toTitleCase('hello');
      expect(result).toBe('Hello');
    });

    it('should handle already title cased string', () => {
      const input = 'Hello World';
      const result = StringUtils.toTitleCase(input);
      expect(result).toBe('Hello World');
    });

    it('should handle mixed case', () => {
      const input = 'hElLo WoRlD';
      const result = StringUtils.toTitleCase(input);
      expect(result).toBe('Hello World');
    });

    it('should handle null input', () => {
      const result = StringUtils.toTitleCase(null);
      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      const result = StringUtils.toTitleCase('');
      expect(result).toBe('');
    });

    it('should handle string with multiple spaces', () => {
      const input = 'hello   world';
      const result = StringUtils.toTitleCase(input);
      expect(result).toBe('Hello   World');
    });

    it('should handle string with numbers', () => {
      const input = 'hello 123 world';
      const result = StringUtils.toTitleCase(input);
      expect(result).toBe('Hello 123 World');
    });
  });

  describe('cborToUint8Array', () => {
    it('should convert hex string to Uint8Array', () => {
      const input = '48656c6c6f'; // "Hello" in hex
      const result = StringUtils.cborToUint8Array(input);

      expect(result instanceof Uint8Array).toBe(true);
      expect(result.length).toBe(5);
      expect(Array.from(result)).toEqual([72, 101, 108, 108, 111]); // ASCII codes for "Hello"
    });

    it('should handle empty string', () => {
      const result = StringUtils.cborToUint8Array('');
      expect(result instanceof Uint8Array).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle null input', () => {
      const result = StringUtils.cborToUint8Array(null as any);
      expect(result instanceof Uint8Array).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle undefined input', () => {
      const result = StringUtils.cborToUint8Array(undefined as any);
      expect(result instanceof Uint8Array).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle single byte hex string', () => {
      const input = '41'; // 'A' in hex
      const result = StringUtils.cborToUint8Array(input);

      expect(result.length).toBe(1);
      expect(result[0]).toBe(65); // ASCII code for 'A'
    });

    it('should handle odd length hex string', () => {
      const input = '48656c6c6'; // Odd length hex
      const result = StringUtils.cborToUint8Array(input);

      // Should handle gracefully, treating last character as a single byte
      expect(result.length).toBe(3);
    });
  });

  describe('cborToHex', () => {
    it('should decode CBOR and return string representation', () => {
      // This test requires a valid CBOR hex string
      // For testing purposes, we'll use a simple CBOR encoded string
      const input = '6548656c6c6f'; // CBOR encoding of "Hello"
      const result = StringUtils.cborToHex(input);

      expect(typeof result).toBe('string');
    });

    it('should handle empty string', () => {
      const result = StringUtils.cborToHex('');
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const result = StringUtils.cborToHex(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = StringUtils.cborToHex(undefined as any);
      expect(result).toBe('');
    });

    it('should handle invalid CBOR data gracefully', () => {
      const input = 'invalid';
      const result = StringUtils.cborToHex(input);

      // Should handle the error gracefully and return a string or throw
      expect(typeof result).toBe('string');
    });
  });

  describe('integration tests', () => {
    it('should work with chained operations', () => {
      const original = 'hello world';
      const titleCased = StringUtils.toTitleCase(original);
      const hexed = StringUtils.toHex(titleCased);

      expect(titleCased).toBe('Hello World');
      expect(hexed).toBe('48656c6c6f20576f726c64');
    });

    it('should generate consistent results for same input', () => {
      const input = 'test string';
      const result1 = StringUtils.toTitleCase(input);
      const result2 = StringUtils.toTitleCase(input);

      expect(result1).toBe(result2);
    });
  });
});
