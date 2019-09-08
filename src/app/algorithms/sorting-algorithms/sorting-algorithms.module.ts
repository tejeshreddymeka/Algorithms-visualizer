import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortingAlgorithmsRoutingModule } from './sorting-algorithms-routing.module';
import { SharedModule } from '../../shared/shared.module';
import {MatSliderModule} from '@angular/material/slider';
import { SortingAlgorithmsComponent } from './sorting-algorithms/sorting-algorithms.component';

@NgModule({
  declarations: [
    SortingAlgorithmsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SortingAlgorithmsRoutingModule,
    SharedModule,
    MatSliderModule
  ],
  exports: [
    SortingAlgorithmsComponent
  ]
})
export class SortingAlgorithmsModule { }
