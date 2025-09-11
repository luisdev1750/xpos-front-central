import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApoyoListComponent } from './apoyo-list/apoyo-list.component';
import { ApoyoEditComponent } from './apoyo-edit/apoyo-edit.component';

export const APOYO_ROUTES: Routes = [
  {
    path: '',
    component: ApoyoListComponent
  },
  {
    path: ':id',
    component: ApoyoEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(APOYO_ROUTES)],
   exports: [RouterModule]
})
export class ApoyoRoutingModule { }