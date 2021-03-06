import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphAlgorithmsComponent } from './graph-algorithms/graph-algorithms.component';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';

import { SharedModule } from 'src/app/shared/shared.module';
import { GraphAlgorithmsRoutingModule } from './graph-algorithms-routing.module';

@NgModule({
  declarations: [
    GraphAlgorithmsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatSliderModule,
    MatRadioModule,
    GraphAlgorithmsRoutingModule,
    SharedModule
  ]
})
export class GraphAlgorithmsModule { }
