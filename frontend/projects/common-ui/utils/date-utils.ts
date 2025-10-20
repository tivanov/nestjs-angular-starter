export class DateUtils {
  static roundDownToResolution(date: Date, resolution: number) {
    return new Date(
      Math.floor(date.getTime() / resolution) * resolution,
    ).getTime();
  }

  static roundUpToResolution(date: Date, resolution: number) {
    return new Date(
      Math.ceil(date.getTime() / resolution) * resolution,
    ).getTime();
  }
}
