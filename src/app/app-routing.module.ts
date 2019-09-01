import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SortingAlgorithmsComponent } from './sorting-algorithms/sorting-algorithms.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'sorting-algorithms', loadChildren: () => import('./sorting-algorithms/sorting-algorithms.module').then(m => m.SortingAlgorithmsModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
