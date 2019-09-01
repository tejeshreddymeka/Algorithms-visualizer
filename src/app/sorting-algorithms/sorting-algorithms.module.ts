import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortingAlgorithmsComponent } from './sorting-algorithms.component';
import { FormsModule } from '@angular/forms';
import { SortingAlgorithmsRoutingModule } from './sorting-algorithms-routing.module';
import { SharedModule } from '../shared/shared.module';
import {MatSliderModule} from '@angular/material/slider';

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
