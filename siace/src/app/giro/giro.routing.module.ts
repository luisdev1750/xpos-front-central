import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiroListComponent } from './giro-list/giro-list.component';
import { GiroEditComponent } from './giro-edit/giro-edit.component';

export const GIRO_ROUTES: Routes = [
  {
    path: '',
    component: GiroListComponent
  },
  {
    path: ':id',
    component: GiroEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(GIRO_ROUTES)],
   exports: [RouterModule]
})
export class GiroRoutingModule { }