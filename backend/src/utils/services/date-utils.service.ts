import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtilsService {
  constructor() {}

  public getStartOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  public getEndOfDay(date: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999,
    );
  }

  public dateRangeOverlaps(
    a_start: Date,
    a_end: Date,
    b_start: Date,
    b_end: Date,
  ) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    return false;
  }
}
