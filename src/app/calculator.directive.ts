import { CalculatorService, NumericOperationEvent, OperatorType, OperationEvent, BlockOperationEvent, InputActionsService, ValueAction, OperatorAction } from './model';
import { Directive, ElementRef, HostListener } from '@angular/core';


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




private addActionNumber(number:number,type:OperatorType){
  this.actions.add(new ValueAction(number));
  this.actions.add(new OperatorAction(type));

  this.domElement.value="";
}


  @HostListener('keyup', ['$event'])
  onKeyUp(event) {

    let e = <KeyboardEvent>event;
    const field = (<HTMLInputElement>e.target);
    let val = field.value;

    switch (e.key) {

      case '+':
        this.addActionNumber(Number.parseFloat(val),OperatorType.Add);
        break;
      case '-':


        break;
      case '*':

        break;
      case '/':

        break;
      case '(':


        break;
      case ')':


        break;

      case '=':
      this.addActionNumber(Number.parseFloat(val),OperatorType.Add);
      this.actions.getEvents()
    }

  }

  //  operators=["+","-","*","/","(",")"];

  //   private getLastNumber(val: string): number {

  //     console.log(`Value: ${val}`);

  //     let text=[];
  //     let last=val.length-1;
  //     if(this.operators.includes(val[val.length-1])){
  //       last=val.length-2;
  //     }
  //     for(let i=last;i>=0;i--){
  //       var v=val[i];
  //       if(this.operators.includes(v)) break;
  //       text.push(v);
  //     }
  //     let rez=Number.parseFloat(text.reverse().join(''));
  //     console.log(`rez: ${rez}`);
  //     return rez;
  //   }
}
