import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilListComponent } from './perfil-list/perfil-list.component';
import { PerfilEditComponent } from './perfil-edit/perfil-edit.component';

export const PERFIL_ROUTES: Routes = [
  {
    path: '',
    component: PerfilListComponent
  },
  {
    path: ':id',
    component: PerfilEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(PERFIL_ROUTES)],
   exports: [RouterModule]
})
export class PerfilRoutingModule { }