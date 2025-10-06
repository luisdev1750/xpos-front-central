import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuListComponent } from './menu-list/menu-list.component';
import { MenuEditComponent } from './menu-edit/menu-edit.component';

export const MARCA_ROUTES: Routes = [
  {
    path: '',
    component: MenuListComponent
  },
  {
    path: ':id',
    component: MenuEditComponent
  }
];

@NgModule({
   imports: [RouterModule.forChild(MARCA_ROUTES)],
   exports: [RouterModule]
})
export class MarcaRoutingModule { }