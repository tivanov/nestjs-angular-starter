import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { StringUtils } from '../utils/string-utils';

@Pipe({
  name: 'statusEnum',
  standalone: true,
})
export class StatusEnumPipe implements PipeTransform {
  protected sanitizer: DomSanitizer = inject(DomSanitizer);

  public transform(value: string, joinChar?: string): string {
    if (!value) return '';
    if (value.includes('-')) {
      return StringUtils.kebabToTitleCase(value, joinChar);
    }

    return StringUtils.camelToTitleCase(value);
  }
}
