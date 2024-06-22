import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeHtml'
})
export class RemoveHtmlPipe implements PipeTransform {

  transform(value: string): unknown {
    return value.replace(/<[^>]*>?/gm, '');
  }

}
