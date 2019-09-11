import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphAlgorithmsComponent } from './graph-algorithms/graph-algorithms.component';

const routes: Routes = [
  {path: '', component: GraphAlgorithmsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraphAlgorithmsRoutingModule { }
