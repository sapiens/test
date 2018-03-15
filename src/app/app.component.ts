import { OperatorType, NumericOperationEvent, CalculatorService, InputActionsService } from './model';
import { Component } from '@angular/core';
import { Key } from 'protractor';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 value="";

constructor(private svc:CalculatorService, private actions:InputActionsService) {

this.actions.isReset.subscribe(r=> this.svc.reset());
}




reset(input:HTMLInputElement){
  this.actions.reset();
  this.svc.reset();
  input.dispatchEvent(new Event('resetCalculator'));
}



}

