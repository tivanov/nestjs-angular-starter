import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyjson',
  pure: true,
  standalone: true,
})
export class PrettyJsonPipe implements PipeTransform {
  transform(
    value: unknown,
    showNumberLine = false,
    padding = 4,
  ): string {
    try {
      /**
       * check and try to parse value if it's not an object
       * if it fails to parse which means it is an invalid JSON
       */
      const parsed = typeof value === 'object' ? value : this.parseJson(value);

      return this.applyColors(
        this.toJsonText(parsed),
        showNumberLine,
        padding,
      );
    } catch {
      return this.applyColors(
        { error: 'Invalid JSON' },
        showNumberLine,
        padding,
      );
    }
  }

  applyColors(
    value: unknown,
    showNumberLine = false,
    padding = 4,
  ): string {
    // line number start from 1
    let line = 1;
    let json = this.stringify(value);

    /**
     * Converts special charaters like &, <, > to equivalent HTML code of it
     */
    json = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    /* taken from https://stackoverflow.com/a/7220510 */

    /**
     * wraps every datatype, key for e.g
     * numbers from json object to something like
     * <span class="number" > 234 </span>
     * this is why needed custom themeClass which we created in _global.css
     * @return final bunch of span tags after all conversion
     */
    json = json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        // class to be applied inside pre tag
        let themeClass = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            themeClass = 'key';
          } else {
            themeClass = 'string';
          }
        } else if (/true|false/.test(match)) {
          themeClass = 'boolean';
        } else if (/null/.test(match)) {
          themeClass = 'null';
        }

        return '<span class="' + themeClass + '">' + match + '</span>';
      },
    );

    /**
     * Regex for the start of the line, insert a number-line themeClass tag before each line
     */
    return showNumberLine
      ? json.replace(
          /^/gm,
          () =>
            `<span class="number-line pl-3 select-none" >${String(line++).padEnd(padding)}</span>`,
        )
      : json;
  }

  private parseJson(value: unknown): unknown {
    const text = typeof value === 'string' ? value : String(value);

    return JSON.parse(text) as unknown;
  }

  private stringify(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    return this.toJsonText(value);
  }

  private toJsonText(value: unknown): string {
    const text = JSON.stringify(value, undefined, 3);
    if (typeof text !== 'string') {
      throw new Error('Invalid JSON');
    }

    return text;
  }
}
