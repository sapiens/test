import { CalculatorService } from './model';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { OpTypePipe } from './op-type.pipe';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { CalculatorDirective } from './calculator.directive';


@NgModule({
  declarations: [
    AppComponent,
    OpTypePipe,
    NumbersOnlyDirective,
    CalculatorDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [CalculatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
