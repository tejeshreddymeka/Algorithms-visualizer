import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'sorting-algorithms', loadChildren: () => import('./algorithms/sorting-algorithms/sorting-algorithms.module').then(m => m.SortingAlgorithmsModule)},
  {path: 'graph-algorithms', loadChildren: () => import('./algorithms/graph-algorithms/graph-algorithms.module').then(m => m.GraphAlgorithmsModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
