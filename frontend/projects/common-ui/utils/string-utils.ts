import { decode } from 'cbor2';

export class StringUtils {
  static randomString(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;

    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    return result;
  }

  static toHex(str: string) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }

  static toTitleCase(str: string | null) {
    return (
      str
        ?.toLowerCase()
        .split(' ')
        .map((word: string) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ') ?? ''
    );
  }

  static cborToUint8Array(str: string) {
    if (!str) {
      return new Uint8Array();
    }

    return new Uint8Array(
      str.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
    );
  }

  static uint8ArrayToHex(uint8Array: Uint8Array): string {
    return Array.from(uint8Array, (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join('');
  }

  static cborToHex(str: string): string {
    if (!str) {
      return '';
    }
    const decoded = decode(str);
    return (decoded as any)?.toString();
  }

  static fromHex(hex: string): string {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      const code = parseInt(hex.slice(i, i + 2), 16);
      if (!isNaN(code)) {
        str += String.fromCharCode(code);
      }
    }
    return str;
  }

  static encodeUrl(url: string): string {
    return encodeURIComponent(url);
  }

  static kebabToTitleCase(value: string, joinChar: string = ' '): string {
    if (!value) {
      return '';
    }

    return value
      .replaceAll('-', ' ')
      .split(' ')
      .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
      .join(joinChar || ' ');
  }

  static camelToTitleCase(value: string): string {
    return value
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }
}
