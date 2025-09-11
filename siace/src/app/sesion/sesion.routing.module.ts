import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SesionListComponent } from './sesion-list/sesion-list.component';
import { SesionEditComponent } from './sesion-edit/sesion-edit.component';

export const SESION_ROUTES: Routes = [
  {
    path: '',
    component: SesionListComponent
  },
  {
    path: ':id',
    component: SesionEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(SESION_ROUTES)],
   exports: [RouterModule]
})
export class SesionRoutingModule { }