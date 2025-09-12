import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPerfilListComponent } from './menu-perfil-list/menu-perfil-list.component';
import { MenuPerfilEditComponent } from './menu-perfil-edit/menu-perfil-edit.component';

export const MENU_PERFIL_ROUTES: Routes = [
  {
    path: '',
    component: MenuPerfilListComponent
  },
  {
    path: ':id',
    component: MenuPerfilListComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(MENU_PERFIL_ROUTES)],
   exports: [RouterModule]
})
export class MenuPerfilRoutingModule { }