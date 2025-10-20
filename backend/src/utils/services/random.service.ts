import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class RandomService {
  public getFloat(min: number, max: number) {
    if (min === max) {
      return min;
    }

    const precision = 1000;
    const range = Math.round((max - min) * precision);
    const n = crypto.randomInt(0, range);
    return parseFloat(
      (min + n / precision).toFixed(precision.toString().length - 1),
    );
  }

  public getInt(min: number, max: number) {
    if (min === max) {
      return min;
    }
    return crypto.randomInt(min, max);
  }

  public chance(percentage: number) {
    if (!percentage || percentage === 0) {
      return false;
    }
    return this.getFloat(0, 100) <= percentage;
  }
}
