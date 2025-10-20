import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAuthConfig } from 'config/model';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  createSign,
  createVerify,
  randomBytes,
} from 'crypto';

@Injectable()
export class CryptographyHelpersService {
  private readonly logger = new Logger(CryptographyHelpersService.name);
  private readonly authConfig: IAuthConfig;

  constructor(config: ConfigService) {
    this.authConfig = config.get<IAuthConfig>('auth');
  }

  encrypt(plaintext: string) {
    const iv = randomBytes(16);
    const key = createHash('sha256')
      .update(this.authConfig.encryptionKey)
      .digest('base64')
      .substring(0, 32);

    const cipher = createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([
      iv,
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    return encrypted.toString('base64url');
  }

  decrypt(ivCiphertextB64: string) {
    const ivCiphertext = Buffer.from(ivCiphertextB64, 'base64url');
    const iv = ivCiphertext.subarray(0, 16);
    const key = createHash('sha256')
      .update(this.authConfig.encryptionKey)
      .digest('base64')
      .substring(0, 32);
    const ciphertext = ivCiphertext.subarray(16);
    const cipher = createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([
      cipher.update(ciphertext),
      cipher.final(),
    ]);
    return decrypted.toString('utf-8');
  }

  generateOauthState(): string {
    const now = new Date().getTime();
    const statePlain = {
      r: now,
      s: this.signForState(now.toString()),
    };
    const base64 = Buffer.from(JSON.stringify(statePlain)).toString('base64');
    return encodeURIComponent(base64);
  }

  verifyOauthState(state: string): boolean {
    try {
      if (!state || state === 'undefined') {
        return false;
      }
      const uriDecoded = decodeURIComponent(state);
      const decoded = Buffer.from(uriDecoded, 'base64').toString('utf8');
      const statePlain = JSON.parse(decoded);
      if (!statePlain.r || !statePlain.s) {
        return false;
      }
      if (!this.verifyStateSignature(statePlain.r?.toString(), statePlain.s)) {
        return false;
      }

      const now = new Date().getTime();
      if (now - statePlain.random > 1000 * 60 * 5) {
        return false;
      }
      return true;
    } catch (e) {
      this.logger.error(`Error verifying state ${state}`, e);
      return false;
    }
  }

  public signHmacSha256(
    payload: string,
    key: string,
    details: {
      outputFormat?: 'hex' | 'base64' | 'base64url';
    } = {
      outputFormat: 'hex',
    },
  ): string {
    return createHmac('sha256', key)
      .update(payload)
      .digest(details?.outputFormat || 'hex');
  }

  public verifyHmacSha256(payload: string, hash: string, key: string): boolean {
    const buffer = Buffer.from(payload, 'utf-8');
    const secretKey = createHash('sha256').update(key).digest();
    const checkHash = createHmac('sha256', secretKey)
      .update(buffer)
      .digest('hex');
    return checkHash === hash;
  }

  private signForState(data: string): string {
    const sign = createSign('RSA-SHA1');
    sign.update(data);
    return sign.sign(this.authConfig.statePrivateKey, 'base64');
  }

  private verifyStateSignature(data: string, signature: string): boolean {
    const verify = createVerify('RSA-SHA1');
    verify.update(data);
    return verify.verify(this.authConfig.statePublicKey, signature, 'base64');
  }
}
