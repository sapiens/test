import { CalculatorService, OperationEvent, OperationType } from './model';
import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
  selector: '[Calculator]'
})
export class CalculatorDirective {

  constructor(private el: ElementRef, private svc: CalculatorService) {

  }

  lastOperator = OperationType.Add;

@HostListener('resetCalculator')
onreset(){
  var input=<HTMLInputElement>this.el.nativeElement;
  input.value='';
  this.lastOperator=OperationType.Add;

  this.svc.reset();
}

  @HostListener('keyup', ['$event']) onKeyUp(event) {

    let e = <KeyboardEvent>event;
    let val = (<HTMLInputElement>e.target).value;

    switch (e.key) {
      case '+':
        this.svc.register(new OperationEvent(this.getLastNumber(val), this.lastOperator));
        this.lastOperator = OperationType.Add;

        break;
      case '-':
        this.svc.register(new OperationEvent(this.getLastNumber(val), this.lastOperator));
        this.lastOperator = OperationType.Substract;

        break;
      case '*':
        this.svc.register(new OperationEvent(this.getLastNumber(val), this.lastOperator));
        this.lastOperator = OperationType.Multiply;

        break;
      case '/':
        this.svc.register(new OperationEvent(this.getLastNumber(val), this.lastOperator));
        this.lastOperator = OperationType.Substract;

        break;
      case '(':
        this.svc.register(new OperationEvent(0, this.lastOperator));
        this.lastOperator = OperationType.StartBlock;

        break;
      case ')':
        this.svc.register(new OperationEvent(0, OperationType.EndBlock));
        this.lastOperator = OperationType.Add;

        break;

        case '=':
        this.svc.register(new OperationEvent(this.getLastNumber(val), this.lastOperator));

        this.svc.calculate();break;
    }

  }

 operators=["+","-","*","/","(",")"];

  private getLastNumber(val: string): number {

    console.log(`Value: ${val}`);

    let text=[];
    let last=val.length-1;
    if(this.operators.includes(val[val.length-1])){
      last=val.length-2;
    }
    for(let i=last;i>=0;i--){
      var v=val[i];
      if(this.operators.includes(v)) break;
      text.push(v);
    }
    let rez=Number.parseFloat(text.reverse().join(''));
    console.log(`rez: ${rez}`);
    return rez;
  }
}
