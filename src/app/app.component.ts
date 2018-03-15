import { OperationType, OperationEvent, CalculatorService } from './model';
import { Component } from '@angular/core';
import { Key } from 'protractor';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 value="";






constructor(private svc:CalculatorService) {


}

reset(input:HTMLInputElement){
  input.dispatchEvent(new Event('resetCalculator'));
}


}

