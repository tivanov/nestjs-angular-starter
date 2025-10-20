import { Injectable } from '@nestjs/common';

@Injectable()
export class StringUtilsService {
  constructor() {}

  public removeEmojis(text: string) {
    return text.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      '',
    );
  }

  public encodeUrl(url: string) {
    return encodeURIComponent(url);
  }

  public toHex(str: string) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }
}
