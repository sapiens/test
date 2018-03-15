import { Pipe, PipeTransform } from '@angular/core';
import { OperationEvent, NumericOperationEvent, OperatorType, BlockOperationEvent } from './model';

@Pipe({
  name: 'showStack',pure:false
})
export class ShowStackPipe implements PipeTransform {

  transform(value: any, args?: any): any {
console.log(value);
    return value.join('');

  }

}
