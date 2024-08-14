import { Pipe, PipeTransform } from '@angular/core'; 

@Pipe({ 
  name: 'shortNumber',
  standalone: true,
}) 
export class ShortNumberPipe implements PipeTransform { 
  transform(value: any, args?: any): any { 
    if (value === null) return null;
    if (value === 0) return "0";
    var fractionSize = 1;
    var abs = Math.abs(value);
    var rounder = Math.pow(10, fractionSize);
    var isNegative = value < 0;
    var key = '';
    var powers = [{ key: "Q", value: Math.pow(10, 15) }, { key: "T", value: Math.pow(10, 12) }, { key: "B", value: Math.pow(10, 9) }, { key: "M", value: Math.pow(10, 6) }, { key: "k", value: 1000 }];    for (var i = 0; i < powers.length; i++) {
      var reduced = abs / powers[i].value;
      reduced = Math.round(reduced * rounder) / rounder;
      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }
    return (isNegative ? '-' : '') + abs + key;
  } 
}