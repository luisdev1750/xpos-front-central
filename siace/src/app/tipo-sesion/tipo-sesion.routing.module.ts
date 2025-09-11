import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoSesionListComponent } from './tipo-sesion-list/tipo-sesion-list.component';
import { TipoSesionEditComponent } from './tipo-sesion-edit/tipo-sesion-edit.component';

export const TIPO_SESION_ROUTES: Routes = [
  {
    path: '',
    component: TipoSesionListComponent
  },
  {
    path: ':id',
    component: TipoSesionEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(TIPO_SESION_ROUTES)],
   exports: [RouterModule]
})
export class TipoSesionRoutingModule { }