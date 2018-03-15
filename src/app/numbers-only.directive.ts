import { Directive,Input,HostListener,ElementRef } from '@angular/core';
import { CalculatorService } from './model';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

  constructor(private el: ElementRef, private svc: CalculatorService) { }

  @HostListener('keydown', ['$event']) onKeyDown(event) {

    let e = <KeyboardEvent> event;
      let code=e.key.charCodeAt(0);


      //little hack to update the input, except operators
     if(!e.isTrusted && !(code==40 || code ==41 || code ==61)) event.target.value+=e.key;

      if ([46, 8, 9, 27, 13, 110, 190].indexOf(code) !== -1 ||



        // Allow: Ctrl+A
        (code === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (code === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (code === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (code === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (code >= 35 && code <= 39)) {



          // let it happen, don't do anything
          return;
        }


        // Ensure that it is a number and stop the keypress

        if (['0','1','2','3','4','5','6','7','8','9','.'].indexOf(e.key)==-1) e.preventDefault();


        console.log(code);
      }

}
