import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObjetivoListComponent } from './objetivo-list/objetivo-list.component';
import { ObjetivoEditComponent } from './objetivo-edit/objetivo-edit.component';

export const OBJETIVO_ROUTES: Routes = [
  {
    path: '',
    component: ObjetivoListComponent
  },
  {
    path: ':id',
    component: ObjetivoEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(OBJETIVO_ROUTES)],
   exports: [RouterModule]
})
export class ObjetivoRoutingModule { }