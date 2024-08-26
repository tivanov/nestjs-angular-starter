export class Constants {
  public static readonly EndOfTimeStr = '2500-12-31T23:59:59.999Z';
  public static readonly StartOfTimeStr = '1000-01-01T00:00:00.000Z';
  public static readonly EndOfTime = new Date(Constants.EndOfTimeStr);
  public static readonly StartOfTime = new Date(Constants.StartOfTimeStr);
}
