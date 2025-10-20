import { Injectable } from '@nestjs/common';

@Injectable()
export class NumberUtilsService {
  constructor() {}

  public round(value: number, decimals: number = 2) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  public clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
}
