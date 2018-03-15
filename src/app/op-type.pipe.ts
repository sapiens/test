import { Pipe, PipeTransform } from '@angular/core';
import { OperatorType } from './model';

@Pipe({
  name: 'opType'
})
export class OpTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return OperatorType[value];
  }

}
