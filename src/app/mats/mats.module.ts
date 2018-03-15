import {MatButtonModule, MatCheckboxModule, MatGridListModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatButtonModule,MatGridListModule,MatFormFieldModule,MatInputModule],
  exports: [MatButtonModule,MatGridListModule,MatFormFieldModule,MatInputModule],
})

export class MatsModule { }
