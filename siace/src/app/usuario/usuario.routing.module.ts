import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioEditComponent } from './usuario-edit/usuario-edit.component';

export const USUARIO_ROUTES: Routes = [
  {
    path: '',
    component: UsuarioListComponent
  },
  {
    path: ':id',
    component: UsuarioEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(USUARIO_ROUTES)],
   exports: [RouterModule]
})
export class UsuarioRoutingModule { }