import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformTitleCase'
})
export class TransformTitleCasePipe implements PipeTransform {

  transform(value: string): string {
    var words = value.split('-');

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(' ');

  }

}
