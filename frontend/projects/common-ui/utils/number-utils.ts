export class NumberUtils {
  public static round(num: number, fractionDigits: number = 2): number {
    return Number(num.toFixed(fractionDigits));
  }
}
