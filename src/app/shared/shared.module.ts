import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistogramComponent } from './components/histogram/histogram.component';



@NgModule({
  declarations: [
  HistogramComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HistogramComponent
  ]
})
export class SharedModule { }
