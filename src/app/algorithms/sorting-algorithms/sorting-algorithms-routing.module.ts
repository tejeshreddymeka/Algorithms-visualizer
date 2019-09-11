import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SortingAlgorithmsComponent } from './sorting-algorithms/sorting-algorithms.component';

const routes: Routes = [
  {path: '', component: SortingAlgorithmsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SortingAlgorithmsRoutingModule { }
