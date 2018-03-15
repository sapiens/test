import { CalculatorService, InputActionsService } from './model';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { OpTypePipe } from './op-type.pipe';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { CalculatorDirective } from './calculator.directive';
import { ShowStackPipe } from './show-stack.pipe';


@NgModule({
  declarations: [
    AppComponent,
    OpTypePipe,
    NumbersOnlyDirective,
    CalculatorDirective,
    ShowStackPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [CalculatorService,InputActionsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
