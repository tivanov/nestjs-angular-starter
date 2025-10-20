export class NumberUtils {
  public static round(num: number, fractionDigits = 2): number {
    return Number(num.toFixed(fractionDigits));
  }

  public static roundAda(num: number): number {
    if (!num) {
      return num;
    }
    if (num < 1) {
      if (num < 0.000001) {
        return Number(num.toFixed(12));
      }
      return Number(num.toFixed(6));
    }
    return Number(num.toFixed(2));
  }
}
