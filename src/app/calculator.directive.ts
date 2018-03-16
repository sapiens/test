import { CalculatorService, NumericOperationEvent, OperatorType, OperationEvent, BlockOperationEvent, InputActionsService, ValueAction, OperatorAction, BlockAction } from './model';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { isNumber } from 'util';


@Directive({
  selector: '[Calculator]'
})
export class CalculatorDirective {
  private domElement:HTMLInputElement;

  constructor(private el: ElementRef, private svc: CalculatorService, private actions:InputActionsService) {
    this.domElement=<HTMLInputElement>this.el.nativeElement;
  }

  @HostListener('resetCalculator')
  onreset() {
    this.domElement.value="";
  }




private addActionNumber(val:string,type?:OperatorType){
 console.log(val);

  if (val!=="" && val!=null && val!=undefined) {
    const number = Number.parseFloat(val);
   if (!isNaN(number))this.actions.add(new ValueAction(number));
 }
  if(type) this.actions.add(new OperatorAction(type));

  this.domElement.value="";
}


  @HostListener('keydown', ['$event'])
  onKeyUp(event) {

    let e = <KeyboardEvent>event;
    const field = (<HTMLInputElement>e.target);
    let val = field.value;

    switch (e.key) {

      case '+':
            this.addActionNumber(val,OperatorType.Add);
        break;
      case '-':
      this.addActionNumber(val,OperatorType.Substract);

        break;
      case '*':
      this.addActionNumber(val,OperatorType.Multiply);

        break;
      case '/':
      this.addActionNumber(val,OperatorType.Divide);

        break;
      case '(':
       this.actions.add(new BlockAction(true));

        break;
      case ')':
      this.addActionNumber(val);
      this.actions.add(new BlockAction(false));

        break;

      case '=':
      this.addActionNumber(val,OperatorType.Add);
       this.actions.endInput();
      this.svc.calculate(this.actions.getEvents());
    }

  }


}
