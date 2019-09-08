import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistogramComponent } from './components/histogram/histogram.component';
import { GraphComponent } from './components/graph/graph.component';



@NgModule({
  declarations: [
  HistogramComponent,
  GraphComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HistogramComponent,
    GraphComponent
  ],
})
export class SharedModule { }
