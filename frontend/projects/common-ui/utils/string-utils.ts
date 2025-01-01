export class StringUtils {
  static randomString(length) {
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

  static toTitleCase(str: string) {
    return (
      str
        ?.toLowerCase()
        .split(' ')
        .map((word: any) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ') || ''
    );
  }
}
