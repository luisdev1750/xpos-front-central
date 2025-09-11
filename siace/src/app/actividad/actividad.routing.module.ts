import { NgModule } from '@angular/core';
import { ActividadListComponent } from './actividad-list/actividad-list.component';
import { ActividadEditComponent } from './actividad-edit/actividad-edit.component';
import { Routes, RouterModule } from '@angular/router';

export const ACTIVIDAD_ROUTES: Routes = [
  {
    path: '',
    component: ActividadListComponent
  },
  {
    path: ':id',
    component: ActividadEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(ACTIVIDAD_ROUTES)],
   exports: [RouterModule]
})
export class ActividadRoutingModule { }