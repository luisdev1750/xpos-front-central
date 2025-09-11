import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PilarListComponent } from './pilar-list/pilar-list.component';
import { PilarEditComponent } from './pilar-edit/pilar-edit.component';

export const PILAR_ROUTES: Routes = [
  {
    path: '',
    component: PilarListComponent
  },
  {
    path: ':id',
    component: PilarEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(PILAR_ROUTES)],
   exports: [RouterModule]
})
export class PilarRoutingModule { }