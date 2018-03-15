import { OperatorType, NumericOperationEvent, CalculatorService, InputActionsService } from './model';
import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 value="";

constructor(public svc:CalculatorService, public actions:InputActionsService) {

this.actions.isReset.subscribe(r=> this.svc.reset());
}




reset(input:HTMLInputElement){
  this.actions.reset();
  this.svc.reset();
  input.dispatchEvent(new Event('resetCalculator'));
}

action(el:HTMLInputElement,value:string){

  el.dispatchEvent(new KeyboardEvent('keydown',{
    key:value
  }));
  el.focus();
}

}

