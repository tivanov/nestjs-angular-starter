import { inject, Pipe, PipeTransform } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { CryptoNetworkEnum } from '@app/contracts';

@Pipe({
  name: 'cryptoNetwork',
  standalone: true,
})
export class CryptoNetworkPipe implements PipeTransform {
  protected sanitizer: DomSanitizer = inject(DomSanitizer);

  public transform(value: CryptoNetworkEnum, joinChar?: string): string {
    if (!value) {
      return '';
    }

    return value
      .replace('-', ' ')
      .split(' ')
      .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
      .join(joinChar || '');
  }
}
